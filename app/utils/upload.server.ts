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
	const uniqueFilename = `${Date.now()}-${file.name.replace(
		/[^a-zA-Z0-9._-]/g, 
		"_", 
	)}`;
	try {
		const fileData = await file.arrayBuffer();
		await context.cloudflare.env.ASSETS_BUCKET.put(uniqueFilename, fileData, {
			httpMetadata: { contentType: file.type }, 
		});
		const publicUrlBase = context.cloudflare.env.PUBLIC_R2_URL;
		if (!publicUrlBase) {
			console.warn(
				"PUBLIC_R2_URL environment variable not set. Using relative path as fallback.",
			);
			return `/assets/${uniqueFilename}`; 
		}
		const publicUrl = `${publicUrlBase.replace(/\/?$/, "/")}${uniqueFilename}`;
		return publicUrl;
	} catch (error: unknown) {
		console.error(`R2 upload failed for key '${key}':`, error);
		let message = "Unknown error";
		if (error instanceof Error) {
			message = error.message;
		}
		throw new Error(`Failed to upload image to R2. ${message}`);
	}
}
