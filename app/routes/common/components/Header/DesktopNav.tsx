import type { JSX, MouseEvent } from "react";
import type { MenuItem } from ".";
import { Button } from "../ui/Button";
import { useMenuItemInfo } from "./useMenuItemInfo";

export interface DesktopNavProps {
	menuItems: readonly MenuItem[];
	scrollToSection: (e: MouseEvent<HTMLAnchorElement>, id: string) => void;
}

function LinkButton(
	item: MenuItem,
	scrollTo: DesktopNavProps["scrollToSection"],
) {
	const { isRoute, rawPath, isHomeWithHash, hashPart, anchorHref } =
		useMenuItemInfo(item);
	if (isRoute) {
		if (isHomeWithHash) {
			return (
				<Button
					key={item.name}
					href={`#${hashPart}`}
					onClick={(e: MouseEvent<HTMLAnchorElement>) => scrollTo(e, hashPart)}
				>
					{item.name}
				</Button>
			);
		}
		return (
			<Button key={item.name} to={rawPath}>
				{item.name}
			</Button>
		);
	}
	const id = anchorHref.startsWith("#") ? anchorHref.slice(1) : undefined;
	return (
		<Button
			key={item.name}
			href={anchorHref}
			onClick={
				id ? (e: MouseEvent<HTMLAnchorElement>) => scrollTo(e, id) : undefined
			}
		>
			{item.name}
		</Button>
	);
}

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
				<Button to="tel:0000000000" size="xs" invert>
					000-000-0000
				</Button>
			</nav>
		</>
	);
}
