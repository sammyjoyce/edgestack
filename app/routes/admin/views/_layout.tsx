import {
	ArrowLeftCircleIcon,
	DocumentDuplicateIcon,
	FolderIcon,
	HomeIcon,
} from "@heroicons/react/24/outline";
import type { Route } from "./+types/_layout";
import type React from "react";
import {
	Outlet,
	type To,
	redirect,
	useLoaderData,
	useLocation,
	useNavigation,
	Link as RouterLink,
} from "react-router";
import { getSessionCookie, verify } from "~/routes/common/utils/auth"; // Keep
import adminThemeStylesheet from "../../../admin-theme.css?url"; // Keep
import { AdminErrorBoundary } from "../components/AdminErrorBoundary"; // Keep
import { SidebarLayout } from "../components/ui/sidebar-layout"; // Keep only SidebarLayout
import clsx from "clsx";
import * as Headless from "@headlessui/react";
export const links: Route.LinksFunction = () => [
	{ rel: "stylesheet", href: adminThemeStylesheet },
];
export const loader = async ({
	request,
	context,
	params,
}: Route.LoaderArgs) => {
	const url = new URL(request.url);
	const isLoginRoute = url.pathname === "/admin/login";
	const isLogoutRoute = url.pathname === "/admin/logout";
	const sessionValue = getSessionCookie(request);
	const jwtSecret = context.cloudflare?.env?.JWT_SECRET;
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
	if (!loggedIn && !isLoginRoute) {
		if (!isLogoutRoute) {
			return redirect("/admin/login");
		}
	}
	if (loggedIn && isLoginRoute) {
		return redirect("/admin");
	}
	return { isAuthenticated: loggedIn };
};
export const action = async ({
	request, // eslint-disable-line @typescript-eslint/no-unused-vars
	context, // eslint-disable-line @typescript-eslint/no-unused-vars
	params,  // eslint-disable-line @typescript-eslint/no-unused-vars
}: Route.ActionArgs) => { // ActionData will be null
	return null;
};
interface NavItem {
	name: string;
	href: To | string;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}
const navigation: NavItem[] = [
	{ name: "Dashboard", href: "/admin", icon: HomeIcon },
	{ name: "Projects", href: "/admin/projects", icon: FolderIcon },
	{ name: "Live Site", href: "/", icon: DocumentDuplicateIcon },
	{ name: "Logout", href: "/admin/logout", icon: ArrowLeftCircleIcon },
];
export default function AdminLayout({ loaderData }: Route.ComponentProps) {
	const navigationHook = useNavigation();
	const location = useLocation();

	const sidebarNav = (
		<div className="flex h-full flex-col bg-gray-900 px-6 py-4">
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
			<ul className="flex flex-col">
				{navigation.map((item) => (
					<li
						key={item.name}
						className={clsx(
							"group rounded-md text-sm font-medium",
							(item.name === "Live Site" || item.name === "Logout")
								? "text-gray-400 hover:bg-gray-700 hover:text-white"
								: (location.pathname === item.href || (item.href !== "/admin" && location.pathname.startsWith(item.href as string)))
									? "bg-gray-800 text-white"
									: "text-gray-400 hover:bg-gray-700 hover:text-white"
						)}
					>
						{item.name === "Live Site" ? (
							<a
								href={item.href as string}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-x-3 p-2 w-full"
							>
								<item.icon aria-hidden="true" className="h-5 w-5 shrink-0" />
								{item.name}
							</a>
						) : (
							<RouterLink
								to={item.href as string}
								className="flex items-center gap-x-3 p-2 w-full"
							>
								<item.icon aria-hidden="true" className="h-5 w-5 shrink-0" />
								{item.name}
							</RouterLink>
						)}
					</li>
				))}
			</ul>
		</div>
	);

	// If loaderData indicates not authenticated and not on login/logout, render nothing or a redirect signal
	// This check might be redundant if the loader already handles redirection, but good for clarity.
	if (!loaderData?.isAuthenticated && !['/admin/login', '/admin/logout'].includes(location.pathname)) {
		// The loader should have redirected, but as a fallback, don't render the layout.
		// Or, you could render a minimal loading/redirecting state here.
		return null; 
	}

	// If on login/logout page and authenticated, loader should redirect.
	// If on login/logout page and not authenticated, render Outlet without SidebarLayout.
	if (['/admin/login', '/admin/logout'].includes(location.pathname) && !loaderData?.isAuthenticated) {
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

	// Default case: authenticated user on an admin page (not login/logout)
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
			<Outlet context={loaderData} /> {}
		</SidebarLayout>
	);
}
export function ErrorBoundary() {
	return <AdminErrorBoundary />;
}
