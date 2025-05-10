import { eq } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import React, { type JSX, useState } from "react";
import { ValiError } from "valibot";
import { data } from "react-router";
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
import type * as FullSchema from "../../../../database/schema";
import { validateContentInsert } from "../../../../database/valibot-validation.js";
import { ImageGallery } from "../components/ImageGallery";
import { ImageUploadSection } from "../components/ImageUploadSection";
import { Heading } from "../components/ui/heading";
import { Input } from "../components/ui/input";
import { Text } from "../components/ui/text";
import type { Route } from "./+types/upload";

// import { validateContentInsert } from "../../../../database/valibot-validation"; // Commented out due to missing file

export async function loader({ context, request }: Route.LoaderArgs): Promise<Route.LoaderData | Response> { // Update return type
	// Authentication check
	const sessionValue = getSessionCookie(request);
	const jwtSecret = context.cloudflare?.env?.JWT_SECRET;
	if (!sessionValue || !jwtSecret || !(await verify(sessionValue, jwtSecret))) {
		throw redirect("/admin/login"); // throw redirect
	}

	try {
		// List all stored images
		const images = await listStoredImages(context);
		return { images }; // Return plain object
	} catch (error: any) {
		console.error("Error listing images:", error);
		throw data( // throw data()
			{ error: `Failed to list images: ${error.message || "Unknown error"}` },
			{ status: 500 },
		);
	}
}

