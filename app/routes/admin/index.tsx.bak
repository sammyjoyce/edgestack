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
// import type { Route } from "./+types/index"; // REMOVE THIS

const DEFAULT_CONTENT = {
	hero_title: "Building Dreams, Creating Spaces",
	hero_subtitle: "Your trusted partner in construction and renovation.",
	home_sections_order: "hero,services,projects,about,contact",
} as const;

// ... other imports
import { validateContentInsert } from "../../../database/valibot-validation.js"; // Assuming a validation helper for maps
import { ValiError } from "valibot";

/* ---------------- LOADER ---------------- */
export async function loader({
	request,
	context,
}: Route.LoaderArgs): Promise<Route.LoaderData> { // Use generated type
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
// Update the return type of the action function
export async function action({
	request,
	context,
}: Route.ActionArgs): Promise<Response | Route.ActionData> { // Update return type to use generated ActionData
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
			// Return a JSON response for unauthorized access if called by a fetcher,
			// or throw a Response for page loads. Since actions are usually fetcher targets,
			// JSON is often more appropriate. For simplicity, a 401 response is also fine.
			return data({ success: false, error: "Unauthorized" }, { status: 401 });
		}

		if (request.method !== "POST") {
			return data({ success: false, error: "Method not allowed" }, { status: 405 });
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
    
			const validationErrors: Record<string, string> = {};
			for (const [key, valueToValidate] of Object.entries(updates)) {
				try {
					// Assuming content.value can be a plain string or a JSON string.
					// validateContentInsert will use the schema for content which expects `value` as text.
					validateContentInsert({ key, value: valueToValidate, page: "home", section: "unknown", type: "text" }); // Add required fields for schema, adjust if needed
				} catch (err) {
					if (err instanceof ValiError) {
						// Capture the first issue message for the specific key
						if (!validationErrors[key] && err.issues.length > 0) {
							validationErrors[key] = err.issues[0].message;
						}
					} else if (err instanceof Error) {
						 if (!validationErrors[key]) {
							validationErrors[key] = err.message;
						 }
					} else {
						if (!validationErrors[key]) {
						   validationErrors[key] = "Unknown validation error";
						}
					}
				}
			}
    
			if (Object.keys(validationErrors).length > 0) {
				return data({ success: false, errors: validationErrors, message: "Validation failed for one or more fields." }, { status: 400 });
			}
    
			if (DEBUG)
				console.log(`[ADMIN DASHBOARD ACTION] ${intent} updates:`, updates);
			await updateContent(context.db, updates);
			// Return JSON for fetchers, no redirect needed for background saves
			return data({ success: true, message: "Content updated successfully." });

		} else if (intent === "reorderSections") {
			const updates: Record<string, string> = {};
			for (const [key, value] of formData.entries()) {
				// Specifically look for home_sections_order or other relevant keys for reordering
				if (key === "home_sections_order" && typeof value === "string") {
					updates[key] = value;
				}
				// Add other keys if reorderSections handles more than just home_sections_order
			}
			invariant(Object.keys(updates).length > 0, "action: No updates provided for reorderSections");
			
			// Optional: Validation for section order string
			// e.g., validateContentInsert({ key: "home_sections_order", value: updates.home_sections_order });

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
		
		// Attempt to parse Valibot issues if they exist on the error
		// This is more relevant if the invariant or db call itself throws a Valibot error
		const errors: Record<string, string> = {};
		if (error instanceof ValiError) {
			for (const issue of error.issues) {
				const fieldName = issue.path?.[0]?.key as string | undefined;
				if (fieldName && !errors[fieldName]) {
					errors[fieldName] = issue.message;
				} else if (!fieldName && issue.message && !errors._general) { // Avoid overwriting if multiple general errors
					errors._general = issue.message;
				} else if (!fieldName && issue.message) {
					 errors._general += `; ${issue.message}`;
				}
			}
		} else if (err.message && !errors._general) { // Fallback for generic errors
			errors._general = err.message;
		}
    
		if (Object.keys(errors).length > 0) {
			return data({ success: false, errors, message: "An error occurred with specific fields." }, { status: 400 });
		}
    		
		const errorMessage = err.message || "Internal server error";
		return data({ success: false, error: errorMessage, message: "An internal server error occurred." }, { status: 500 });
	}
}

/* ---------------- COMPONENT -------------- */
export default function Component(): JSX.Element { // Renamed to Component
	const { content } = useLoaderData<Route.LoaderData>();

	return (
		<main id="admin-dashboard-main" aria-label="Admin Dashboard">
			<AdminDashboard initialContent={content} />
		</main>
	);
}
