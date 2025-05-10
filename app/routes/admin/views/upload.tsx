import type { Route } from "./+types/upload";
import { eq } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import React, { type JSX, useState } from "react";
import { data, redirect } from "react-router";
import { ValiError } from "valibot";
import { FadeIn } from "~/routes/common/components/ui/FadeIn";
import { updateContent } from "~/routes/common/db";
import { getSessionCookie, verify } from "~/routes/common/utils/auth";
import {
	type StoredImage,
	deleteStoredImage,
	handleImageUpload,
	listStoredImages,
} from "~/utils/upload.server";
import { schema } from "../../../../database/schema";
import * as FullSchema from "../../../../database/schema";
import { validateContentInsert } from "../../../../database/valibot-validation.js";
import { ImageGallery } from "../components/ImageGallery";
import { ImageUploadSection } from "../components/ImageUploadSection";
import { FormCard } from "../components/ui/FormCard";
import { PageHeader } from "../components/ui/PageHeader";
import { Heading } from "../components/ui/heading";
import { Input } from "../components/ui/input";
import { Text } from "../components/ui/text";
export async function loader({
	context,
	request,
	params,
}: Route.LoaderArgs): Promise<Route.LoaderData | Response> {
	const sessionValue = getSessionCookie(request);
	const jwtSecret = context.cloudflare?.env?.JWT_SECRET;
	if (!sessionValue || !jwtSecret || !(await verify(sessionValue, jwtSecret))) {
		throw redirect("/admin/login");
	}
	try {
		const images = await listStoredImages(context);
		return { images };
	} catch (error: any) {
		console.error("Error listing images:", error);
		throw data(
			{ error: `Failed to list images: ${error.message || "Unknown error"}` },
			{ status: 500 },
		);
	}
}
export async function action({
	request,
	context,
	params,
}: Route.ActionArgs): Promise<Response | Route.ActionData> {
	const unauthorized = () => {
		return redirect("/admin/login");
	};
	const badRequest = (msg: string, errors?: Record<string, string>) => {
		return data({ success: false, error: msg, errors }, { status: 400 });
	};
	const serverError = (msg: string) => {
		return data({ success: false, error: msg }, { status: 500 });
	};
	const sessionValue = getSessionCookie(request);
	const jwtSecret = context.cloudflare?.env?.JWT_SECRET;
	if (!sessionValue || !jwtSecret || !(await verify(sessionValue, jwtSecret))) {
		return unauthorized();
	}
	if (request.method === "POST") {
		try {
			const formData = await request.formData();
			const intent = formData.get("intent");
			if (intent === "deleteImage") {
				const filename = formData.get("filename")?.toString();
				if (!filename) {
					return badRequest("Missing filename for deletion.");
				}
				const r2Deleted = await deleteStoredImage(filename, context);
				if (!r2Deleted) {
					return serverError("Failed to delete image from storage.");
				}
				const publicUrlBase =
					context.cloudflare?.env?.PUBLIC_R2_URL || "/assets";
				const fullUrl = `${publicUrlBase.replace(/\/?$/, "/")}${filename}`;
				await context.db.transaction(async (tx) => {
					const mediaToDelete = await tx
						.select({ id: FullSchema.schema.media.id })
						.from(schema.media)
						.where(eq(schema.media.url, fullUrl))
						.get();
					await tx
						.delete(schema.media)
						.where(eq(schema.media.url, fullUrl))
						.run();
					if (mediaToDelete?.id) {
						await tx
							.update(schema.content)
							.set({ mediaId: null, value: "" })
							.where(eq(schema.content.mediaId, mediaToDelete.id))
							.run();
					}
					await tx
						.update(schema.content)
						.set({ value: "", mediaId: null })
						.where(eq(schema.content.value, fullUrl))
						.run();
				});
				return data({ success: true, action: "delete", filename });
			}
			if (intent === "selectImage") {
				const key = formData.get("key")?.toString();
				const imageUrl = formData.get("imageUrl")?.toString();
				if (!key) {
					return badRequest("Missing key for database update.");
				}
				if (!imageUrl) {
					return badRequest("Missing image URL.");
				}
				try {
					validateContentInsert({
						key,
						value: imageUrl,
						page: "unknown",
						section: "image",
						type: "image",
					});
				} catch (e: unknown) {
					const errors: Record<string, string> = {};
					if (e instanceof ValiError) {
						for (const issue of e.issues) {
							const fieldName = issue.path?.[0]?.key as string | undefined;
							if (fieldName && !errors[fieldName]) {
								errors[fieldName] = issue.message;
							} else if (!fieldName && issue.message && !errors[key]) {
								errors[key] = issue.message;
							}
						}
						return badRequest(`Validation failed for key '${key}'.`, errors);
					} else if (e instanceof Error) {
						errors[key] = e.message;
					} else {
						errors[key] = "An unknown validation error occurred.";
					}
					const errorMessage = e instanceof Error ? e.message : String(e);
					return badRequest(
						`Validation failed for key '${key}': ${errorMessage}`,
					);
				}
				await context.db.transaction(async (tx) => {
					const mediaRecord = await tx
						.select({ id: FullSchema.schema.media.id })
						.from(FullSchema.schema.media)
						.where(eq(FullSchema.schema.media.url, imageUrl))
						.get();
					const contentKeyVal = {
						key,
						value: imageUrl,
						mediaId: mediaRecord?.id ?? null,
					};
					validateContentInsert(contentKeyVal);
					await tx
						.insert(schema.content)
						.values(contentKeyVal)
						.onConflictDoUpdate({
							target: schema.content.key,
							set: {
								value: imageUrl,
								mediaId: mediaRecord?.id ?? null,
								updatedAt: new Date(),
							},
						});
				});
				return data({ success: true, url: imageUrl, key, action: "select" });
			}
			const file = formData.get("image") as File | null;
			const key = formData.get("key")?.toString();
			if (!file || !(file instanceof File)) {
				return badRequest("No file uploaded or invalid format.");
			}
			if (!key || typeof key !== "string") {
				return badRequest("Missing key for database update.");
			}
			const env = context.cloudflare?.env;
			if (!env) {
				return badRequest("Environment not available");
			}
			const publicUrl = await handleImageUpload(file, key, context);
			if (!publicUrl || typeof publicUrl !== "string") {
				const errorMsg =
					typeof publicUrl === "object" &&
					publicUrl !== null &&
					"error" in publicUrl
						? (publicUrl as { error: string }).error
						: "Failed to upload image";
				return badRequest(errorMsg);
			}
			try {
				validateContentInsert({
					key,
					value: publicUrl,
					page: "unknown",
					section: "image",
					type: "image",
				});
			} catch (e: unknown) {
				const errors: Record<string, string> = {};
				if (e instanceof ValiError) {
					for (const issue of e.issues) {
						const fieldName = issue.path?.[0]?.key as string | undefined;
						if (fieldName && !errors[fieldName]) {
							errors[fieldName] = issue.message;
						} else if (!fieldName && issue.message && !errors[key]) {
							errors[key] = issue.message;
						}
					}
					return badRequest(
						`Validation failed for key '${key}' (URL).`,
						errors,
					);
				} else if (e instanceof Error) {
					errors[key] = e.message;
				} else {
					errors[key] = "An unknown validation error occurred.";
				}
				const errorMessage = e instanceof Error ? e.message : String(e);
				return badRequest(
					`Validation failed for key '${key}' (URL): ${errorMessage}`,
				);
			}
			const mediaAltText = file.name;
			await context.db.transaction(async (tx) => {
				let newMediaId: number | null = null;
				try {
					const mediaInsertResult = await tx
						.insert(FullSchema.schema.media)
						.values({
							url: publicUrl,
							alt: mediaAltText,
						})
						.returning({ id: FullSchema.schema.media.id })
						.get();
					if (mediaInsertResult) {
						newMediaId = mediaInsertResult.id;
					} else {
						const runResult = await tx
							.insert(FullSchema.schema.media)
							.values({ url: publicUrl, alt: mediaAltText })
							.run();
						if (runResult.meta.last_row_id) {
							newMediaId = Number(runResult.meta.last_row_id);
						}
					}
				} catch (dbError) {
					console.error("Error inserting into media table:", dbError);
					if (dbError instanceof Error) {
						throw dbError;
					}
					throw new Error(
						typeof dbError === "string" ? dbError : JSON.stringify(dbError),
					);
				}
				const contentKeyVal = {
					key,
					value: publicUrl,
					mediaId: newMediaId,
				};
				validateContentInsert(contentKeyVal);
				await tx
					.insert(schema.content)
					.values(contentKeyVal)
					.onConflictDoUpdate({
						target: schema.content.key,
						set: {
							value: publicUrl,
							mediaId: newMediaId,
							updatedAt: new Date(),
						},
					});
			});
			return data({ success: true, url: publicUrl, key, action: "upload" });
		} catch (error: any) {
			console.error("Upload error or action processing error:", error);
			return serverError(error.message || "An unexpected error occurred");
		}
	}
	return data({ success: false, error: "Method not allowed" }, { status: 405 });
}
export default function Component({ loaderData, actionData, params }: Route.ComponentProps) {
	return (
		<FadeIn>
			<FormCard>
				<PageHeader title="Image Management" className="mb-2" actions={null} />
				<Text className="block mb-6 text-sm text-gray-500 dark:text-gray-400">
					Upload new images or select from existing ones. Images will be
					optimized and stored for use in your content.
				</Text>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div>
						<Heading level={2} className="mb-4">
							Upload New Images
						</Heading>
						<ImageUploadSection initialContent={{}} />
					</div>
					<div>
						<Heading level={2} className="mb-4">
							Manage Existing Images
						</Heading>
						<ImageGallery />
					</div>
				</div>
			</FormCard>
		</FadeIn>
	);
}
