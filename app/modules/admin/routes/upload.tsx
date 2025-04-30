import React from "react";
import { data, type TypedResponse } from "react-router";
import { FadeIn } from "~/modules/common/components/ui/FadeIn";
import { ImageUploadSection } from "../components/ImageUploadSection";
// Import generated types
import type { Route } from "../../../.react-router/types/app/modules/admin/routes/upload";
import { updateContent } from "app/modules/common/db";
import { getSessionCookie, verify } from "~/modules/common/utils/auth";
import { validateContentInsert } from "~/database/valibot-validation";
import { handleImageUpload } from "~/utils/upload.server";

// Use inferred return type
export async function action({ request, context }: Route.ActionArgs) {
  const unauthorized = () =>
    // Use data helper
    data({ success: false, error: "Unauthorized" }, { status: 401 });

  const badRequest = (msg: string) =>
    // Use data helper
    data({ success: false, error: msg }, { status: 400 });

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
      const publicUrl = await handleImageUpload(file, key, context as any);
      if (!publicUrl || typeof publicUrl !== "string") {
        return badRequest("Failed to upload image");
      }

      // Validate before updating content DB
      try {
        validateContentInsert({ key, value: publicUrl });
      } catch (e: any) {
        // Use data helper for validation error
        return data(
          {
            success: false,
            error: `Validation failed for key '${key}': ${e.message || e}`,
          },
          { status: 400 }
        );
      }

      await updateContent(context.db, { [key]: publicUrl });

      // Use data helper for success
      return data({ success: true, url: publicUrl, key: key });
    } catch (error: any) {
      console.error("Upload error:", error);
      // Use data helper for general error
      return data(
        {
          success: false,
          error: error.message || "An unexpected error occurred",
        },
        { status: 500 }
      );
    }
  }

  return badRequest("Method not allowed");
}

export function Component() {
  return (
    <FadeIn>
      <div className="space-y-8">
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
