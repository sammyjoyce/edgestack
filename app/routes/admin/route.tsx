import {
	ArrowLeftCircleIcon,
	DocumentDuplicateIcon,
	FolderIcon,
	HomeIcon,
} from "@heroicons/react/24/outline";
import type React from "react";
import { NavLink, Outlet, type To, redirect } from "react-router";
import invariant from "tiny-invariant";
import { SidebarLayout } from "~/routes/admin/components/ui/sidebar-layout";
import { updateContent } from "~/routes/common/db";
import { getSessionCookie, verify } from "~/routes/common/utils/auth";
import type { Route } from "./+types/route";

const DEBUG = process.env.NODE_ENV !== "production";

// Define explicit loader signature
export const loader = async ({ request, context }: Route.LoaderArgs) => {
	const sessionValue = getSessionCookie(request);
	const jwtSecret = context.cloudflare?.env?.JWT_SECRET;
	if (!sessionValue || !jwtSecret || !(await verify(sessionValue, jwtSecret))) {
		return redirect("/admin/login");
	}
	return null;
};

/* ---------------- ACTION ---------------- */
// Minimal action function to handle misdirected form submissions
export async function action({
	request,
	context,
}: Route.ActionArgs): Promise<Response> {
	console.log("Action triggered in admin/route.tsx - checking intent");
	console.log("Request URL:", request.url);
	console.log("Request method:", request.method);
	const formData = await request.formData();
	console.log("Form data received:", Object.fromEntries(formData));
	const intent = formData.get("intent");
	if (intent === "logout") {
		const env = context.cloudflare.env as Env;
		return handleLogout(env);
	}
	if (intent === "updateTextContent") {
		// Handle content update logic directly in parent route
		console.log("Handling content update in parent route");
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
			const revalidateParam = `revalidate=true&t=${Date.now()}`;
			invariant(
				typeof revalidateParam === "string",
				"action: revalidateParam must be a string",
			);
			return redirect(`/?${revalidateParam}`);
		} catch (error: unknown) {
			const err = error instanceof Error ? error : new Error(String(error));
			if (DEBUG) console.error("[ADMIN ACTION] Error processing updates:", err);
			return new Response(JSON.stringify({ error: "Internal server error" }), {
				status: 500,
			});
		}
	} else {
		// Simply return a response for other intents
		console.log("Passing through non-logout and non-update request");
		return new Response("Request passed to child route", { status: 200 });
	}
}

// Function to handle logout has been moved to logout.tsx
async function handleLogout(env: Env): Promise<Response> {
	const SESSION_COOKIE_NAME = "session";
	const sessionCookie = env.JWT_SECRET;
	return new Response(null, {
		status: 302,
		headers: {
			Location: "/",
			"Set-Cookie": `${SESSION_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict`,
		},
	});
}

interface NavItem {
	name: string;
	href: To | string; // Use To for internal, string for external
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

// Use typed paths for internal links
const navigation: NavItem[] = [
	{ name: "Dashboard", href: "/admin", icon: HomeIcon },
	{ name: "Projects", href: "/admin/projects", icon: FolderIcon },
	{ name: "Live Site", href: "/", icon: DocumentDuplicateIcon }, // Keep as string for external/root
	{ name: "Logout", href: "/admin/logout", icon: ArrowLeftCircleIcon },
];

// Using clsx which is available in the project (via cn utility in Button)
// or install directly if not. For now, assuming it can be imported.
// If not, the original classNames function is fine.
// For this change, I'll assume clsx is preferred for consistency.
import clsx from "clsx";

export default function Component() {
	// build the sidebar once
	const sidebarNav = (
		<nav className="flex h-full flex-col bg-gray-900 px-6 py-4">
			<div className="flex h-16 items-center border-b border-gray-800 mb-2 pb-2">
				<img
					src="/assets/logo_284x137-KoakP1Oi.png"
					alt="LUSH CONSTRUCTIONS"
					className="h-8 mx-auto"
				/>
			</div>
			<div className="mb-2 mt-2 px-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
				Admin Menu
			</div>
			<hr className="border-gray-700 mb-2" />
			<ul className="flex flex-1 flex-col gap-y-4">
				{navigation.map((item) => (
					<li key={item.name}>
						{item.name === "Live Site" ? (
							<a
								href={item.href as string}
								target="_blank"
								rel="noopener noreferrer"
								className="group flex items-center gap-x-3 rounded-md p-2 text-sm font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
							>
								<item.icon aria-hidden="true" className="size-5 shrink-0" />
								{item.name}
							</a>
						) : (
							<NavLink
								to={item.href as To}
								end={item.href === "/admin"}
								className={({ isActive }) =>
									`group flex items-center gap-x-3 rounded-md p-2 text-sm font-medium ${
										isActive
											? "bg-gray-700 text-white"
											: "text-gray-400 hover:bg-gray-700 hover:text-white"
									}`
								}
							>
								<item.icon aria-hidden="true" className="size-5 shrink-0" />
								{item.name}
							</NavLink>
						)}
					</li>
				))}
			</ul>
		</nav>
	);

	return (
		<SidebarLayout
			navbar={
				<img
					src="/assets/logo_284x137-KoakP1Oi.png"
					alt="Logo"
					className="h-8"
				/>
			}
			sidebar={sidebarNav}
		>
			<Outlet />
		</SidebarLayout>
	);
}
