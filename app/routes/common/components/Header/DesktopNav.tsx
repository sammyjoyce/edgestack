import type { JSX, MouseEvent } from "react";
import type { MenuItem, MenuItemAnchor, MenuItemRoute, Path } from ".";
import { Button } from "../ui/Button";

/* ─── Props ──────────────────────────────────────── */

export interface DesktopNavProps {
	menuItems: readonly MenuItem[];
	scrollToSection: (e: MouseEvent<HTMLAnchorElement>, id: string) => void;
}

/* ─── Type guards ────────────────────────────────── */

const isRoute = (i: MenuItem): i is MenuItemRoute =>
	"isRouteLink" in i && i.isRouteLink;

const isAnchorPath = (p: Path): p is `#${string}` | `http${string}` =>
	typeof p === "string";

/* ─── Helpers ────────────────────────────────────── */

function LinkButton(
	item: MenuItemRoute | MenuItemAnchor,
	scrollTo: DesktopNavProps["scrollToSection"],
) {
	if (isRoute(item)) {
		return (
			<Button key={item.name} to={item.path}>
				{item.name}
			</Button>
		);
	}

	// anchor / external:
	const href = item.path;
	const id =
		isAnchorPath(href) && href.startsWith("#") ? href.slice(1) : undefined;

	return (
		<Button
			key={item.name}
			href={href}
			onClick={id ? (e) => scrollTo(e, id) : undefined}
		>
			{item.name}
		</Button>
	);
}

/* ─── Component ──────────────────────────────────── */

export default function DesktopNav({
	menuItems,
	scrollToSection,
}: DesktopNavProps): JSX.Element {
	const [left, right] = [menuItems.slice(0, 3), menuItems.slice(3)];

	return (
		<>
			<nav className="hidden lg:flex items-center gap-x-4">
				{left.map((i) => LinkButton(i, scrollToSection))}
			</nav>

			<nav className="hidden lg:flex items-center gap-x-4">
				{right.map((i) => LinkButton(i, scrollToSection))}
				<Button to="tel:0404289437" size="xs" invert>
					0404 289 437
				</Button>
			</nav>
		</>
	);
}
