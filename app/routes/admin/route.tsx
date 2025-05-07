import {
	ArrowLeftCircleIcon,
	DocumentDuplicateIcon,
	FolderIcon,
	HomeIcon,
} from "@heroicons/react/24/outline";
import type React from "react";
import {
	type LoaderFunction,
	NavLink,
	Outlet,
	type To,
	redirect,
	useFetcher,
} from "react-router";
import { getSessionCookie, verify } from "~/routes/common/utils/auth";

// Define explicit loader signature
export const loader: LoaderFunction = async ({ request, context }) => {
	const sessionValue = getSessionCookie(request);
	const jwtSecret = context.cloudflare?.env?.JWT_SECRET;
	if (!sessionValue || !jwtSecret || !(await verify(sessionValue, jwtSecret))) {
		return redirect("/admin/login");
	}
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

function classNames(
	...classes: Array<string | boolean | null | undefined>
): string {
	return classes.filter(Boolean).join(" ");
}

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
				{/* Standardize admin label */}
				<div className="mb-2 mt-2 px-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
					Admin Menu
				</div>
				<hr className="border-gray-700 mb-2" />
				<nav className="flex flex-1 flex-col">
					<ul className="flex flex-1 flex-col gap-y-7">
						<li>
							<ul className="-mx-2 space-y-1">
								{navigation.map((item) => (
									<li key={item.name}>
										{item.name === "Live Site" ? (
											// Use standard anchor for external/non-router link
											<a
												href={item.href as string} // Cast to string
												target="_blank"
												rel="noopener noreferrer"
												className={classNames(
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
												to={item.href as To} // Cast to To
												end={item.href === "/admin"}
												className={({ isActive }) =>
													classNames(
														isActive
															? "bg-gray-700 text-white" // Slightly lighter active bg
															: "text-gray-400 hover:bg-gray-700 hover:text-white",
														"group flex gap-x-3 rounded-md p-2 text-sm font-medium", // Use text-sm and font-medium
													)
												}
											>
												<item.icon
													aria-hidden="true"
													className="size-5 shrink-0" // Slightly smaller icon
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
				<Outlet />
			</main>
		</div>
	);
}
