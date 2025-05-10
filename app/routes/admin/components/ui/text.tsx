import clsx from "clsx";
import React from "react"; 
import { Link } from "./link";
export function Text({
	className,
	...props
}: React.ComponentPropsWithoutRef<"p">) {
	return (
		<p
			{...props}
			className={clsx(className, "text-base text-zinc-700 dark:text-zinc-300")}
		/>
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
				"text-primary underline decoration-primary/50 hover:decoration-primary dark:text-primary-dark dark:decoration-primary-dark/50 dark:hover:decoration-primary-dark",
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
			className={clsx(className, "font-semibold text-zinc-900 dark:text-white")}
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
				"rounded-sm border border-zinc-200 bg-zinc-100 px-1 py-0.5 text-sm font-medium text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
			)}
		/>
	);
}
