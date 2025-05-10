import React, { useEffect, useState } from "react";
import { Link, useLoaderData, redirect } from "react-router"; // Added useLoaderData and redirect
import invariant from "tiny-invariant";
const DEBUG = process.env.NODE_ENV !== "production";
import {
	getAllContent,
	updateContent,
} from "~/routes/common/db";
import { getSessionCookie, verify } from "~/routes/common/utils/auth";
import AdminDashboard from "../components/AdminDashboard";
import type { Route } from "./+types/index";

const DEFAULT_CONTENT = {
	hero_title: "Building Dreams, Creating Spaces",
	hero_subtitle: "Your trusted partner in construction and renovation.",
	home_sections_order: "hero,services,projects,about,contact",
} as const;

/* ---------------- LOADER ---------------- */
export async function loader({
	request,
	context,
}: Route.LoaderArgs): Promise<{ content: Record<string, string> }> {
	invariant(request instanceof Request, "loader: request must be a Request");
	invariant(context?.db, "loader: missing DB in context");
	const token = getSessionCookie(request);
	const secret = context.cloudflare?.env?.JWT_SECRET;

	invariant(secret, "loader: JWT_SECRET is required in context");
	if (!token || !(await verify(token, secret))) {
		// This loader is part of the admin layout which already performs this check.
		// However, if accessed directly and layout check is bypassed, this is a fallback.
		throw redirect("/admin/login");
	}

	const items = await getAllContent(context.db);
	invariant(
		items && typeof items === "object",
		"loader: items must be an object",
	);
	if (DEBUG)
		console.log("[ADMIN LOADER] Loaded content keys:", Object.keys(items));
	return { content: items };
}

/* ---------------- ACTION ---------------- */
export async function action({
	request,
	context,
}: Route.ActionArgs): Promise<Response | { success: boolean; error?: string; message?: string; errors?: Record<string, string>}> {
	if (DEBUG) console.log(
		"Action triggered in admin/views/index.tsx - THIS IS THE CORRECT ROUTE",
	);
	invariant(request instanceof Request, "action: request must be a Request");
	invariant(context?.db, "action: missing DB in context");
	try {
		const token = getSessionCookie(request);
		const secret = context.cloudflare?.env?.JWT_SECRET;
		invariant(secret, "action: JWT_SECRET is required in context");
		if (!token || !(await verify(token, secret))) {
			throw new Response("Unauthorized", { status: 401 });
		}

		if (request.method !== "POST") {
			return new Response(JSON.stringify({ error: "Method not allowed" }), {
				status: 405,
				headers: { "Content-Type": "application/json" },
			});
		}
		const formData = await request.formData();
		const intent = formData.get("intent")?.toString();

		if (intent === "updateTextContent") {
			const updates: Record<string, string> = {};
			for (const [key, value] of formData.entries()) {
				if (key !== "intent" && typeof value === "string") {
					updates[key] = value;
				}
			}
			invariant(Object.keys(updates).length > 0, "action: No updates provided for updateTextContent");
			if (DEBUG)
				console.log(`[ADMIN DASHBOARD ACTION] ${intent} updates:`, updates);
			await updateContent(context.db, updates);
			// Return JSON for fetchers, no redirect needed for background saves
			return data({ success: true, message: "Content updated successfully." });
		} else if (intent === "reorderSections") {
			const updates: Record<string, string> = {};
			for (const [key, value] of formData.entries()) {
				if (key !== "intent" && typeof value === "string") {
					updates[key] = value;
				}
			}
			invariant(Object.keys(updates).length > 0, "action: No updates provided for reorderSections");
			if (DEBUG) console.log("[ADMIN DASHBOARD ACTION] reorderSections updates:", updates);
			await updateContent(context.db, updates);
			return data({ success: true, message: "Sections reordered successfully." });
		}

		// Handle other intents or return error for unknown intents
		if (DEBUG) console.warn(`[ADMIN DASHBOARD ACTION] Unknown intent: ${intent}`);
		return data({ success: false, error: `Unknown intent: ${intent}` }, { status: 400 });

	} catch (error: unknown) {
		const err = error instanceof Error ? error : new Error(String(error));
		if (DEBUG) console.error("[ADMIN DASHBOARD ACTION] Error processing updates:", err);
		
		const errors: Record<string, string> = {};
		// Attempt to parse Valibot issues if they exist on the error
		if (err.issues && Array.isArray(err.issues)) {
			for (const issue of err.issues) {
				const fieldName = issue.path?.[0]?.key;
				if (typeof fieldName === 'string' && !errors[fieldName]) {
					errors[fieldName] = issue.message;
				}
			}
		}
		if (Object.keys(errors).length > 0) {
			return data({ success: false, errors }, { status: 400 });
		}
		
		const errorMessage = err.message || "Internal server error";
		return data({ success: false, error: errorMessage }, { status: 500 });
	}
}

/* ---------------- COMPONENT -------------- */
export default function AdminIndexRoute(): JSX.Element {
	const data = useLoaderData<typeof loader>();

	return (
		<main id="admin-dashboard-main" aria-label="Admin Dashboard">
			<AdminDashboard initialContent={data.content} />
		</main>
	);
}
