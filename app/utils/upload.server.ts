import type { AppLoadContext } from "react-router";

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
  context: AppLoadContext
): Promise<string> {
  // Ensure the R2 bucket binding exists in the environment context
  if (!context.cloudflare?.env?.ASSETS_BUCKET) {
    console.error("R2 bucket (ASSETS_BUCKET) is not configured in context.cloudflare.env.");
    throw new Error("R2 bucket (ASSETS_BUCKET) not configured.");
  }
  // Basic file validation
  if (!file || !(file instanceof File) || file.size === 0) {
    throw new Error("Invalid or empty file provided for upload.");
  }

  // Generate a unique filename to avoid collisions (timestamp + sanitized name)
  const uniqueFilename = `${Date.now()}-${file.name.replace(
    /[^a-zA-Z0-9._-]/g, // Allow letters, numbers, dot, underscore, hyphen
    "_" // Replace invalid characters with underscore
  )}`;

  try {
    // Read file data as ArrayBuffer
    const fileData = await file.arrayBuffer();
    // Upload to R2 bucket
    await context.cloudflare.env.ASSETS_BUCKET.put(uniqueFilename, fileData, {
      httpMetadata: { contentType: file.type }, // Set Content-Type for proper serving
    });

    // Construct the public URL
    const publicUrlBase = context.cloudflare.env.PUBLIC_R2_URL;
    if (!publicUrlBase) {
      console.warn("PUBLIC_R2_URL environment variable not set. Using relative path as fallback.");
      // Provide a fallback URL structure if the public URL base is not configured
      return `/assets/${uniqueFilename}`; // Example fallback using a relative path
    }

    // Ensure the base URL has a trailing slash before appending the filename
    const publicUrl = `${publicUrlBase.replace(/\/?$/, "/")}${uniqueFilename}`;
    return publicUrl;

  } catch (error: any) {
    console.error(`R2 upload failed for key '${key}':`, error);
    // Throw a more specific error for easier debugging
    throw new Error(`Failed to upload image to R2. ${error.message || "Unknown error"}`);
  }
}
