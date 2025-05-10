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
	useNavigation,
} from "react-router";
import { SidebarLayout } from "~/routes/admin/components/ui/sidebar-layout";
import { getSessionCookie, verify } from "~/routes/common/utils/auth";
import adminThemeStylesheet from "../../admin-theme.css?url";
import { AdminErrorBoundary } from "../components/AdminErrorBoundary";
// Import generated Route type for this route
import type { Route } from "./+types/_layout";

// Only include the admin theme stylesheet for admin routes
export const links: Route.LinksFunction = () => [
	{ rel: "stylesheet", href: adminThemeStylesheet },
];

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

export default function Component() {
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
			<Outlet context={useLoaderData<typeof loader>()} />
		</SidebarLayout>
	);
}

export function ErrorBoundary() {
	return <AdminErrorBoundary />;
}

// Default export for React Router 7 conventions
