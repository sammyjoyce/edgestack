import clsx from "clsx"; // Use direct import
import type { ForwardedRef, ReactNode } from "react";
import React, { forwardRef } from "react"; // Import React
import { Link, type To } from "react-router"; // Import To type

// Simplified Button props - covers all the different use cases
type ButtonProps = {
	invert?: boolean;
	className?: string;
	children?: ReactNode;
	// For Link component
	to?: To; // Use the To type from react-router
	// For anchor element
	href?: string;
	// For polymorphic rendering
	as?: any;
	// Allow any other props
	[key: string]: any;
};

// Much simpler implementation with clearer rendering logic
export const Button = forwardRef(function Button(
	{ invert = false, className, children, as, to, href, ...props }: ButtonProps,
	ref: ForwardedRef<HTMLElement>,
) {
	className = clsx(
		className,
		"inline-flex rounded-full px-4 py-1.5 text-sm font-semibold transition",
		// If invert is true (button is on a dark background):
		// Light mode: light button. Dark mode: still a contrasting button for dark backgrounds (e.g. slightly lighter or darker than main dark bg if it's on a card)
		// If invert is false (button is on a light background):
		// Light mode: dark button. Dark mode: light button.
		invert ? "bg-white text-neutral-950 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-700"
			   : "bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-neutral-200 dark:text-neutral-950 dark:hover:bg-neutral-300"
	);

	const inner = <span className="relative top-px">{children}</span>;

	// React Router Link (highest priority)
	if (to !== undefined) {
		return (
			<Link to={to} className={className} {...props}>
				{inner}
			</Link>
		);
	}

	// HTML anchor
	if (href !== undefined || as === "a") {
		return (
			<a
				ref={ref as ForwardedRef<HTMLAnchorElement>}
				href={href}
				className={className}
				{...props}
			>
				{inner}
			</a>
		);
	}

	// Custom component
	if (as && typeof as !== "string") {
		const Component = as;
		return (
			<Component ref={ref} className={className} {...props}>
				{inner}
			</Component>
		);
	}

	// Default button
	return (
		<button
			ref={ref as ForwardedRef<HTMLButtonElement>}
			className={className}
			{...props}
		>
			{inner}
		</button>
	);
});