export async function action({ request, context }: Route.ActionArgs): Promise<Response | Route.ActionData> { // Update return type
	const unauthorized = () => {
		return redirect("/admin/login"); // return redirect
	};

	const badRequest = (msg: string, errors?: Record<string, string>) => { // Allow passing errors
		return data({ success: false, error: msg, errors }, { status: 400 }); // return data()
	};

	const serverError = (msg: string) => {
		return data({ success: false, error: msg }, { status: 500 }); // return data()
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

			// Handle image deletion
			if (intent === "deleteImage") {
				const filename = formData.get("filename")?.toString(); // R2 key
				if (!filename) {
					return badRequest("Missing filename for deletion.");
				}

				const r2Deleted = await deleteStoredImage(filename, context);
				if (!r2Deleted) {
					return serverError("Failed to delete image from storage."); // Use serverError
				}

				const publicUrlBase =
					context.cloudflare?.env?.PUBLIC_R2_URL || "/assets";
				const fullUrl = `${publicUrlBase.replace(/\/?$/, "/")}${filename}`;

				await context.db.transaction(async (tx: DrizzleD1Database<typeof FullSchema.schema>) => {
					// Operations within transaction
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
							.set({ mediaId: null, value: "" }) // Clear link and value
							.where(eq(schema.content.mediaId, mediaToDelete.id))
							.run();
					}
					// Fallback: also clear content if it directly stores the URL in 'value'
					await tx
						.update(schema.content)
						.set({ value: "", mediaId: null }) // Ensure mediaId is also cleared here
						.where(eq(schema.content.value, fullUrl))
						.run();
				});

				return data({ success: true, action: "delete", filename });
			}

			// Handle image selection (updating content with existing image URL)
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
					// Add other required fields for contentInsertSchema or use a more specific schema
					validateContentInsert({ key, value: imageUrl, page: "unknown", section: "image", type: "image" });
				} catch (e: unknown) { // Catch as unknown
					const errors: Record<string, string> = {};
					if (e instanceof ValiError) { // Type check for ValiError
						for (const issue of e.issues) {
							const fieldName = issue.path?.[0]?.key as string | undefined;
							if (fieldName && !errors[fieldName]) {
								errors[fieldName] = issue.message;
							} else if (!fieldName && issue.message && !errors[key]){
								errors[key] = issue.message;
							}
						}
						return badRequest(`Validation failed for key '${key}'.`, errors); // Pass errors
					} else if (e instanceof Error) {
						errors[key] = e.message; // General error for this key
					} else {
						errors[key] = "An unknown validation error occurred.";
					}
    
					// This part might be unreachable if errors always populate, but as a fallback:
					const errorMessage = e instanceof Error ? e.message : String(e);
					return badRequest(`Validation failed for key '${key}': ${errorMessage}`);
				}
    
				// updateContent uses batch internally. To ensure atomicity with media selection,
				// we perform the content update within the same transaction.
				await context.db.transaction(async (tx: DrizzleD1Database<typeof FullSchema.schema>) => {
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
					validateContentInsert(contentKeyVal); // Validate before db operation

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

			// Handle image upload (existing functionality)
			const file = formData.get("image") as File | null;
			const key = formData.get("key")?.toString();

			if (!file || !(file instanceof File)) {
				return badRequest("No file uploaded or invalid format.");
			}
			if (!key || typeof key !== "string") {
				return badRequest("Missing key for database update.");
			}

			// Get the Cloudflare environment
			const env = context.cloudflare?.env;
			if (!env) {
				return badRequest("Environment not available");
			}

			// Use the helper function for upload with type assertion for consistency
			const publicUrl = await handleImageUpload(file, key, context);
			if (!publicUrl || typeof publicUrl !== "string") {
				// Check if publicUrl is an error object from handleImageUpload
				const errorMsg = typeof publicUrl === 'object' && publicUrl !== null && 'error' in publicUrl ? (publicUrl as {error: string}).error : "Failed to upload image";
				return badRequest(errorMsg);
			}
    
			try {
				// Add other required fields for contentInsertSchema or use a more specific schema
				validateContentInsert({ key, value: publicUrl, page: "unknown", section: "image", type: "image" });
			} catch (e: unknown) { // Catch as unknown
				const errors: Record<string, string> = {};
				if (e instanceof ValiError) { // Type check for ValiError
					for (const issue of e.issues) {
						const fieldName = issue.path?.[0]?.key as string | undefined;
						if (fieldName && !errors[fieldName]) {
							errors[fieldName] = issue.message;
						} else if (!fieldName && issue.message && !errors[key]){
							errors[key] = issue.message;
						}
					}
					return badRequest(`Validation failed for key '${key}' (URL).`, errors); // Pass errors
				} else if (e instanceof Error) {
					errors[key] = e.message; // General error for this key
				} else {
					errors[key] = "An unknown validation error occurred.";
				}
    
				// This part might be unreachable if errors always populate, but as a fallback:
				const errorMessage = e instanceof Error ? e.message : String(e);
				return badRequest(`Validation failed for key '${key}' (URL): ${errorMessage}`);
			}
    
			const mediaAltText = file.name;

			await context.db.transaction(async (tx: DrizzleD1Database<typeof FullSchema.schema>) => {
				// Insert media and get its ID
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
						// Fallback for D1 if returning().get() is not ideal / returns undefined
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
					// Decide if this error should prevent content update or just be logged
					// For now, we'll proceed to update content with URL only if media insert fails
					// Throwing error here will rollback the transaction.
					if (dbError instanceof Error) {
						throw dbError;
					}
					throw new Error(
						typeof dbError === "string" ? dbError : JSON.stringify(dbError),
					);
				}

				// Now update content with the publicUrl and newMediaId (if available)
				// Perform content update within the same transaction for atomicity.
				const contentKeyVal = {
					key,
					value: publicUrl,
					mediaId: newMediaId,
				};
				validateContentInsert(contentKeyVal); // Validate before db operation

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
			return serverError(error.message || "An unexpected error occurred"); // Use serverError
		}
	}

	return data({ success: false, error: "Method not allowed" }, { status: 405 });
}

export default function Component() { // Renamed to Component
	return (
		<FadeIn>
			<div className="flex flex-col gap-8">
				<div>
					<Heading level={1}>Image Management</Heading>
					<Text className="mt-2 text-sm text-gray-500">
						Upload new images or select from existing ones. Images will be
						optimized and stored for use in your content.
					</Text>
				</div>

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
			</div>
		</FadeIn>
	);
}
