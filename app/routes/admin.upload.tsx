import { data } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { getSessionCookie, verify } from "../utils/auth";

interface CloudflareEnv {
  ASSETS_BUCKET: R2Bucket;
  PUBLIC_R2_URL?: string;
  JWT_SECRET: string;
}

// Action: Handles POST /admin/upload (image upload)
export async function action({ request, context }: ActionFunctionArgs & { context: CloudflareEnv }) {
  const sessionValue = getSessionCookie(request);
  if (!sessionValue || !context.JWT_SECRET || !verify(sessionValue, context.JWT_SECRET)) {
    return data({ error: "Unauthorized" }, { status: 401 });
  }
  if (request.method === "POST") {
    try {
      const formData = await request.formData();
      const file = formData.get("image");
      if (!file || !(file instanceof File)) {
        return data({ success: false, error: "No file uploaded or invalid format." }, { status: 400 });
      }
      // Generate a unique filename
      const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const fileData = await file.arrayBuffer();
      await context.ASSETS_BUCKET.put(uniqueFilename, fileData, {
        httpMetadata: { contentType: file.type },
      });
      const publicUrl = context.PUBLIC_R2_URL
        ? `${context.PUBLIC_R2_URL.replace(/\/?$/, '/')}${uniqueFilename}`
        : `/assets/${uniqueFilename}`;
      return data({ success: true, url: publicUrl, filename: uniqueFilename });
    } catch (error: any) {
      return data({ success: false, error: "Error processing file upload." }, { status: 500 });
    }
  }
  return data({ error: "Invalid method" }, { status: 405 });
}
