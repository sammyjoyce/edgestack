import clsx from "clsx";
import type React from "react";
import { Link } from "./link";

export function Text({
	className,
	...props
}: React.ComponentPropsWithoutRef<"p">) {
	return (
		<p {...props} className={clsx(className, "text-base text-admin-text")} />
	);
}

export function TextLink({
	className,
	...props
}: React.ComponentPropsWithoutRef<typeof Link>) {
	return (
		<Link
			{...props}
			className={clsx(
				className,
				"text-primary underline decoration-primary/50 hover:decoration-primary",
			)}
		/>
	);
}

export function Strong({
	className,
	...props
}: React.ComponentPropsWithoutRef<"strong">) {
	return (
		<strong
			{...props}
			className={clsx(className, "font-semibold text-admin-foreground")}
		/>
	);
}

export function Code({
	className,
	...props
}: React.ComponentPropsWithoutRef<"code">) {
	return (
		<code
			{...props}
			className={clsx(
				className,
				"rounded-sm border border-admin-border bg-admin-screen px-1 py-0.5 text-sm font-medium text-admin-foreground",
			)}
		/>
	);
}
