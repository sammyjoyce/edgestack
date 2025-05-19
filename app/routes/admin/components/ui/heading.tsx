import clsx from "clsx";
import type React from "react";

type HeadingProps = {
	level?: 1 | 2 | 3 | 4 | 5 | 6;
	as?: React.ElementType;
} & React.ComponentPropsWithoutRef<"h1" | "h2" | "h3" | "h4" | "h5" | "h6">;
const levelStyles = {
	1: "text-3xl font-semibold text-admin-foreground sm:text-4xl tracking-tight",
	2: "text-2xl font-semibold text-admin-foreground sm:text-3xl tracking-tight",
	3: "text-xl font-medium text-admin-foreground sm:text-2xl",
	4: "text-lg font-medium text-admin-foreground sm:text-xl",
	5: "text-base font-medium text-admin-foreground sm:text-lg",
	6: "text-sm font-medium text-admin-foreground sm:text-base",
};

export function Heading({ className, level = 1, as, ...props }: HeadingProps) {
	const Element = as || (`h${level}` as React.ElementType);
	return <Element {...props} className={clsx(className, levelStyles[level])} />;
}

export function Subheading({
	className,
	level = 2,
	as,
	...props
}: HeadingProps) {
	const Element = as || (`h${level}` as React.ElementType);
	const subLevel = Math.max(2, Math.min(6, level)) as 2 | 3 | 4 | 5 | 6;
	const subheadingStyles = {
		2: "text-xl font-medium text-admin-text sm:text-2xl",
		3: "text-lg font-medium text-admin-text sm:text-xl",
		4: "text-base font-medium text-admin-text sm:text-lg",
	};
	return (
		<Element
			{...props}
			className={clsx(
				className,
				subheadingStyles[subLevel as keyof typeof subheadingStyles] ||
					levelStyles[subLevel],
			)}
		/>
	);
}
