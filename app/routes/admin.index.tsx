import React from "react";

/**
 * Admin Index Page (CMS UI)
 * This file will render the React version of the admin dashboard, replacing the static HTML.
 * You can further modularize this into components if needed.
 */
import AdminDashboard from "../components/admin/AdminDashboard";


import { getAllContent, updateContent } from "../db/index";
import { getSessionCookie, verify } from "../utils/auth";
import type { Route } from "./+types/admin.index";

export async function loader({ request, context }: Route.LoaderArgs) {
  const sessionValue = getSessionCookie(request);
  if (!sessionValue || !(context.cloudflare.env as any).JWT_SECRET || !(await verify(sessionValue, (context.cloudflare.env as any).JWT_SECRET))) {
    return { error: "Unauthorized", status: 401 };
  }
  const items = await getAllContent(context.db as any);
  return items;
}

export async function action({ request, context }: { request: Request, context: any }) {
  console.log("admin.index.tsx action invoked", request.method, request.url);
  const sessionValue = getSessionCookie(request);
  if (!sessionValue || !(context.cloudflare.env as any).JWT_SECRET || !(await verify(sessionValue, (context.cloudflare.env as any).JWT_SECRET))) {
    return { error: "Unauthorized", status: 401 };
  }
  if (request.method === "POST") {
    try {
      const formData = await request.formData();
      const updates: Record<string, string> = {};
      for (const [key, value] of formData.entries()) {
        if (typeof value === 'string') updates[key] = value;
      }
      if (Object.keys(updates).length === 0) {
        throw new Error('Invalid content update payload');
      }
      await updateContent(context.db as any, updates);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: "Error processing content update.", status: 500 };
    }
  }
  return { error: "Invalid method", status: 405 };
}

export default function AdminIndex() {
  return <AdminDashboard />;
}
