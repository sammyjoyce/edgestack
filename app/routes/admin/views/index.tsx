import React, { type JSX } from "react";
import { assert } from "~/routes/common/utils/assert";
const DEBUG = process.env.NODE_ENV !== "production";
import {
	redirect,
	useFetcher,
	useLoaderData,
	useNavigation,
	data,
} from "react-router";
import {
	getAllContent,
	updateContent,
} from "~/routes/common/db";
import { getSessionCookie, verify } from "~/routes/common/utils/auth";
import AdminDashboard from "../components/AdminDashboard";
import { Fieldset, Legend } from "../components/ui/fieldset";
import { Heading } from "../components/ui/heading";
import { Text } from "../components/ui/text";

const DEFAULT_CONTENT = {
	hero_title: "Building Dreams, Creating Spaces",
	hero_subtitle: "Your trusted partner in construction and renovation.",
	home_sections_order: "hero,services,projects,about,contact",
} as const;
export async function loader({
	request,
	context,
}: Route.LoaderArgs): Promise<Route.LoaderData> {
	assert(request instanceof Request, "loader: request must be a Request");
	assert(context?.db, "loader: missing DB in context");
	const token = getSessionCookie(request);
	const secret = context.cloudflare?.env?.JWT_SECRET;
	assert(secret, "loader: JWT_SECRET is required in context");
	if (!token || !(await verify(token, secret))) {
		throw redirect("/admin/login");
	}
	const items = await getAllContent(context.db);
	assert(
		items && typeof items === "object",
		"loader: items must be an object",
	);
	if (DEBUG)
		console.log("[ADMIN LOADER] Loaded content keys:", Object.keys(items));
	return { content: items };
}
import { validateContentInsert, validateContentUpdate } from "../../../../database/valibot-validation.js"; 
import { ValiError } from "valibot";
import type { Route } from "./+types";
export async function action({
	request,
	context,
}: Route.ActionArgs): Promise<Response | Route.ActionData> {
	if (DEBUG) console.log(
		"Action triggered in admin/views/index.tsx - THIS IS THE CORRECT ROUTE",
	);
	assert(request instanceof Request, "action: request must be a Request");
	assert(context?.db, "action: missing DB in context");
	try {
		const token = getSessionCookie(request);
		const secret = context.cloudflare?.env?.JWT_SECRET;
		assert(secret, "action: JWT_SECRET is required in context");
		if (!token || !(await verify(token, secret))) {
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
			assert(Object.keys(updates).length > 0, "action: No updates provided for updateTextContent");
			const validationErrors: Record<string, string> = {};
			for (const [key, valueToValidate] of Object.entries(updates)) {
				try {
					validateContentInsert({ key, value: valueToValidate, page: "home", section: "unknown", type: "text" }); 
				} catch (err) {
					if (err instanceof ValiError) {
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
			return data({ success: true, message: "Content updated successfully." });
		} else if (intent === "reorderSections") {
			const updates: Record<string, string> = {};
			for (const [key, value] of formData.entries()) {
				if (key === "home_sections_order" && typeof value === "string") {
					updates[key] = value;
				}
			}
			assert(Object.keys(updates).length > 0, "action: No updates provided for reorderSections");
			if (DEBUG) console.log("[ADMIN DASHBOARD ACTION] reorderSections updates:", updates);
			await updateContent(context.db, updates);
			return data({ success: true, message: "Sections reordered successfully." });
		}
		if (DEBUG) console.warn(`[ADMIN DASHBOARD ACTION] Unknown intent: ${intent}`);
		return data({ success: false, error: `Unknown intent: ${intent}` }, { status: 400 });
	} catch (error: unknown) {
		const err = error instanceof Error ? error : new Error(String(error));
		if (DEBUG) console.error("[ADMIN DASHBOARD ACTION] Error processing updates:", err);
		const errors: Record<string, string> = {};
		if (error instanceof ValiError) {
			for (const issue of error.issues) {
				const fieldName = issue.path?.[0]?.key as string | undefined;
				if (fieldName && !errors[fieldName]) {
					errors[fieldName] = issue.message;
				} else if (!fieldName && issue.message && !errors._general) { 
					errors._general = issue.message;
				} else if (!fieldName && issue.message) {
					 errors._general += `; ${issue.message}`;
				}
			}
		} else if (err.message && !errors._general) { 
			errors._general = err.message;
		}
		if (Object.keys(errors).length > 0) {
			return data({ success: false, errors, message: "An error occurred with specific fields." }, { status: 400 });
		}
		const errorMessage = err.message || "Internal server error";
		return data({ success: false, error: errorMessage, message: "An internal server error occurred." }, { status: 500 });
	}
}
export default function AdminIndexPage(): JSX.Element {
	const data = useLoaderData<typeof loader>(); 
	return (
		<main id="admin-dashboard-main" aria-label="Admin Dashboard">
			<AdminDashboard initialContent={data.content} />
		</main>
	);
}
