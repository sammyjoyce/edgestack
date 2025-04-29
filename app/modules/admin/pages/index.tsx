import React, { type JSX } from "react";
import { data } from "react-router";
import type { Route } from "./+types/index";

import AdminDashboard from "../components/AdminDashboard";
// Removed duplicate import: import type { Route } from "./+types/index";

import { getAllContent, updateContent } from "~/db";
import { getSessionCookie, verify } from "~/modules/common/utils/auth";
import { validateContentInsert, validateErrorResponse } from "~/database/valibot-validation"; // Import validateErrorResponse
import { handleImageUpload } from "~/utils/upload.server"; // Import image upload helper

// Define a type for the possible responses from the centralized action
export type AdminActionResponse =
  | { success: true; url?: string; key?: string; message?: string } // Success (image upload, reorder, text update)
  | { success: false; error: string } // Specific error (bad request, validation)
  | { error: string }; // General error (unauthorized, invalid method, server error)


export async function loader({ request, context }: Route.LoaderArgs) {
  const unauthorized = () => data({ error: "Unauthorized" }, { status: 401 });

  const sessionValue = getSessionCookie(request);
  const jwtSecret = context.cloudflare?.env?.JWT_SECRET;
  if (!sessionValue || !jwtSecret || !(await verify(sessionValue, jwtSecret))) {
    return unauthorized();
  }

  const items = await getAllContent(context.db);
  return data(items);
}

// Centralized action for the admin dashboard
export async function action({ request, context }: Route.ActionArgs) {
  const unauthorized = () => data({ error: "Unauthorized" }, { status: 401 });
  const badRequest = (msg: string) => data({ success: false, error: msg }, { status: 400 });
  const serverError = (msg: string) => data({ success: false, error: msg }, { status: 500 });

  // Auth check
  const sessionValue = getSessionCookie(request);
  const jwtSecret = context.cloudflare?.env?.JWT_SECRET;
  if (!sessionValue || !jwtSecret || !(await verify(sessionValue, jwtSecret))) {
    return unauthorized();
  }

  if (request.method !== "POST") {
    return data({ error: "Invalid method" }, { status: 405 });
  }

  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    switch (intent) {
      case "uploadImage": {
        const file = formData.get("image");
        const key = formData.get("key");

        if (!file || !(file instanceof File)) return badRequest("No file uploaded.");
        if (!key || typeof key !== "string") return badRequest("Missing image key.");

        const publicUrl = await handleImageUpload(file, key, context);
        validateContentInsert({ key, value: publicUrl }); // Validate before DB update
        await updateContent(context.db, { [key]: publicUrl });
        return data({ success: true, url: publicUrl, key: key });
      }

      case "reorderSections": {
        const orderValue = formData.get("home_sections_order");
        if (typeof orderValue !== "string") return badRequest("Invalid section order.");
        validateContentInsert({ key: "home_sections_order", value: orderValue });
        await updateContent(context.db, { home_sections_order: orderValue });
        return data({ success: true });
      }

      case "updateTextContent":
      default: { // Default to text content update
        const updates: Record<string, string> = {};
        let validationError: string | null = null;

        for (const [key, value] of formData.entries()) {
           if (key === 'intent') continue; // Skip the intent field itself
           if (typeof value === "string") {
             try {
               // Allow empty strings, but validate if not empty
               if (value.trim() !== "") {
                 validateContentInsert({ key, value });
               }
               updates[key] = value;
             } catch (e: any) {
               validationError = `Validation failed for '${key}': ${e.message || e}`;
               break; // Stop on first validation error
             }
           }
        }

        if (validationError) {
          return badRequest(validationError);
        }

        if (Object.keys(updates).length === 0) {
          // Allow submitting empty fields if needed, otherwise return badRequest
           return data({ success: true, message: "No text content changed." });
          // return badRequest("No text content provided for update.");
        }

        await updateContent(context.db, updates);
        return data({ success: true });
      }
    }
  } catch (error: any) {
     console.error("Admin Action Error:", error);
     // Check if it's a validation error from Valibot and return 400
     if (error.issues) {
       return badRequest(`Validation Error: ${error.message}`);
     }
     return serverError("An unexpected error occurred.");
  }
}


export function Component(_props: Route.ComponentProps): JSX.Element {
  return (
    <main id="admin-dashboard-main" role="main" aria-label="Admin Dashboard">
      <AdminDashboard /> {/* <<< HERE */}
    </main>
  );
}
