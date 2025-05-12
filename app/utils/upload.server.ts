import type { AppLoadContext } from "react-router";

export interface StoredImage {
	name: string;
	url: string;
	uploadDate: string;
	size?: number;
	contentType?: string;
}

export async function listStoredImages(
	context: AppLoadContext,
): Promise<StoredImage[]> {
	if (!context.cloudflare?.env?.ASSETS_BUCKET) {
		console.error(
			"R2 bucket (ASSETS_BUCKET) is not configured in context.cloudflare.env.",
		);
		throw new Error("R2 bucket (ASSETS_BUCKET) not configured.");
	}
	try {
		const listed = await context.cloudflare.env.ASSETS_BUCKET.list();
		const publicUrlBase = context.cloudflare.env.PUBLIC_R2_URL || "/assets";
		const images: StoredImage[] = listed.objects.map((obj) => {
			const url = `${publicUrlBase.replace(/\/?$/, "/")}${obj.key}`;
			let uploadDate = new Date().toISOString();
			if (obj.uploaded) {
				uploadDate = new Date(obj.uploaded).toISOString();
			} else {
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
		console.log(`Loaded ${images.length} images from R2`);
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

export async function deleteStoredImage(
	filename: string,
	context: AppLoadContext,
): Promise<boolean> {
	if (!context.cloudflare?.env?.ASSETS_BUCKET) {
		console.error(
			"R2 bucket (ASSETS_BUCKET) is not configured in context.cloudflare.env.",
		);
		throw new Error("R2 bucket (ASSETS_BUCKET) not configured.");
	}
	try {
		await context.cloudflare.env.ASSETS_BUCKET.delete(filename);
		console.log(`Deleted image '${filename}' from R2`);
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

export async function handleImageUpload(
	file: File,
	key: string,
	context: AppLoadContext,
): Promise<string> {
	if (!context.cloudflare?.env?.ASSETS_BUCKET) {
		console.error(
			"R2 bucket (ASSETS_BUCKET) is not configured in context.cloudflare.env.",
		);
		throw new Error("R2 bucket (ASSETS_BUCKET) not configured.");
	}
	if (!file || !(file instanceof File) || file.size === 0) {
		throw new Error("Invalid or empty file provided for upload.");
	}
	// Validate type and size
	const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
	if (!file.type.startsWith("image/")) {
		throw new Error(`Unsupported file type: ${file.type}`);
	}
	if (file.size > MAX_FILE_SIZE) {
		throw new Error(
			`File too large: ${file.size} bytes. Max is ${MAX_FILE_SIZE} bytes.`,
		);
	}
	// Generate unique key
	const ext = file.name.split(".")?.pop() ?? "";
	const prefix = key ? `${key.replace(/[^a-zA-Z0-9_-]/g, "")}/` : "";
	const uniqueFilename = `${prefix}${Date.now()}-${crypto.randomUUID()}.${ext}`;
	// Log upload attempt
	console.log(
		`Uploading '${file.name}' as '${uniqueFilename}', size ${file.size} bytes`,
	);
	try {
		// Stream file directly to R2 instead of buffering
		await context.cloudflare.env.ASSETS_BUCKET.put(
			uniqueFilename,
			file.stream(),
			{
				httpMetadata: { contentType: file.type },
			},
		);
		console.log(`Successfully uploaded to R2 bucket key: '${uniqueFilename}'`);
		const assetUrl = `/assets/${uniqueFilename}`;
		console.log(`Returning asset URL for worker proxy: ${assetUrl}`);
		return assetUrl;
	} catch (error: unknown) {
		console.error(`R2 upload failed for key '${uniqueFilename}':`, error);
		let message = "Unknown error";
		if (error instanceof Error) {
			message = error.message;
		}
		throw new Error(`Failed to upload image to R2. ${message}`);
	}
}
