import React, { type JSX } from "react"; // Added React import for JSX
import { data, redirect, useLoaderData } from "react-router";
import { validateContentInsert } from "~/database/valibot-validation";
import type { Route } from "./+types/index";
import { getAllContent, updateContent } from "~/routes/common/db";
import { getSessionCookie, verify } from "~/routes/common/utils/auth";
import AdminDashboard from "../components/AdminDashboard";

const DEFAULT_CONTENT = {
	hero_title: "Building Dreams, Creating Spaces",
	hero_subtitle: "Your trusted partner in construction and renovation.",
	home_sections_order: "hero,services,projects,about,contact",
} as const;

const DEBUG = process.env.NODE_ENV === "development"; // Or use context.cloudflare.env.DEBUG

/* ---------------- LOADER ---------------- */
export async function loader({ request, context }: Route.LoaderArgs) {
	const token = getSessionCookie(request);
	const secret = context.cloudflare?.env?.JWT_SECRET;

	if (!secret) {
		console.error(
			"[ADMIN LOADER] JWT_SECRET is missing. Ensure it's set in .dev.vars.",
		);
		throw new Error("Server configuration error: JWT_SECRET is not available.");
	}

	if (!token || !(await verify(token, secret))) {
		throw redirect("/admin/login");
	}

	const items = await getAllContent(context.db);
	// Return plain object
	return { content: items };
}


/* ---------------- ACTION ---------------- */
export async function action({ request, context }: Route.ActionArgs) {
	const token = getSessionCookie(request);
	const secret = context.cloudflare?.env?.JWT_SECRET;
	if (!token || !secret || !(await verify(token, secret))) {
		return data({ success: false, error: "Unauthorized" }, { status: 401 });
	}

	if (request.method !== "POST") {
		return data({ error: "Invalid method" }, { status: 405 });
	}

	const formData = await request.formData();
	if (DEBUG) {
		console.debug(
			"[Admin Action] Form data received:",
			Object.fromEntries(formData),
		);
	}
	const intent = formData.get("intent") as string | undefined;

	try {
		if (intent === "updateTextContent") {
			const updates: Record<string, string> = {};
			for (const [k, v] of formData.entries()) {
				if (k !== "intent" && typeof v === "string") {
					validateContentInsert({ key: k, value: v });
					updates[k] = v;
				}
			}
			if (Object.keys(updates).length > 0) {
				await updateContent(context.db, updates);
				return data({ success: true, message: "Text content updated." });
			}
			return data({
				success: true,
				message: "No text content changes detected.",
			});
		}
		if (intent === "reorderSections") {
			const orderValue = formData.get("home_sections_order");
			if (typeof orderValue !== "string") {
				return data(
					{ success: false, error: "Invalid section order data." },
					{ status: 400 },
				);
			}
			validateContentInsert({ key: "home_sections_order", value: orderValue });
			await updateContent(context.db, { home_sections_order: orderValue });
			return data({ success: true, message: "Section order saved." });
		}

		// Fallback for unknown or missing intent if form was submitted
		return data(
			{ success: false, error: "Unknown or missing intent" },
			{ status: 400 },
		);
	} catch (error: any) {
		console.error("[Admin Action Error]:", error);
		// Check for Valibot validation error structure
		if (error.issues && Array.isArray(error.issues)) {
			const issueMessages = error.issues
				.map(
					(issue: any) =>
						`${issue.path?.join(".") || "field"}: ${issue.message}`,
				)
				.join(", ");
			return data(
				{ success: false, error: `Validation Error: ${issueMessages}` },
				{ status: 400 },
			);
		}
		return data(
			{ success: false, error: "An unexpected error occurred." },
			{ status: 500 },
		);
	}
}

/* ---------------- COMPONENT -------------- */
export default function AdminIndexRoute(): JSX.Element {
	const { content } = useLoaderData<typeof loader>();
	return (
		<main id="admin-dashboard-main" aria-label="Admin Dashboard">
			<AdminDashboard initialContent={content} />
		</main>
	);
}
