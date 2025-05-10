import * as Headless from "@headlessui/react";
import clsx from "clsx";
import React, { forwardRef } from "react";
import { TouchTarget } from "./button"; // Assuming TouchTarget is appropriately styled
import { Link } from "./link"; // Assuming Link is appropriately styled

// Simplified color palette for badges, aligning with typical UI needs
const simplifiedColors = {
	neutral:
		"bg-zinc-100 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200 group-data-hover:bg-zinc-200 dark:group-data-hover:bg-zinc-600",
	primary:
		"bg-primary-100 text-primary-700 dark:bg-primary-700 dark:text-primary-200 group-data-hover:bg-primary-200 dark:group-data-hover:bg-primary-600",
	success:
		"bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-200 group-data-hover:bg-green-200 dark:group-data-hover:bg-green-600",
	warning:
		"bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-200 group-data-hover:bg-yellow-200 dark:group-data-hover:bg-yellow-600",
	error:
		"bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-200 group-data-hover:bg-red-200 dark:group-data-hover:bg-red-600",
	// Add more variants if absolutely necessary, but aim for simplicity
};

type BadgeProps = {
	color?: keyof typeof simplifiedColors; // Use the new simplified color keys
	size?: "sm" | "md"; // Optional size prop
};

const badgeSizes = {
	sm: "px-1.5 py-0.5 text-xs/4 font-medium",
	md: "px-2 py-1 text-sm/5 font-medium",
};

export function Badge({
	color = "neutral",
	size = "sm", // Default to small size
	className,
	...props
}: BadgeProps & React.ComponentPropsWithoutRef<"span">) {
	const colorClasses = simplifiedColors[color] || simplifiedColors.neutral;
	const sizeClasses = badgeSizes[size] || badgeSizes.sm;

	return (
		<span
			{...props}
			className={clsx(
				className,
				"inline-flex items-center gap-x-1 rounded-md",
				"forced-colors:outline",
				colorClasses,
				sizeClasses,
			)}
		/>
	);
}

export const BadgeButton = forwardRef(function BadgeButton(
	{
		color = "neutral",
		size = "sm",
		className,
		children,
		...props
	}: BadgeProps & { className?: string; children: React.ReactNode } & (
			| Omit<Headless.ButtonProps, "as" | "className">
			| Omit<React.ComponentPropsWithoutRef<typeof Link>, "className">
		),
	ref: React.ForwardedRef<HTMLElement>,
) {
	const baseClasses = clsx(
		"group relative inline-flex items-center justify-center rounded-md",
		"focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary dark:focus:ring-primary-dark", // Consistent focus styling
	);

	// Apply badge-specific styling to the inner Badge component, not the button wrapper
	const badgeElement = (
		<Badge color={color} size={size}>
			{children}
		</Badge>
	);

	return "href" in props ? (
		<Link
			{...props}
			className={clsx(baseClasses, className)}
			ref={ref as React.ForwardedRef<HTMLAnchorElement>}
		>
			<TouchTarget>{badgeElement}</TouchTarget>
		</Link>
	) : (
		<Headless.Button
			{...props}
			className={clsx(baseClasses, className)}
			ref={ref}
		>
			<TouchTarget>{badgeElement}</TouchTarget>
		</Headless.Button>
	);
});
