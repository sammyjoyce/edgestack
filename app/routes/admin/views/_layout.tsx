import {
	ArrowLeftCircleIcon,
	DocumentDuplicateIcon,
	FolderIcon,
	HomeIcon,
} from "@heroicons/react/24/outline";
import type React from "react";
import {
	NavLink,
	Outlet,
	type To,
	redirect,
	useLoaderData,
} from "react-router";
import { getSessionCookie, verify } from "~/routes/common/utils/auth";
import { AdminErrorBoundary } from "../components/AdminErrorBoundary";
// Import generated Route type for this route
import type { Route } from "./+types/_layout";

// Define loader with the generated LoaderArgs type
export const loader = async ({ request, context }: Route.LoaderArgs) => {
	const url = new URL(request.url);
	const isLoginRoute = url.pathname === "/admin/login";
	const isLogoutRoute = url.pathname === "/admin/logout";

	const sessionValue = getSessionCookie(request);
	const jwtSecret = context.cloudflare?.env?.JWT_SECRET;

	// Verify token function
	const isAuthenticated = async () => {
		if (!sessionValue || !jwtSecret) return false;
		try {
			return await verify(sessionValue, jwtSecret);
		} catch (e) {
			console.error("Token verification failed:", e);
			return false;
		}
	};

	const loggedIn = await isAuthenticated();

	// If not logged in and trying to access anything other than login, redirect to login
	if (!loggedIn && !isLoginRoute) {
		// Allow logout route to proceed to clear cookie even if not logged in
		if (!isLogoutRoute) {
			return redirect("/admin/login");
		}
	}

	// If logged in and trying to access login, redirect to admin dashboard
	if (loggedIn && isLoginRoute) {
		return redirect("/admin");
	}

	// Allow access if logged in, or if accessing login/logout page
	// Return an object directly instead of using data() helper
	return { isAuthenticated: loggedIn };
};

// Add no-op action to layout to handle form submissions and prevent missing action errors
export const action = async ({ request, context }: Route.ActionArgs) => {
	return null;
};

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

// Using clsx for consistency
import clsx from "clsx";

export function Component() {
	return (
		<div className="min-h-screen flex bg-gray-50">
			<aside className="flex w-72 flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 py-4 border-r border-gray-200 shadow-md">
				<div className="flex h-16 shrink-0 items-center border-b border-gray-800 mb-2 pb-2">
					<img
						src="/assets/logo_284x137-KoakP1Oi.png"
						alt="LUSH CONSTRUCTIONS"
						className="h-8 w-auto mx-auto"
					/>
				</div>
				<div className="mb-2 mt-2 px-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
					Admin Menu
				</div>
				<hr className="border-gray-700 mb-2" />
				<nav className="flex flex-1 flex-col">
					<ul className="flex flex-1 flex-col gap-y-7">
						<li>
							<ul className="-mx-2 flex flex-col gap-1">
								{navigation.map((item) => (
									<li key={item.name}>
										{item.name === "Live Site" ? (
											// Use standard anchor for external/non-router link
											<a
												href={item.href.toString()}
												target="_blank"
												rel="noopener noreferrer"
												className={clsx(
													"text-gray-400 hover:bg-gray-700 hover:text-white",
													"group flex gap-x-3 rounded-md p-2 text-sm font-medium",
												)}
											>
												<item.icon
													aria-hidden="true"
													className="size-5 shrink-0"
												/>
												{item.name}
											</a>
										) : (
											// Use NavLink for internal routes with typed 'to'
											<NavLink
												to={item.href as To} // Cast to To for NavLink
												end={item.href === "/admin"} // Keep end prop for dashboard
												className={({ isActive }) =>
													clsx(
														isActive
															? "bg-gray-700 text-white"
															: "text-gray-400 hover:bg-gray-700 hover:text-white",
														"group flex gap-x-3 rounded-md p-2 text-sm font-medium",
													)
												}
											>
												<item.icon
													aria-hidden="true"
													className="size-5 shrink-0"
												/>
												{item.name}
											</NavLink>
										)}
									</li>
								))}
							</ul>
						</li>
					</ul>
				</nav>
			</aside>
			<div className="w-px bg-gray-200" />
			<main className="flex-1 px-8 py-8">
				{/* Pass loader data to Outlet context and use error boundary */}
				<Outlet context={useLoaderData<typeof loader>()} />
			</main>
		</div>
	);
}

export function ErrorBoundary() {
	return <AdminErrorBoundary />;
}

// Default export for React Router 7 conventions
export default Component;
