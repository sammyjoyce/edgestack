import type { Route } from "./+types/index";
import React, { type JSX, useEffect } from "react";
import { assert } from "~/routes/common/utils/assert";
import { data, redirect } from "react-router";
import { useSearchParams } from "react-router-dom";
import { getAllContent, updateContent } from "~/routes/common/db";
import { getSessionCookie, verify } from "~/routes/common/utils/auth";
import AdminDashboard from "../components/AdminDashboard";
import { ButtonLED } from "../components/ui/button";
import { ValiError } from "valibot";
import { validateContentInsert } from "../../../../database/valibot-validation.js";
import { toast, Toaster } from "sonner";

const DEBUG = process.env.NODE_ENV !== "production";

export const links: Route.LinksFunction = () => [
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap",
	},
];

export async function loader({ request, context, params }: Route.LoaderArgs) {
	assert(request instanceof Request, "loader: request must be a Request");
	assert(context?.db, "loader: missing DB in context");
	const token = getSessionCookie(request);
	const secret = context.cloudflare?.env?.JWT_SECRET;
	assert(secret, "loader: JWT_SECRET is required in context");
	if (!token || !(await verify(token, secret))) {
		throw redirect("/admin/login");
	}
	const items = await getAllContent(context.db);
	assert(items && typeof items === "object", "loader: items must be an object");
	if (DEBUG)
		console.log("[ADMIN LOADER] Loaded content keys:", Object.keys(items));
	return { content: items };
}

export async function action({ request, context, params }: Route.ActionArgs) {
	console.info(
		`[ADMIN ACTION START] Method: ${request.method}, URL: ${request.url}`,
	);

	if (DEBUG)
		console.log(
			"Action triggered in admin/views/index.tsx - THIS IS THE CORRECT ROUTE",
		);
	assert(request instanceof Request, "action: request must be a Request");
	assert(context?.db, "action: missing DB in context");
	try {
		console.info("[ADMIN ACTION] Verifying token...");
		const token = getSessionCookie(request);
		const secret = context.cloudflare?.env?.JWT_SECRET;
		assert(secret, "action: JWT_SECRET is required in context");
		if (!token || !(await verify(token, secret))) {
			console.warn("[ADMIN ACTION] Unauthorized access attempt.");
			return data({ success: false, error: "Unauthorized" }, { status: 401 });
		}
		console.info("[ADMIN ACTION] Token verified.");

		if (request.method !== "POST") {
			console.warn(`[ADMIN ACTION] Invalid method: ${request.method}`);
			return data(
				{ success: false, error: "Method not allowed" },
				{ status: 405 },
			);
		}
		const formData = await request.formData();
		const intent = formData.get("intent")?.toString();
		console.info(`[ADMIN ACTION] Intent: ${intent}`);

		if (intent === "updateTextContent") {
			const updates: Record<string, string> = {};
			for (const [key, value] of formData.entries()) {
				if (key !== "intent" && typeof value === "string") {
					updates[key] = value;
				}
			}
			console.info("[ADMIN ACTION] Updates for updateTextContent:", updates);
			assert(
				Object.keys(updates).length > 0,
				"action: No updates provided for updateTextContent",
			);
			const validationErrors: Record<string, string> = {};
			console.info("[ADMIN ACTION] Validating updateTextContent data...");
			for (const [key, valueToValidate] of Object.entries(updates)) {
				try {
					validateContentInsert({
						key,
						value: valueToValidate,
						page: "home",
						section: "unknown",
						type: "text",
					});
				} catch (err) {
					console.warn(
						`[ADMIN ACTION] Validation error for key '${key}':`,
						err,
					);
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
				console.warn("[ADMIN ACTION] Validation failed:", validationErrors);
				return {
					success: false,
					errors: validationErrors,
					message: "Validation failed for one or more fields.",
				};
			}
			console.info(
				"[ADMIN ACTION] Validation successful. Preparing to update content in DB for updateTextContent.",
			);
			if (DEBUG)
				console.log(`[ADMIN DASHBOARD ACTION] ${intent} updates:`, updates);
			await updateContent(context.db, updates);
			console.info("[ADMIN ACTION] updateTextContent: DB update successful.");
			return redirect("?contentUpdated=true");
		} else if (intent === "reorderSections") {
			const updates: Record<string, string> = {};
			for (const [key, value] of formData.entries()) {
				if (key === "home_sections_order" && typeof value === "string") {
					updates[key] = value;
				}
			}
			console.info("[ADMIN ACTION] Updates for reorderSections:", updates);
			assert(
				Object.keys(updates).length > 0,
				"action: No updates provided for reorderSections",
			);
			console.info(
				"[ADMIN ACTION] Preparing to update content in DB for reorderSections.",
			);
			if (DEBUG)
				console.log(
					"[ADMIN DASHBOARD ACTION] reorderSections updates:",
					updates,
				);
			await updateContent(context.db, updates);
			console.info("[ADMIN ACTION] reorderSections: DB update successful.");
			return redirect("?contentUpdated=true");
		}
		console.warn(`[ADMIN ACTION] Unknown intent: ${intent}`);
		if (DEBUG)
			console.warn(`[ADMIN DASHBOARD ACTION] Unknown intent: ${intent}`);
		return { success: false, error: `Unknown intent: ${intent}` };
	} catch (error: unknown) {
		const err = error instanceof Error ? error : new Error(String(error));
		console.error("[ADMIN ACTION] Error processing action:", err);
		if (DEBUG)
			console.error("[ADMIN DASHBOARD ACTION] Error processing updates:", err);
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
			return {
				success: false,
				errors,
				message: "An error occurred with specific fields.",
			};
		}
		const errorMessage = err.message || "Internal server error";
		return {
			success: false,
			error: errorMessage,
			message: "An internal server error occurred.",
		};
	}
}

export default function AdminIndexPage({
	loaderData,
}: Route.ComponentProps): JSX.Element {
	const [searchParams, setSearchParams] = useSearchParams();
	const contentUpdated = searchParams.get("contentUpdated") === "true";

	useEffect(() => {
		if (contentUpdated) {
			toast.success(
				<span
					className="flex items-center gap-2 font-mono text-admin-success text-base"
					style={{ fontFamily: "var(--font-admin-main)" }}
				>
					<ButtonLED isActive={true} />
					Content updated successfully!
				</span>,
				{ icon: null },
			);
			searchParams.delete("contentUpdated");
			setSearchParams(searchParams, { replace: true });
		}
	}, [contentUpdated, searchParams, setSearchParams]);

	return (
		<>
			<Toaster position="bottom-right" />
			<main id="admin-dashboard-main" aria-label="Admin Dashboard">
				<AdminDashboard initialContent={loaderData.content} />
			</main>
		</>
	);
}
