import React, { type JSX } from "react";
import { data } from "react-router";
import type { Route } from "~/modules/admin/+types/route";

import AdminDashboard from "../components/AdminDashboard";

// Database and Utils
import { getAllContent, updateContent } from "app/modules/common/db";
import { getSessionCookie, verify } from "~/modules/common/utils/auth";
import { validateContentInsert } from "~/database/valibot-validation";

// Define a type for the possible responses from this action
export type AdminDashboardActionResponse =
  | { success: true; message?: string } // Success (reorder, text update)
  | { success: false; error: string } // Specific error (bad request, validation)
  | { error: string }; // General error (unauthorized, invalid method, server error)

// Loader to get dashboard content
export async function loader({ request, context }: Route.LoaderArgs) {
  // Auth check (could rely on layout loader, but explicit check is safer)
  const sessionValue = getSessionCookie(request);
  const jwtSecret = context.cloudflare?.env?.JWT_SECRET;
  if (!sessionValue || !jwtSecret || !(await verify(sessionValue, jwtSecret))) {
    // Note: Layout loader should ideally handle the redirect,
    // but returning an error here provides feedback if layout fails.
    return data({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await getAllContent(context.db);
    return data(items); // Return content object directly
  } catch (error) {
    console.error("Admin Loader Error:", error);
    return data({ error: "Failed to load dashboard content" }, { status: 500 });
  }
}

// Centralized action for the admin dashboard (excluding image uploads)
export async function action({ request, context }: Route.ActionArgs) {
  const unauthorized = () =>
    data({ error: "Unauthorized" } as AdminDashboardActionResponse, {
      status: 401,
    });
  const badRequest = (msg: string) =>
    data({ success: false, error: msg } as AdminDashboardActionResponse, {
      status: 400,
    });
  const serverError = (msg: string) =>
    data({ success: false, error: msg } as AdminDashboardActionResponse, {
      status: 500,
    });

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
      case "reorderSections": {
        const orderValue = formData.get("home_sections_order");
        if (typeof orderValue !== "string")
          return badRequest("Invalid section order data.");

        // Basic validation
        try {
          validateContentInsert({
            key: "home_sections_order",
            value: orderValue,
          });
        } catch (e: any) {
          return badRequest(
            `Validation failed for section order: ${e.message || e}`
          );
        }

        await updateContent(context.db, { home_sections_order: orderValue });
        return data({
          success: true,
          message: "Section order saved.",
        } as AdminDashboardActionResponse);
      }

      case "updateTextContent":
      default: {
        // Default to text content update if intent is missing or matches
        const updates: Record<string, string> = {};
        let validationError: string | null = null;

        for (const [key, value] of formData.entries()) {
          if (key === "intent") continue; // Skip the intent field itself
          if (typeof value === "string") {
            try {
              // Allow empty strings to be saved, but validate structure if not empty
              validateContentInsert({ key, value }); // Validate all text content updates
              updates[key] = value;
            } catch (e: any) {
              validationError = `Validation failed for '${key}': ${
                e.message || e
              }`;
              break; // Stop on first validation error for immediate feedback
            }
          }
        }

        if (validationError) {
          return badRequest(validationError); // Return the specific validation error
        }

        if (
          Object.keys(updates).length === 0 &&
          intent !== "updateTextContent"
        ) {
          // If no intent specified and no updates found, maybe it was an invalid request
          return badRequest("No valid operation specified.");
        } else if (
          Object.keys(updates).length === 0 &&
          intent === "updateTextContent"
        ) {
          // If intent was explicitly updateTextContent but no fields changed
          return data({
            success: true,
            message: "No text content changed.",
          } as AdminDashboardActionResponse);
        }

        await updateContent(context.db, updates);
        // Respond with success, potentially identifying which field was updated if only one
        const updatedKeys = Object.keys(updates);
        const message =
          updatedKeys.length === 1
            ? `Saved changes for '${updatedKeys[0]}'.`
            : "Text content saved.";
        return data({ success: true, message } as AdminDashboardActionResponse);
      }
    }
  } catch (error: any) {
    console.error("Admin Action Error:", error);
    // Check if it's a known validation error structure
    if (error.issues) {
      const issueMessages = error.issues
        .map((issue: any) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      return badRequest(`Validation Error: ${issueMessages}`);
    }
    return serverError(
      "An unexpected error occurred while processing your request."
    );
  }
}

// The component now simply renders the AdminDashboard
export function Component(): JSX.Element {
  return (
    <main id="admin-dashboard-main" role="main" aria-label="Admin Dashboard">
      <AdminDashboard />{" "}
      {/* Renders the component containing all editors/sorters */}
    </main>
  );
}
