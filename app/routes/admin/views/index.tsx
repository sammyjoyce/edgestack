import React, { type JSX } from "react"; // Added React import for JSX
import { useLoaderData, useNavigation, useFetcher, redirect } from 'react-router';
import type { Route } from "./+types/index";
import { getAllContent, updateContent, updateProject } from "~/routes/common/db";
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
	try {
		const token = getSessionCookie(request);
		const secret = context.cloudflare?.env?.JWT_SECRET;
		if (!token || !secret || !(await verify(token, secret))) {
			throw new Response("Unauthorized", { status: 401 });
		}

		if (request.method !== 'POST') {
			return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
		}
		const formData = await request.formData();
		console.log('[ADMIN ACTION] Form submission received', formData);
		
		const intent = formData.get('intent');
		if (intent === 'updateTextContent') {
			console.log('[ADMIN ACTION] Processing text content update');
			const updates: Record<string, string> = {};
			for (const [key, value] of formData.entries()) {
				if (key !== 'intent' && typeof value === 'string') {
					console.log(`[ADMIN ACTION] Processing form field: ${key}=${value}`);
					updates[key] = value;
				}
			}
			
			if (Object.keys(updates).length > 0) {
				console.log('[ADMIN ACTION] Saving content updates to database:', Object.keys(updates));
				await updateContent(context.db, updates);
				console.log('[ADMIN ACTION] Content updates saved successfully');
				// Use a timestamp as a cache-busting query param for revalidation
				const revalidateParam = `revalidate=true&t=${Date.now()}`;
				return redirect(`/?${revalidateParam}`);
			} else {
				console.log('[ADMIN ACTION] No valid updates found in form data');
				return new Response(JSON.stringify({ error: 'No updates provided' }), { status: 400 });
			}
		} else {
			// Handle project updates or other form submissions
			console.log('[ADMIN ACTION] Processing non-content update, possibly project edit');
			const updates: Record<string, string> = {};
			for (const [key, value] of formData.entries()) {
				console.log(`[ADMIN ACTION] Processing form field: ${key}=${value}`);
				if (typeof value === 'string') {
					updates[key] = value;
				}
			}
			
			if (Object.keys(updates).length > 0) {
				console.log('[ADMIN ACTION] Saving updates to database:', Object.keys(updates));
				// Here we would call a different function to handle project updates
				// For now, we'll log and redirect
				// await updateProject(context.db, updates); // This function needs to be implemented
				console.log('[ADMIN ACTION] Project updates would be saved here');
				const revalidateParam = `revalidate=true&t=${Date.now()}`;
				return redirect(`/admin/projects?${revalidateParam}`);
			} else {
				console.log('[ADMIN ACTION] No valid updates found in form data');
				return new Response(JSON.stringify({ error: 'No updates provided' }), { status: 400 });
			}
		}
	} catch (error: unknown) {
		console.error('[ADMIN ACTION] Error processing updates:', error);
		if (error instanceof Error) {
			console.error('[ADMIN ACTION] Error message:', error.message);
			console.error('[ADMIN ACTION] Error stack:', error.stack);
		}
		return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
	}
}

/* ---------------- COMPONENT -------------- */
function logFormSubmission(formData: FormData) {
  console.log('[CLIENT FORM SUBMISSION] Submitting form with data:', Object.fromEntries(formData));
}

export default function AdminIndexRoute(): JSX.Element {
	const { content } = useLoaderData<typeof loader>();
	const navigation = useNavigation();
	const isLoading = navigation.state === 'loading' || navigation.state === 'submitting';
	const fetcher = useFetcher();

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    logFormSubmission(formData);
    fetcher.submit(formData, { method: 'post', action: '/admin' });
  };

	return (
		<main id="admin-dashboard-main" aria-label="Admin Dashboard">
			<AdminDashboard initialContent={content} />
		</main>
	);
}
