import { updateContent } from "~/routes/common/db";
import React from "react";
import { validateContentInsert } from "~/database/valibot-validation";
import { FadeIn } from "~/routes/common/components/ui/FadeIn";
import { getSessionCookie, verify } from "~/routes/common/utils/auth";
import { handleImageUpload } from "~/utils/upload.server";
import { ImageUploadSection } from "../components/ImageUploadSection";
// Import generated types
import type { Route } from "./+types/upload"; // Ensure this path is correct

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

			// Validate before updating content DB
			try {
				validateContentInsert({ key, value: publicUrl });
			} catch (e: any) {
				return {
					success: false,
					error: `Validation failed for key '${key}': ${e.message || e}`,
				};
			}

			await updateContent(context.db, { [key]: publicUrl });

			return { success: true, url: publicUrl, key: key };
		} catch (error: any) {
			console.error("Upload error:", error);
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
					<h1 className="text-2xl font-semibold text-gray-900">Image Upload</h1>
					<p className="mt-2 text-sm text-gray-500">
						Upload images to use on your website. Images will be optimized and
						stored for use in your content.
					</p>
				</div>

				<ImageUploadSection initialContent={{}} />
			</div>
		</FadeIn>
	);
}
