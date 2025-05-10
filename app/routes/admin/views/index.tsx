import React, { type JSX } from "react";
import invariant from "tiny-invariant";
const DEBUG = process.env.NODE_ENV !== "production";
import {
	redirect,
	useFetcher,
	useLoaderData,
	useNavigation,
	data, // Import the data helper
} from "react-router";
import {
	getAllContent,
	updateContent,
	updateProject,
} from "~/routes/common/db";
import { getSessionCookie, verify } from "~/routes/common/utils/auth";
import AdminDashboard from "../components/AdminDashboard";
import { Fieldset, Legend } from "../components/ui/fieldset";
import { Heading } from "../components/ui/heading";
import { Text } from "../components/ui/text";
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

// ... other imports
import { validateContentInsert, validateContentUpdateMap } from "~/database/valibot-validation"; // Assuming a validation helper for maps

// ... (loader function remains the same)

/* ---------------- ACTION ---------------- */
// Update the return type of the action function
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
			
			// Optional: Add validation for the updates map
			try {
				// Assuming validateContentUpdateMap validates a Record<string, string>
				// This is a placeholder for actual validation logic for a map of content.
				// You might need to iterate and validate each key-value pair if using validateContentInsert.
				// For simplicity, let's assume a batch validation or skip detailed field-by-field for this example.
				// If validating each, collect errors similarly to other actions.
				// validateContentUpdateMap(updates); // Example validation call
			} catch (validationError: any) {
				const errors: Record<string, string> = {};
				if (validationError.issues && Array.isArray(validationError.issues)) {
					for (const issue of validationError.issues) {
						const fieldName = issue.path?.[0]?.key as string | undefined;
						if (fieldName && !errors[fieldName]) {
							errors[fieldName] = issue.message;
						} else if (!fieldName && issue.message) {
							// General error not tied to a specific field in the map
							errors._general = (errors._general ? errors._general + "; " : "") + issue.message;
						}
					}
				}
				if (Object.keys(errors).length > 0) {
					return data({ success: false, errors, message: "Validation failed." }, { status: 400 });
				}
				// Fallback if error structure is different
				return data({ success: false, error: validationError.message || "Validation failed during content update.", message: "Validation failed." }, { status: 400 });
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
		// @ts-ignore // Accessing potential 'issues' property
		if (err.issues && Array.isArray(err.issues)) {
			// @ts-ignore
			for (const issue of err.issues) {
				const fieldName = issue.path?.[0]?.key as string | undefined;
				if (fieldName && !errors[fieldName]) {
					errors[fieldName] = issue.message;
				} else if (!fieldName && issue.message) {
					// General error not tied to a specific field
					errors._general = (errors._general ? errors._general + "; " : "") + issue.message;
				}
			}
		}
		if (Object.keys(errors).length > 0) {
			return data({ success: false, errors, message: "An error occurred with specific fields." }, { status: 400 });
		}
		
		const errorMessage = err.message || "Internal server error";
		return data({ success: false, error: errorMessage, message: "An internal server error occurred." }, { status: 500 });
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
