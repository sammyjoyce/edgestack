import clsx from "clsx";
import type React from "react"; // Added React import

type HeadingProps = {
	level?: 1 | 2 | 3 | 4 | 5 | 6;
	as?: React.ElementType; // Allow overriding the HTML element
} & React.ComponentPropsWithoutRef<"h1" | "h2" | "h3" | "h4" | "h5" | "h6">;

const levelStyles = {
	1: "text-3xl font-semibold text-zinc-900 dark:text-white sm:text-4xl tracking-tight",
	2: "text-2xl font-semibold text-zinc-900 dark:text-white sm:text-3xl tracking-tight",
	3: "text-xl font-medium text-zinc-900 dark:text-white sm:text-2xl",
	4: "text-lg font-medium text-zinc-900 dark:text-white sm:text-xl",
	5: "text-base font-medium text-zinc-900 dark:text-white sm:text-lg",
	6: "text-sm font-medium text-zinc-900 dark:text-white sm:text-base",
};

export function Heading({ className, level = 1, as, ...props }: HeadingProps) {
	const Element = as || (`h${level}` as React.ElementType);

	return <Element {...props} className={clsx(className, levelStyles[level])} />;
}

// Subheading can be considered a specific use case of Heading or a separate component
// For simplicity, we'll keep it separate but ensure its styles are consistent.
export function Subheading({
	className,
	level = 2,
	as,
	...props
}: HeadingProps) {
	const Element = as || (`h${level}` as React.ElementType);
	// Subheading might use slightly different styling or be a specific level of Heading
	// For now, let's assume it uses the same levelStyles but defaults to h2 or h3
	const subLevel = Math.max(2, Math.min(6, level)) as 2 | 3 | 4 | 5 | 6; // Ensure level is within 2-6

	const subheadingStyles = {
		2: "text-xl font-medium text-zinc-700 dark:text-zinc-300 sm:text-2xl",
		3: "text-lg font-medium text-zinc-700 dark:text-zinc-300 sm:text-xl",
		4: "text-base font-medium text-zinc-700 dark:text-zinc-300 sm:text-lg",
		// Add more if needed, or adjust existing ones
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
