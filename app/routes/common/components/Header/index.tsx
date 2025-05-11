import { Bars3Icon } from "@heroicons/react/24/outline";
import React, { type JSX, type MouseEvent, useCallback, useState } from "react";
import { NavLink, type To, useNavigate } from "react-router";
import { Button } from "../ui/Button";
import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";
export type Path = To | `#${string}` | `http${string}`;
interface MenuItemBase {
	name: string;
	path: Path;
}
export interface MenuItemRoute extends MenuItemBase {
	isRouteLink: true;
}
export interface MenuItemAnchor extends MenuItemBase {
	isRouteLink?: false;
}
export type MenuItem = MenuItemRoute | MenuItemAnchor;
const MENU_ITEMS: readonly MenuItem[] = [
	{ name: "Home", path: "/", isRouteLink: true },
	{ name: "Our Services", path: "/#services", isRouteLink: true },
	{ name: "Projects", path: "/projects", isRouteLink: true },
	{ name: "About Us", path: "/#about", isRouteLink: true },
	{ name: "Contact Us", path: "/#contact", isRouteLink: true },
] as const;

export default function Header(): JSX.Element {
	const [mobileOpen, setMobileOpen] = useState(false);
	const navigate = useNavigate();
	const scrollToSection = useCallback(
		(e: MouseEvent<HTMLAnchorElement>, id: string) => {
			e.preventDefault();
			const cleanId = id.replace(/^#/, "");
			const currentPath = window.location.pathname;
			if (currentPath === "/") {
				const element = document.getElementById(cleanId);
				if (element) {
					element.scrollIntoView({ behavior: "smooth" });
				}
			} else {
				navigate(`/#${cleanId}`);
			}
			setMobileOpen(false);
		},
		[navigate],
	);
	return (
		<header className="sticky top-0 z-50 w-full bg-black/80 text-[13px] font-semibold text-white backdrop-blur-xs">
			<nav className="mx-auto max-w-7xl px-4 lg:px-6">
				<div className="relative flex items-center justify-between py-2">
					<div className="absolute inset-x-0 bottom-0 h-px bg-gray-800" />
					<DesktopNav
						menuItems={MENU_ITEMS}
						scrollToSection={scrollToSection}
					/>
					<Button
						type="button"
						aria-label="Open main menu"
						aria-expanded={mobileOpen}
						className="lg:hidden inline-flex p-2.5 rounded-md text-gray-300 transition hover:bg-gray-900 hover:text-gray-100"
						onClick={() => setMobileOpen(true)}
					>
						<Bars3Icon className="h-6 w-6" aria-hidden="true" />
					</Button>
					<NavLink to="/" className="absolute left-1/2 -translate-x-1/2 flex">
						<img
							src="/assets/logo_284x137-KoakP1Oi.png"
							alt="LUSH CONSTRUCTIONS"
							className="h-8 w-auto sm:h-10"
						/>
					</NavLink>
				</div>
			</nav>
			<MobileMenu
				isOpen={mobileOpen}
				onClose={() => setMobileOpen(false)}
				menuItems={MENU_ITEMS}
				scrollToSection={scrollToSection}
			/>
		</header>
	);
}
