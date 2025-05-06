import type { AppLoadContext } from "react-router";

/**
 * Represents an image stored in the R2 bucket
 */
export interface StoredImage {
	name: string;
	url: string;
	uploadDate: string; // ISO date string
	size?: number;
	contentType?: string;
}

/**
 * Lists all images stored in the R2 bucket
 * @param context The application load context containing Cloudflare environment variables
 * @returns Array of stored images with their metadata
 */
export async function listStoredImages(
	context: AppLoadContext,
): Promise<StoredImage[]> {
	// Ensure the R2 bucket binding exists in the environment context
	if (!context.cloudflare?.env?.ASSETS_BUCKET) {
		console.error(
			"R2 bucket (ASSETS_BUCKET) is not configured in context.cloudflare.env.",
		);
		throw new Error("R2 bucket (ASSETS_BUCKET) not configured.");
	}

	try {
		// List objects in the R2 bucket
		const listed = await context.cloudflare.env.ASSETS_BUCKET.list();
		const publicUrlBase = context.cloudflare.env.PUBLIC_R2_URL || "/assets";

		// Map objects to StoredImage interface
		const images: StoredImage[] = listed.objects.map((obj) => {
			// Ensure the base URL has a trailing slash before appending the filename
			const url = `${publicUrlBase.replace(/\/?$/, "/")}${obj.key}`;

			// Extract upload date from filename or use uploaded date
			let uploadDate = new Date().toISOString();
			if (obj.uploaded) {
				uploadDate = new Date(obj.uploaded).toISOString();
			} else {
				// Try to extract date from filename (assumes format: timestamp-filename.ext)
				const dateMatch = obj.key.match(/^(\d+)-/);
				if (dateMatch?.[1]) {
					const timestamp = Number.parseInt(dateMatch[1], 10);
					if (!Number.isNaN(timestamp)) {
						uploadDate = new Date(timestamp).toISOString();
					}
				}
			}

			return {
				name: obj.key,
				url,
				uploadDate,
				size: obj.size,
				contentType: obj.httpMetadata?.contentType,
			};
		});

		// Sort by upload date, newest first
		return images.sort(
			(a, b) =>
				new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime(),
		);
	} catch (error: unknown) {
		console.error("Failed to list images from R2:", error);
		let message = "Unknown error";
		if (error instanceof Error) {
			message = error.message;
		}
		throw new Error(`Failed to list images from R2. ${message}`);
	}
}

/**
 * Deletes an image from the R2 bucket by its filename
 * @param filename The filename of the image to delete
 * @param context The application load context containing Cloudflare environment variables
 * @returns True if deletion was successful
 */
export async function deleteStoredImage(
	filename: string,
	context: AppLoadContext,
): Promise<boolean> {
	// Ensure the R2 bucket binding exists in the environment context
	if (!context.cloudflare?.env?.ASSETS_BUCKET) {
		console.error(
			"R2 bucket (ASSETS_BUCKET) is not configured in context.cloudflare.env.",
		);
		throw new Error("R2 bucket (ASSETS_BUCKET) not configured.");
	}

	try {
		await context.cloudflare.env.ASSETS_BUCKET.delete(filename);
		return true;
	} catch (error: unknown) {
		console.error(`Failed to delete image '${filename}' from R2:`, error);
		let message = "Unknown error";
		if (error instanceof Error) {
			message = error.message;
		}
		throw new Error(`Failed to delete image from R2. ${message}`);
	}
}

/**
 * Handles uploading a file to the R2 bucket and returns the public URL.
 * Throws an error if the upload fails or if configuration is missing.
 * @param file The File object to upload.
 * @param key A contextual key (e.g., 'hero_image_url', 'project-123-image') used for logging/potential future use.
 * @param context The application load context containing Cloudflare environment variables.
 * @returns The public URL of the uploaded file.
 */
export async function handleImageUpload(
	file: File,
	key: string,
	context: AppLoadContext,
): Promise<string> {
	// Ensure the R2 bucket binding exists in the environment context
	if (!context.cloudflare?.env?.ASSETS_BUCKET) {
		console.error(
			"R2 bucket (ASSETS_BUCKET) is not configured in context.cloudflare.env.",
		);
		throw new Error("R2 bucket (ASSETS_BUCKET) not configured.");
	}
	// Basic file validation
	if (!file || !(file instanceof File) || file.size === 0) {
		throw new Error("Invalid or empty file provided for upload.");
	}

	// Generate a unique filename to avoid collisions (timestamp + sanitized name)
	const uniqueFilename = `${Date.now()}-${file.name.replace(
		/[^a-zA-Z0-9._-]/g, // Allow letters, numbers, dot, underscore, hyphen
		"_", // Replace invalid characters with underscore
	)}`;

	try {
		// Read file data as ArrayBuffer
		const fileData = await file.arrayBuffer();
		// Upload to R2 bucket
		await context.cloudflare.env.ASSETS_BUCKET.put(uniqueFilename, fileData, {
			httpMetadata: { contentType: file.type }, // Set Content-Type for proper serving
		});

		// Construct the public URL
		// TODO: Restore types.d.ts for proper typing of PUBLIC_R2_URL
		const publicUrlBase = context.cloudflare.env.PUBLIC_R2_URL;
		if (!publicUrlBase) {
			console.warn(
				"PUBLIC_R2_URL environment variable not set. Using relative path as fallback.",
			);
			// Provide a fallback URL structure if the public URL base is not configured
			return `/assets/${uniqueFilename}`; // Example fallback using a relative path
		}

		// Ensure the base URL has a trailing slash before appending the filename
		const publicUrl = `${publicUrlBase.replace(/\/?$/, "/")}${uniqueFilename}`;
		return publicUrl;
	} catch (error: unknown) {
		console.error(`R2 upload failed for key '${key}':`, error);
		let message = "Unknown error";
		if (error instanceof Error) {
			message = error.message;
		}
		// Throw a more specific error for easier debugging
		throw new Error(`Failed to upload image to R2. ${message}`);
	}
}
