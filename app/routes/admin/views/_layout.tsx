import {
	ArrowLeftCircleIcon,
	DocumentDuplicateIcon,
	FolderIcon,
	HomeIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import type React from "react";
import {
	NavLink,
	Outlet,
	redirect,
	useLocation,
	useNavigation,
} from "react-router";
import { checkSession } from "~/routes/common/utils/auth";
import adminThemeStylesheet from "../../../admin-theme.css?url";
import { AdminErrorBoundary } from "../components/AdminErrorBoundary";
import { SidebarLayout } from "../components/ui/sidebar-layout";
import type { Route } from "./+types/_layout";

// Links for stylesheet
export const links: Route.LinksFunction = () => [
	{ rel: "stylesheet", href: adminThemeStylesheet },
];

// Loader for authentication and redirection
export const loader = async ({ request, context }: Route.LoaderArgs) => {
	const url = new URL(request.url);
	const isLoginRoute = url.pathname === "/admin/login";
	const isLogoutRoute = url.pathname === "/admin/logout";
	const env = context.cloudflare?.env;
	const loggedIn = env ? await checkSession(request, env) : false;
	if (!loggedIn && !isLoginRoute && !isLogoutRoute) {
		return redirect("/admin/login");
	}
	if (loggedIn && isLoginRoute) {
		return redirect("/admin");
	}
	return { isAuthenticated: loggedIn };
};

// Action placeholder
export const action = async () => null;

// Navigation item interface
interface NavItem {
	name: string;
	href: string;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

// Navigation configuration
const adminNav: NavItem[] = [
	{ name: "Dashboard", href: "/admin", icon: HomeIcon },
	{ name: "Projects", href: "/admin/projects", icon: FolderIcon },
	{ name: "Logout", href: "/admin/logout", icon: ArrowLeftCircleIcon },
];
const siteNav: NavItem[] = [
	{ name: "Live Site", href: "/", icon: DocumentDuplicateIcon },
];

// Admin layout component
export default function AdminLayout({ loaderData }: Route.ComponentProps) {
	const navigationHook = useNavigation();
	const location = useLocation();

	const sidebarNav = (
		<div className="flex h-full flex-col bg-admin-screen px-6 py-4">
			<div className="flex h-16 items-center border-b border-admin-border mb-2 pb-2">
				<img
					src="/assets/logo_284x137-KoakP1Oi.png"
					alt="Company Logo"
					className="h-8 mx-auto filter invert"
				/>
			</div>
			<div className="mb-2 mt-2 px-1 text-xs font-semibold uppercase tracking-wide text-admin-text-muted">
				Admin Menu
			</div>
			<hr className="border-admin-border mb-2" />
			<ul className="flex flex-col">
				{adminNav.map((item) => {
					const isDashboard = item.name === "Dashboard";
					const isLogout = item.name === "Logout";
					return (
						<li
							key={item.name}
							className="group rounded-md text-sm font-medium"
						>
							<NavLink
								to={item.href}
								end={isDashboard || isLogout}
								className={({ isActive }) =>
									clsx(
										"flex items-center gap-x-3 p-2 w-full",
										"text-admin-text-muted hover:bg-admin-border-light hover:text-admin-text",
										isActive &&
											!isLogout &&
											"bg-admin-secondary text-admin-white",
									)
								}
							>
								<item.icon aria-hidden="true" className="h-5 w-5 shrink-0" />
								{item.name}
							</NavLink>
						</li>
					);
				})}
			</ul>
			<hr className="border-admin-border mb-2" />
			<ul className="flex flex-col">
				{siteNav.map((item) => (
					<li
						key={item.name}
						className="group rounded-md text-sm font-medium text-admin-text-muted hover:bg-admin-border-light hover:text-admin-text"
					>
						<a
							href={item.href}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-x-3 p-2 w-full"
						>
							<item.icon aria-hidden="true" className="h-5 w-5 shrink-0" />
							{item.name}
						</a>
					</li>
				))}
			</ul>
		</div>
	);

	// Fallback for unauthenticated users not on login/logout routes
	if (
		!loaderData?.isAuthenticated &&
		!["/admin/login", "/admin/logout"].includes(location.pathname)
	) {
		return null; // Loader should redirect, but this is a fallback
	}

	// Render Outlet only for login/logout when not authenticated
	if (
		["/admin/login", "/admin/logout"].includes(location.pathname) &&
		!loaderData?.isAuthenticated
	) {
		return (
			<>
				{navigationHook.state === "loading" && (
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
				<Outlet context={loaderData} />
			</>
		);
	}

	// Full layout for authenticated admin pages
	return (
		<SidebarLayout
			navbar={
				<img
					src="/assets/logo_284x137-KoakP1Oi.png"
					alt="Company Logo"
					className="h-8"
				/>
			}
			sidebar={sidebarNav}
		>
			{navigationHook.state === "loading" && (
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
			<Outlet context={loaderData} />
		</SidebarLayout>
	);
}

// Error boundary component
export function ErrorBoundary() {
	return <AdminErrorBoundary />;
}
