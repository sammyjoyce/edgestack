import React, { type JSX } from "react";
import invariant from "tiny-invariant";
const DEBUG = process.env.NODE_ENV !== "production";
import { useLoaderData, useNavigation, useFetcher, redirect } from 'react-router';
import type { Route } from "./+types/index";
import { getAllContent, updateContent, updateProject } from "~/routes/common/db";
import { getSessionCookie, verify } from "~/routes/common/utils/auth";
import AdminDashboard from "../components/AdminDashboard";
import { Heading, Text } from "~/routes/common/components/ui/text";
import { Fieldset, Legend } from "~/routes/common/components/ui/fieldset";

const DEFAULT_CONTENT = {
	hero_title: "Building Dreams, Creating Spaces",
	hero_subtitle: "Your trusted partner in construction and renovation.",
	home_sections_order: "hero,services,projects,about,contact",
} as const;

// Remove duplicate DEBUG declaration

/* ---------------- LOADER ---------------- */
export async function loader(
	{ request, context }: Route.LoaderArgs
): Promise<{ content: Record<string, string> }> {
	invariant(request instanceof Request, "loader: request must be a Request");
	invariant(context && context.db, "loader: missing DB in context");
	const token = getSessionCookie(request);
	const secret = context.cloudflare?.env?.JWT_SECRET;

	invariant(secret, "loader: JWT_SECRET is required in context");
	if (!token || !(await verify(token, secret))) {
		throw redirect("/admin/login");
	}

	const items = await getAllContent(context.db);
	invariant(items && typeof items === "object", "loader: items must be an object");
	if (DEBUG) console.log('[ADMIN LOADER] Loaded content keys:', Object.keys(items));
	return { content: items };
}


/* ---------------- ACTION ---------------- */
export async function action(
	{ request, context }: Route.ActionArgs
): Promise<Response> {
	invariant(request instanceof Request, "action: request must be a Request");
	invariant(context && context.db, "action: missing DB in context");
	try {
		const token = getSessionCookie(request);
		const secret = context.cloudflare?.env?.JWT_SECRET;
		invariant(secret, "action: JWT_SECRET is required in context");
		if (!token || !(await verify(token, secret))) {
			throw new Response("Unauthorized", { status: 401 });
		}

		if (request.method !== 'POST') {
			return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
		}
		const formData = await request.formData();

		const intent = formData.get('intent');
		if (intent === 'updateTextContent') {
			const updates: Record<string, string> = {};
			for (const [key, value] of formData.entries()) {
				if (key !== 'intent' && typeof value === 'string') {
					updates[key] = value;
				}
			}
			invariant(Object.keys(updates).length > 0, "action: No updates provided");
			if (DEBUG) console.log('[ADMIN ACTION] updateTextContent updates:', updates);
			await updateContent(context.db, updates);
			invariant(true, "action: reached end of updateTextContent branch");
			const revalidateParam = `revalidate=true&t=${Date.now()}`;
			invariant(typeof revalidateParam === "string", "action: revalidateParam must be a string");
			return redirect(`/?${revalidateParam}`);
		} else {
			const updates: Record<string, string> = {};
			for (const [key, value] of formData.entries()) {
				if (typeof value === 'string') {
					updates[key] = value;
				}
			}
			invariant(Object.keys(updates).length > 0, "action: No updates provided");
			if (DEBUG) console.log('[ADMIN ACTION] other updates:', updates);
			// Here we would call a different function to handle project updates
			const revalidateParam = `revalidate=true&t=${Date.now()}`;
			invariant(typeof revalidateParam === "string", "action: revalidateParam must be a string");
			return redirect(`/admin/projects?${revalidateParam}`);
		}
	} catch (error: unknown) {
		const err = error instanceof Error ? error : new Error(String(error));
		if (DEBUG) console.error('[ADMIN ACTION] Error processing updates:', err);
		return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
	}
}

/* ---------------- COMPONENT -------------- */
function logFormSubmission(formData: FormData) {
  console.log('[CLIENT FORM SUBMISSION] Submitting form with data:', Object.fromEntries(formData));
}

export default function AdminIndexRoute(): JSX.Element {
	const { content } = useLoaderData<typeof loader>();

	// TigerStyle runtime assertions
	invariant(content && typeof content === "object", "AdminIndexRoute: loader must return content object");
	invariant("hero_title" in content, "AdminIndexRoute: content must have hero_title key");

	return (
		<main id="admin-dashboard-main" aria-label="Admin Dashboard">
			<Fieldset>
				<Legend>
					<Heading level={1}>Admin Dashboard</Heading>
				</Legend>
			</Fieldset>
			<AdminDashboard initialContent={content} />
		</main>
	);
}
