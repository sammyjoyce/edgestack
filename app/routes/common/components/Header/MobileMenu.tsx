import { Dialog, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import type { JSX, MouseEvent } from "react";
import { NavLink } from "react-router";
import type { MenuItem, MenuItemRoute } from ".";
import { Button } from "../ui/Button";

/* ─── Props ──────────────────────────────────────── */

interface MobileMenuProps {
	isOpen: boolean;
	onClose: () => void;
	menuItems: readonly MenuItem[];
	scrollToSection: (
		e: MouseEvent<HTMLAnchorElement>,
		sectionId: string,
	) => void;
}

/* ─── Type guard ─────────────────────────────────── */

const isRoute = (i: MenuItem): i is MenuItemRoute =>
	"isRouteLink" in i && i.isRouteLink === true;

/* ─── Component ──────────────────────────────────── */

export default function MobileMenu({
	isOpen = false, // Provide default value to ensure boolean
	onClose,
	menuItems,
	scrollToSection,
}: MobileMenuProps): JSX.Element {
	return (
		<Dialog as="div" className="lg:hidden" open={isOpen} onClose={onClose}>
			{/* overlay */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						key="backdrop"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
						aria-hidden
					/>
				)}
			</AnimatePresence>

			{/* panel */}
			<DialogPanel className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto bg-black/95 px-6 py-6 shadow-2xl ring-1 ring-gray-800 backdrop-blur-lg">
				<div className="flex items-center justify-between">
					<NavLink to="/" className="-m-1.5 p-1.5" onClick={onClose}>
						<span className="sr-only">Lush Constructions Home</span>
						<img
							src="/assets/logo_284x137-KoakP1Oi.png"
							alt="LUSH CONSTRUCTIONS"
							className="h-8 w-auto sm:h-10"
						/>
					</NavLink>
					<button
						type="button"
						className="-m-2.5 p-2.5 rounded-md text-gray-300 transition hover:text-gray-100"
						onClick={onClose}
						aria-label="Close menu"
					>
						<XMarkIcon className="h-6 w-6" aria-hidden="true" />
					</button>
				</div>

				<nav className="mt-6 space-y-6">
					{menuItems.map((item) =>
						isRoute(item) ? (
							<NavLink
								key={item.name}
								to={item.path}
								onClick={onClose}
								className="block rounded-full px-5 py-2 text-base font-semibold text-gray-300 transition hover:bg-gray-900/50 hover:text-gray-100"
							>
								{item.name}
							</NavLink>
						) : (
							<a
								key={item.name}
								href={typeof item.path === "string" ? item.path : "#"}
								onClick={(e) => {
									const path = typeof item.path === "string" ? item.path : "#";
									scrollToSection(e, path.replace(/^#/, ""));
								}}
								className="block rounded-full px-5 py-2 text-base font-semibold text-gray-300 transition hover:bg-gray-900/50 hover:text-gray-100"
							>
								{item.name}
							</a>
						),
					)}
					<Button to="tel:0404289437" invert className="w-full">
						Call Us · 0404 289 437
					</Button>
				</nav>
			</DialogPanel>
		</Dialog>
	);
}
