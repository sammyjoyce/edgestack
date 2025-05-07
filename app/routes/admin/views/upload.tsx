import React, { useState } from "react";
import { validateContentInsert } from "~/database/valibot-validation";
import { updateContent } from "~/routes/common/db";
import { getSessionCookie, verify } from "~/routes/common/utils/auth";
import {
	type StoredImage,
	deleteStoredImage,
	handleImageUpload,
	listStoredImages,
} from "~/utils/upload.server";
import type { Route } from "./+types/upload";
import { ImageGallery } from "../components/ImageGallery";
import { ImageUploadSection } from "../components/ImageUploadSection";
import { FadeIn } from "../components/ui/FadeIn";

export async function loader({ context, request }: Route.LoaderArgs) {
	// Authentication check
	const sessionValue = getSessionCookie(request);
	const jwtSecret = context.cloudflare?.env?.JWT_SECRET;
	if (!sessionValue || !jwtSecret || !(await verify(sessionValue, jwtSecret))) {
		throw new Response("Unauthorized", { status: 401 });
	}

	try {
		// List all stored images
		const images = await listStoredImages(context);
		return { images };
	} catch (error: any) {
		console.error("Error listing images:", error);
		return { images: [], error: error.message || "Failed to list images" };
	}
}

export async function action({ request, context }: Route.ActionArgs) {
	const unauthorized = () => ({
		success: false,
		error: "Unauthorized",
	});

	const badRequest = (msg: string) => ({
		success: false,
		error: msg,
	});

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
				const filename = formData.get("filename");
				if (!filename || typeof filename !== "string") {
					return badRequest("Missing filename for deletion.");
				}

				const success = await deleteStoredImage(filename, context);
				return { success, action: "delete", filename };
			}

			// Handle image selection (updating content with existing image URL)
			if (intent === "selectImage") {
				const key = formData.get("key");
				const imageUrl = formData.get("imageUrl");

				if (!key || typeof key !== "string") {
					return badRequest("Missing key for database update.");
				}
				if (!imageUrl || typeof imageUrl !== "string") {
					return badRequest("Missing image URL.");
				}

				// Validate before updating content DB
				try {
					validateContentInsert({ key, value: imageUrl });
				} catch (e: any) {
					return {
						success: false,
						error: `Validation failed for key '${key}': ${e.message || e}`,
					};
				}

				await updateContent(context.db, { [key]: imageUrl });
				return { success: true, url: imageUrl, key, action: "select" };
			}

			// Handle image upload (existing functionality)
			const file = formData.get("image");
			const key = formData.get("key");

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
				return badRequest("Failed to upload image");
			}

			// Validate the publicUrl for content.value
			try {
				validateContentInsert({ key, value: publicUrl });
			} catch (e: any) {
				return {
					success: false,
					error: `Validation failed for key '${key}' (URL): ${e.message || e}`,
				};
			}
			
			const mediaAltText = file.name; 
			
			// Insert media and get its ID
			let newMediaId: number | null = null;
			try {
				const mediaInsertResult = await context.db.insert(schema.media).values({
					url: publicUrl,
					alt: mediaAltText,
				}).returning({ id: schema.media.id }).get();

				if (mediaInsertResult) {
					newMediaId = mediaInsertResult.id;
				} else {
					// Fallback for D1 if returning().get() is not ideal / returns undefined
					const runResult = await context.db.insert(schema.media).values({url: publicUrl, alt: mediaAltText}).run();
					if (runResult.meta.last_row_id) {
						newMediaId = runResult.meta.last_row_id;
					}
				}
			} catch (dbError) {
				console.error("Error inserting into media table:", dbError);
				// Decide if this error should prevent content update or just be logged
				// For now, we'll proceed to update content with URL only if media insert fails
			}
			
			// Now update content with the publicUrl and newMediaId (if available)
			await updateContent(context.db, { [key]: { value: publicUrl, mediaId: newMediaId } });

			return { success: true, url: publicUrl, key, action: "upload" };
		} catch (error: any) {
			console.error("Upload error or action processing error:", error);
			return {
				success: false,
				error: error.message || "An unexpected error occurred",
			};
		}
	}

	return badRequest("Method not allowed");
}

export default function UploadRoute() {
	return (
		<FadeIn>
			<div className="flex flex-col gap-8">
				<div>
					<h1 className="text-2xl font-semibold text-gray-900">
						Image Management
					</h1>
					<p className="mt-2 text-sm text-gray-500">
						Upload new images or select from existing ones. Images will be
						optimized and stored for use in your content.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div>
						<h2 className="text-xl font-medium text-gray-900 mb-4">
							Upload New Images
						</h2>
						<ImageUploadSection initialContent={{}} />
					</div>

					<div>
						<h2 className="text-xl font-medium text-gray-900 mb-4">
							Manage Existing Images
						</h2>
						<ImageGallery />
					</div>
				</div>
			</div>
		</FadeIn>
	);
}
