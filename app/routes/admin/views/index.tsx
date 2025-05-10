import React, { type JSX } from "react";
import invariant from "tiny-invariant";
const DEBUG = process.env.NODE_ENV !== "production";
import {
	redirect,
	useFetcher,
	useLoaderData,
	useNavigation,
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

/* ---------------- ACTION ---------------- */
export async function action({
	request,
	context,
}: Route.ActionArgs): Promise<Response> {
	console.log(
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
			});
		}
		const formData = await request.formData();

		const intent = formData.get("intent");
		if (intent === "updateTextContent") {
			const updates: Record<string, string> = {};
			for (const [key, value] of formData.entries()) {
				if (key !== "intent" && typeof value === "string") {
					updates[key] = value;
				}
			}
			invariant(Object.keys(updates).length > 0, "action: No updates provided");
			if (DEBUG)
				console.log("[ADMIN ACTION] updateTextContent updates:", updates);
			await updateContent(context.db, updates);
			invariant(true, "action: reached end of updateTextContent branch");
			const revalidateParam = `revalidate=true&t=${Date.now()}`;
			invariant(
				typeof revalidateParam === "string",
				"action: revalidateParam must be a string",
			);
			return redirect(`/?${revalidateParam}`);
		}
		const updates: Record<string, string> = {};
		for (const [key, value] of formData.entries()) {
			if (typeof value === "string") {
				updates[key] = value;
			}
		}
		invariant(Object.keys(updates).length > 0, "action: No updates provided");
		if (DEBUG) console.log("[ADMIN ACTION] other updates:", updates);
		// Here we would call a different function to handle project updates
		const revalidateParam = `revalidate=true&t=${Date.now()}`;
		invariant(
			typeof revalidateParam === "string",
			"action: revalidateParam must be a string",
		);
		return redirect(`/admin/projects?${revalidateParam}`);
	} catch (error: unknown) {
		const err = error instanceof Error ? error : new Error(String(error));
		if (DEBUG) console.error("[ADMIN ACTION] Error processing updates:", err);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
		});
	}
}

/* ---------------- COMPONENT -------------- */
function logFormSubmission(formData: FormData) {
	console.log(
		"[CLIENT FORM SUBMISSION] Submitting form with data:",
		Object.fromEntries(formData),
	);
	console.log(
		"[CLIENT FORM SUBMISSION] Form is targeting route:",
		window.location.pathname,
	);
	console.log("[CLIENT FORM SUBMISSION] Full URL:", window.location.href);
}

export default function AdminIndexRoute(): JSX.Element {
	const data = useLoaderData<typeof loader>();

	return (
		<main id="admin-dashboard-main" aria-label="Admin Dashboard">
			<AdminDashboard initialContent={data.content} />
		</main>
	);
}
