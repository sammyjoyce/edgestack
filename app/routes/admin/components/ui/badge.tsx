import * as Headless from "@headlessui/react";
import clsx from "clsx";
import type React from "react";
import { forwardRef } from "react";
import { TouchTarget } from "./button";
import { Link } from "./link";

const simplifiedColors = {
	neutral:
		"bg-admin-background text-admin-foreground group-data-hover:bg-admin-border",
	primary:
		"bg-admin-primary text-admin-white group-data-hover:bg-admin-primary/80",
	success:
		"bg-admin-success text-admin-white group-data-hover:bg-admin-success/80",
	warning:
		"bg-admin-warning text-admin-black group-data-hover:bg-admin-warning/80",
	error:
		"bg-admin-error text-admin-white group-data-hover:bg-admin-error/80",
};
type BadgeProps = {
	color?: keyof typeof simplifiedColors;
	size?: "sm" | "md";
};
const badgeSizes = {
	sm: "px-1.5 py-0.5 text-xs/4 font-medium",
	md: "px-2 py-1 text-sm/5 font-medium",
};

export function Badge({
	color = "neutral",
	size = "sm",
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
		"focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-admin-primary",
	);
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
