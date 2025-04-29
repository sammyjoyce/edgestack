import { data } from "react-router";
import type { Route } from "./+types/upload";

import { updateContent } from "~/db";
import { getSessionCookie, verify } from "~/modules/common/utils/auth";
import { validateContentInsert } from "~/database/valibot-validation";
import { handleImageUpload } from "~/utils/upload.server"; // Import the helper

export async function action({ request, context }: Route.ActionArgs) {
  const unauthorized = () => data({ error: "Unauthorized" }, { status: 401 });

  const badRequest = (msg: string) =>
    data({ success: false, error: msg }, { status: 400 });

  const sessionValue = getSessionCookie(request);
  if (
    !sessionValue ||
    !context.JWT_SECRET ||
    !(await verify(sessionValue, context.JWT_SECRET))
  ) {
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

      // Use the helper function for upload
      const publicUrl = await handleImageUpload(file, key, context); // Pass context directly

      // Validate before updating content DB
      try {
        validateContentInsert({ key, value: publicUrl });
      } catch (e: any) {
        return data(
          {
            success: false,
            error: `Validation failed for key '${key}': ${e.message || e}`,
          },
          { status: 400 }
        );
      }
      await updateContent(context.db, { [key]: publicUrl });

      return data({ success: true, url: publicUrl, key: key });
    } catch (error: any) {
      console.error("Upload Action Error:", error);
      return data(
        { success: false, error: "Error processing file upload." },
        { status: 500 }
      );
    }
  }
  return data({ error: "Invalid method" }, { status: 405 });
}
