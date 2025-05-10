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
} from "react-router";
import { getSessionCookie, verify } from "~/routes/common/utils/auth";
import adminThemeStylesheet from "../../../admin-theme.css?url";
import { AdminErrorBoundary } from "../components/AdminErrorBoundary";
import {
	SidebarLayout,
	Sidebar,
	SidebarSection,
	SidebarItem,
} from "../components/ui/sidebar-layout";
export const links: Route.LinksFunction = () => [
	{ rel: "stylesheet", href: adminThemeStylesheet },
];
export const loader = async ({
	request,
	context,
	params,
}: Route.LoaderArgs): Promise<Route.LoaderData | Response> => {
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
	request,
	context,
	params,
}: Route.ActionArgs): Promise<null | Route.ActionData> => {
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
		<Sidebar className="flex h-full flex-col bg-gray-900 px-6 py-4">
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
			<SidebarSection>
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
							<SidebarItem
								as={"a"}
								href={item.href as string}
								current={
									location.pathname === item.href ||
									(item.href !== "/admin" &&
										location.pathname.startsWith(item.href as string))
								}
								className="group flex items-center gap-x-3 rounded-md p-2 text-sm font-medium"
							>
								<item.icon aria-hidden="true" className="size-5 shrink-0" />
								{item.name}
							</SidebarItem>
						)}
					</li>
				))}
			</SidebarSection>
		</Sidebar>
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
