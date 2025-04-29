import { data } from "react-router"; // Use data helper instead of json
import type { ActionFunctionArgs } from "react-router";
import { updateContent } from "../../../db/index"; // Import database update function
import { getSessionCookie, verify } from "../../../utils/auth";

interface CloudflareEnv {
  ASSETS_BUCKET: R2Bucket;
  PUBLIC_R2_URL?: string;
  JWT_SECRET: string;
  // Add DB type from AppLoadContext if available, otherwise use 'any' for now
  db: any;
}

// Action: Handles POST /admin/upload (image upload)
export async function action({
  request,
  context,
}: ActionFunctionArgs & { context: CloudflareEnv }) {
  const sessionValue = getSessionCookie(request);
  // Use await with verify as it's async
  if (
    !sessionValue ||
    !context.JWT_SECRET ||
    !(await verify(sessionValue, context.JWT_SECRET))
  ) {
    // Use data helper
    return data({ error: "Unauthorized" }, { status: 401 });
  }
  if (request.method === "POST") {
    try {
      const formData = await request.formData();
      const file = formData.get("image");
      const key = formData.get("key"); // Get the key for the database update

      if (!file || !(file instanceof File)) {
        // ARIA live region feedback for UI
        return data(
          {
            success: false,
            error: "No file uploaded or invalid format.",
            ariaMessage: "No file uploaded or invalid format.",
          },
          { status: 400 }
        );
      }
      if (!key || typeof key !== "string") {
        // ARIA live region feedback for UI
        return data(
          {
            success: false,
            error: "Missing key for database update.",
            ariaMessage: "Missing key for database update.",
          },
          { status: 400 }
        );
      }

      // Generate a unique filename
      const uniqueFilename = `${Date.now()}-${file.name.replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      )}`;
      const fileData = await file.arrayBuffer();

      // Upload to R2
      await context.ASSETS_BUCKET.put(uniqueFilename, fileData, {
        httpMetadata: { contentType: file.type },
      });

      // Construct public URL
      const publicUrl = context.PUBLIC_R2_URL
        ? `${context.PUBLIC_R2_URL.replace(/\/?$/, "/")}${uniqueFilename}`
        : `/assets/${uniqueFilename}`; // Assuming a fallback or local serving path

      // Validate key and publicUrl using Valibot
      try {
        const { validateContentInsert, validateMediaInsert } = await import(
          "../../../database/valibot-validation"
        );
        validateContentInsert({ key, value: publicUrl });
        // If you want to also store in media table, validate media object as well
        // Example: validateMediaInsert({ url: publicUrl, alt: file.name });
        // Uncomment and adapt the next lines if/when you add media DB logic:
        // const mediaObj = { url: publicUrl, alt: file.name };
        // validateMediaInsert(mediaObj);
        // await insertMedia(context.db, mediaObj);
      } catch (e: any) {
        return data(
          {
            success: false,
            error: `Validation failed for key '${key}': ${e.message || e}`,
          },
          { status: 400 }
        );
      }
      // Update the database content table
      await updateContent(context.db, { [key]: publicUrl });

      // Return success with the URL (useful for UI update)
      return data({ success: true, url: publicUrl, key: key }); // Include key in response
    } catch (error: any) {
      console.error("Upload Action Error:", error); // Log the error server-side
      return data(
        { success: false, error: "Error processing file upload." },
        { status: 500 }
      );
    }
  }
  // Use data helper
  return data({ error: "Invalid method" }, { status: 405 });
}
