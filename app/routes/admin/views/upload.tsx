import React from "react";
import { useActionData, useNavigation } from "react-router";
import { data, redirect } from "react-router";
import { eq } from "drizzle-orm";
import { file, ValiError } from "valibot";
import { FadeIn } from "~/routes/common/components/ui/FadeIn";
import { getSessionCookie, verify } from "~/routes/common/utils/auth";
import {
	deleteStoredImage,
	handleImageUpload,
	listStoredImages,
} from "~/utils/upload.server";
import * as FullSchema from "../../../../database/schema";
import { schema } from "../../../../database/schema";
import { validateContentInsert } from "../../../../database/valibot-validation.js";
import { ImageGallery } from "../components/ImageGallery";
import { ImageUploadSection } from "../components/ImageUploadSection";
import { FormCard } from "../components/ui/FormCard";
import { PageHeader } from "../components/ui/PageHeader";
import { Heading } from "../components/ui/heading";
import { Text } from "../components/ui/text";
import type { Route } from "./+types";

export async function loader({ context, request }: Route.LoaderArgs) {
	const sessionValue = getSessionCookie(request);
	const jwtSecret = context.cloudflare?.env?.JWT_SECRET;

	if (!sessionValue || !jwtSecret || !(await verify(sessionValue, jwtSecret))) {
		throw redirect("/admin/login");
	}

	try {
		const images = await listStoredImages(context);
		return { images };
	} catch (error) {
		console.error("Failed to load images:", error);
		throw data(
			{ error: "Unable to load images. Please try again later." },
			{ status: 500 },
		);
	}
}

async function handleDeleteImage(
	formData: FormData,
	context: Route.ActionArgs["context"],
) {
	const filename = formData.get("filename")?.toString();
	if (!filename) return { success: false, error: "Filename is required" };

	const deleted = await deleteStoredImage(filename, context);
	if (!deleted) return { success: false, error: "Failed to delete image" };

	const publicUrlBase = context.cloudflare?.env?.PUBLIC_R2_URL || "/assets";
	const fullUrl = `${publicUrlBase.replace(/\/?$/, "/")}${filename}`;

	await context.db.transaction(async (tx) => {
		const media = await tx
			.select({ id: FullSchema.schema.media.id })
			.from(schema.media)
			.where(eq(schema.media.url, fullUrl))
			.get();

		await tx.delete(schema.media).where(eq(schema.media.url, fullUrl)).run();

		if (media?.id) {
			await tx
				.update(schema.content)
				.set({ mediaId: null, value: "" })
				.where(eq(schema.content.mediaId, media.id))
				.run();
		}

		await tx
			.update(schema.content)
			.set({ value: "", mediaId: null })
			.where(eq(schema.content.value, fullUrl))
			.run();
	});

	return { success: true, action: "delete", filename };
}

async function handleSelectImage(
	formData: FormData,
	context: Route.ActionArgs["context"],
) {
	const key = formData.get("key")?.toString();
	const imageUrl = formData.get("imageUrl")?.toString();

	if (!key || !imageUrl) {
		return { success: false, error: "Key and image URL are required" };
	}

	try {
		validateContentInsert({
			key,
			value: imageUrl,
			page: "unknown",
			section: "image",
			type: "image",
		});

		await context.db.transaction(async (tx) => {
			const media = await tx
				.select({ id: FullSchema.schema.media.id })
				.from(FullSchema.schema.media)
				.where(eq(FullSchema.schema.media.url, imageUrl))
				.get();

			await tx
				.insert(schema.content)
				.values({ key, value: imageUrl, mediaId: media?.id ?? null })
				.onConflictDoUpdate({
					target: schema.content.key,
					set: {
						value: imageUrl,
						mediaId: media?.id ?? null,
						updatedAt: new Date(),
					},
				});
		});

		return { success: true, url: imageUrl, key, action: "select" };
	} catch (e) {
		return {
			success: false,
			error: e instanceof Error ? e.message : "Validation failed",
		};
	}
}

async function handleUploadImage(
	formData: FormData,
	context: Route.ActionArgs["context"],
) {
	const file = formData.get("image") as File | null;
	const key = formData.get("key")?.toString();

	if (!file || !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
		return { success: false, error: "Please upload a valid image (max 5MB)" };
	}
	if (!key) return { success: false, error: "Key is required" };

	const publicUrl = await handleImageUpload(file, key, context);
	if (!publicUrl || typeof publicUrl !== "string") {
		return { success: false, error: "Image upload failed" };
	}

	await context.db.transaction(async (tx) => {
		const mediaInsert = await tx
			.insert(FullSchema.schema.media)
			.values({ url: publicUrl, alt: file.name })
			.returning({ id: FullSchema.schema.media.id })
			.get();

		await tx
			.insert(schema.content)
			.values({ key, value: publicUrl, mediaId: mediaInsert?.id ?? null })
			.onConflictDoUpdate({
				target: schema.content.key,
				set: {
					value: publicUrl,
					mediaId: mediaInsert?.id ?? null,
					updatedAt: new Date(),
				},
			});
	});

	return { success: true, url: publicUrl, key, action: "upload" };
}

// Main action function
export async function action({ request, context }: Route.ActionArgs) {
	const typedContext = context;
	const sessionValue = getSessionCookie(request);
	const jwtSecret = typedContext.cloudflare?.env?.JWT_SECRET;

	if (!sessionValue || !jwtSecret || !(await verify(sessionValue, jwtSecret))) {
		return redirect("/admin/login");
	}

	if (request.method !== "POST") {
		return data(
			{ success: false, error: "Method not allowed" },
			{ status: 405 },
		);
	}

	try {
		const formData = await request.formData();
		const intent = formData.get("intent");

		switch (intent) {
			case "deleteImage":
				return await handleDeleteImage(formData, typedContext);
			case "selectImage":
				return await handleSelectImage(formData, typedContext);
			default:
				return await handleUploadImage(formData, typedContext);
		}
	} catch (error) {
		console.error("Action error:", error);
		return data(
			{ success: false, error: "An unexpected error occurred" },
			{ status: 500 },
		);
	}
}

// Component with improved UX
export default function ImageManagement({ loaderData }: Route.ComponentProps) {
	const actionData = useActionData<typeof action>();
	const navigation = useNavigation();
	const isLoading = navigation.state === "submitting";

	return (
		<FadeIn>
			<FormCard>
				<PageHeader title="Image Management" className="mb-2" actions={null} />
				<Text className="block mb-6 text-sm text-gray-500 dark:text-gray-400">
					Upload new images or select from existing ones. Images will be
					optimized and stored for use in your content.
				</Text>

				{/* Feedback messages */}
				{actionData?.error && (
					<div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
						{actionData.error}
					</div>
				)}
				{actionData?.success && (
					<div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
						Operation completed successfully!
					</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div>
						<Heading level={2} className="mb-4">
							Upload New Images
						</Heading>
						<ImageUploadSection
							initialContent={{}}
							isLoading={isLoading}
							actionData={actionData}
						/>
					</div>
					<div>
						<Heading level={2} className="mb-4">
							Manage Existing Images
						</Heading>
						<ImageGallery
							images={loaderData?.images}
							isLoading={isLoading}
							actionData={actionData}
						/>
					</div>
				</div>
			</FormCard>
		</FadeIn>
	);
}
