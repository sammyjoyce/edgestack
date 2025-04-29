import React, { type JSX } from "react";
import { data } from "react-router";
import type { Route } from "./+types/index";

import AdminDashboard from "../components/AdminDashboard";
// Removed duplicate import: import type { Route } from "./+types/index";

import { getAllContent, updateContent } from "~/db";
import { getSessionCookie, verify } from "~/modules/common/utils/auth";
import { validateContentInsert } from "~/database/valibot-validation";

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

export async function action({ request, context }: Route.ActionArgs) {
  const unauthorized = () => data({ error: "Unauthorized" }, { status: 401 });

  const badRequest = (msg: string) =>
    data({ success: false, error: msg }, { status: 400 });

  const sessionValue = getSessionCookie(request);
  const jwtSecret = context.cloudflare?.env?.JWT_SECRET;
  if (!sessionValue || !jwtSecret || !(await verify(sessionValue, jwtSecret))) {
    return unauthorized();
  }
  if (request.method === "POST") {
    try {
      const formData = await request.formData();
      const updates: Record<string, string> = {};
      for (const [key, value] of formData.entries()) {
        if (typeof value === "string") {
          // Validate using Valibot schema
          try {
            // Only validate if key/value is not empty
            if (!key || !value) throw new Error("Empty key or value");
            // Validate as a content insert
            // Import validateContentInsert from database/valibot-validation

            validateContentInsert({ key, value });
            updates[key] = value;
          } catch (e: any) {
            return badRequest(
              `Validation failed for key '${key}': ${e.message || e}`
            );
          }
        }
      }
      if (Object.keys(updates).length === 0) {
        return badRequest("Invalid content update payload.");
      }
      await updateContent(context.db, updates); // Remove 'as any'
      return data({ success: true });
    } catch (error: any) {
      return data(
        { success: false, error: "Error processing content update." },
        { status: 500 }
      );
    }
  }
  return data({ error: "Invalid method" }, { status: 405 });
}

export default function AdminIndex(_props: Route.ComponentProps): JSX.Element {
  return (
    <main id="admin-dashboard-main" role="main" aria-label="Admin Dashboard">
      <AdminDashboard /> {/* <<< HERE */}
    </main>
  );
}
