import { Bars3Icon } from "@heroicons/react/24/outline";
import type React from "react"; // Import React hooks
import { useCallback, useState } from "react";
import { NavLink, type To } from "react-router"; // Import To type
import { Button } from "~/routes/common/components/ui/Button"; // Corrected path
import DesktopNav from "./DesktopNav"; // Import DesktopNav
import MobileMenu from "./MobileMenu"; // Import MobileMenu

// Define MenuItem type locally or import if shared
interface MenuItem {
	name: string;
	path: To | string; // Use To for internal, string for fragments/external
	isRouteLink?: boolean;
	submenu?: { name: string; path: string }[]; // Submenu paths are likely fragments
}

const menuItems: MenuItem[] = [
	{ name: "Home", path: "#hero" },
	{
		name: "Our Services",
		path: "#services",
		submenu: [
			{ name: "Renovations", path: "#service-renovations" },
			{ name: "Extensions", path: "#service-extensions" },
			{ name: "New Builds", path: "#service-new-builds" },
			{ name: "Commercial", path: "#service-commercial" },
		],
	},
	{ name: "Projects", path: "/projects", isRouteLink: true },
	{ name: "About Us", path: "#about" },
	{ name: "Contact Us", path: "#contact" },
];

function Header(): React.JSX.Element {
	// Changed to React.JSX.Element
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	// Keep scrollToSection logic here as it's used by both navs
	const scrollToSection = useCallback(
		(event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
			event.preventDefault();
			const element = document.getElementById(sectionId.replace("#", ""));
			if (element) {
				element.scrollIntoView({ behavior: "smooth" });
				setMobileMenuOpen(false);
			}
		},
		[],
	);

	return (
		<header className="sticky inset-shadow-black/10 inset-shadow-sm inset-x-0 top-0 z-50 w-full flex-none bg-black font-semibold text-[13px] text-white shadow-premium backdrop-blur-xs supports-backdrop-filter:bg-black">
			<nav className="mx-auto max-w-7xl px-4 lg:px-6">
				<div className="relative flex items-center justify-between py-2">
					<div className="absolute inset-x-0 bottom-0 h-px bg-gray-800" />

					{/* Render DesktopNav */}
					<DesktopNav menuItems={menuItems} scrollToSection={scrollToSection} />

					{/* Mobile menu button (left) */}
					<div className="flex lg:hidden">
						<button
							type="button"
							className="inline-flex items-center justify-center rounded-md p-2.5 text-gray-300 transition-all duration-300 ease-in-out hover:inset-shadow-sm hover:inset-shadow-white/5 hover:bg-gray-900 hover:text-gray-100"
							onClick={() => setMobileMenuOpen(true)}
						>
							<span className="sr-only">Open main menu</span>
							<Bars3Icon className="h-6 w-6" aria-hidden="true" />
						</button>
					</div>

					{/* Logo (centered) */}
					<div className="-translate-x-1/2 absolute left-1/2 flex transform justify-center">
						<NavLink to="/" className="relative z-10">
							<img
								src="/assets/logo_284x137-KoakP1Oi.png"
								alt="LUSH CONSTRUCTIONS"
								className="h-[32px] w-auto sm:h-[40px]"
							/>
						</NavLink>
					</div>

					{/* Right navigation items and CTA */}
					<div className="flex items-center justify-end lg:justify-start">
						{/* CTA Button (using Button component) - Kept in Header */}
						<Button
							to="tel:0404289437"
							className="ml-4 flex items-center px-3 py-2 sm:ml-8 sm:px-4 sm:py-2 lg:ml-6 min-[80rem]:flex text-base font-semibold bg-white text-neutral-950 hover:bg-neutral-200 rounded-full shadow-md transition-all duration-300"
							invert
						>
							<span className="block lg:inline">0404 289 437</span>
						</Button>
					</div>
				</div>
			</nav>

			{/* Render MobileMenu */}
			<MobileMenu
				isOpen={mobileMenuOpen}
				onClose={() => setMobileMenuOpen(false)}
				menuItems={menuItems}
				scrollToSection={scrollToSection}
			/>
		</header>
	);
}

export default Header;