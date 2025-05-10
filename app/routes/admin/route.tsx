import {
	ArrowLeftCircleIcon,
	DocumentDuplicateIcon,
	FolderIcon,
	HomeIcon,
} from "@heroicons/react/24/outline";
import type React from "react";
import { NavLink, Outlet, type To, redirect, useLoaderData } from "react-router";
import { SidebarLayout } from "~/routes/admin/components/ui/sidebar-layout";
import { getSessionCookie, verify } from "~/routes/common/utils/auth";
import type { Route } from "./+types/route";

const DEBUG = process.env.NODE_ENV !== "production";

// Define explicit loader signature
export const loader = async ({ request, context }: Route.LoaderArgs) => {
	const url = new URL(request.url);
	const isLoginRoute = url.pathname === "/admin/login";
	const isLogoutRoute = url.pathname === "/admin/logout";

	const sessionValue = getSessionCookie(request);
	const jwtSecret = context.cloudflare?.env?.JWT_SECRET;

	const loggedIn = sessionValue && jwtSecret ? await verify(sessionValue, jwtSecret).catch(() => false) : false;

	if (!loggedIn && !isLoginRoute && !isLogoutRoute) {
		return redirect("/admin/login");
	}
	if (loggedIn && isLoginRoute) {
		return redirect("/admin");
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
	// This layout action should ideally not handle specific form submissions.
	// Those should be handled by the specific child routes.
	console.warn(
		`Action received in admin layout for intent: ${formData.get("intent")}. ` +
		"This might indicate a misconfigured form action.",
	);
	return data(
		{ error: "Action not handled at this layout level. Target a specific resource route." },
		{ status: 405 } // Method Not Allowed is appropriate
	);
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
	const navigation = useNavigation();
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
			{navigation.state === "loading" && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						right: 0,
						height: "3px",
						background: "var(--color-primary)",
						zIndex: 9999,
						transition: "width 0.2s ease-out",
					}}
					className="global-loading-indicator"
				/>
			)}
			<Outlet context={useLoaderData<typeof loader>()} />
		</SidebarLayout>
	);
}
