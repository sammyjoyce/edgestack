import clsx from "clsx"; 
import type { ForwardedRef, ReactNode } from "react";
import React, { forwardRef } from "react"; 
import { Link, type To } from "react-router"; 
type ButtonProps = {
	invert?: boolean;
	className?: string;
	children?: ReactNode;
	to?: To; 
	href?: string;
	as?: any;
	[key: string]: any;
};
export const Button = forwardRef(function Button(
	{ invert = false, className, children, as, to, href, ...props }: ButtonProps,
	ref: ForwardedRef<HTMLElement>,
) {
	className = clsx(
		className,
		"inline-flex rounded-full px-4 py-1.5 text-sm font-semibold transition",
		invert ? "bg-white text-neutral-950 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-700"
			   : "bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-neutral-200 dark:text-neutral-950 dark:hover:bg-neutral-300"
	);
	const inner = <span className="relative top-px">{children}</span>;
	if (to !== undefined) {
		return (
			<Link to={to} className={className} {...props}>
				{inner}
			</Link>
		);
	}
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
	if (as && typeof as !== "string") {
		const Component = as;
		return (
			<Component ref={ref} className={className} {...props}>
				{inner}
			</Component>
		);
	}
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
