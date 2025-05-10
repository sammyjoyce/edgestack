"use client";

import clsx from "clsx";
import type React from "react"; // Ensured React is imported
import { createContext, useContext, useState } from "react";
import { Link } from "./link";

const TableContext = createContext<{
	bleed: boolean;
	dense: boolean;
	grid: boolean;
	striped: boolean;
}>({
	bleed: false,
	dense: false,
	grid: false,
	striped: false,
});

export function Table({
	bleed = false,
	dense = false,
	grid = false,
	striped = false,
	className,
	children,
	...props
}: {
	bleed?: boolean;
	dense?: boolean;
	grid?: boolean;
	striped?: boolean;
} & React.ComponentPropsWithoutRef<"div">) {
	return (
		<TableContext.Provider value={{ bleed, dense, grid, striped }}>
			<div className="flow-root">
				<div
					{...props}
					className={clsx(
						className,
						"-mx-4 overflow-x-auto whitespace-nowrap sm:-mx-6 lg:-mx-8", // Standardized negative margins
					)}
				>
					<div
						className={clsx(
							"inline-block min-w-full align-middle",
							!bleed && "sm:px-6 lg:px-8",
						)}
					>
						<table className="min-w-full text-left text-sm text-zinc-900 dark:text-white">
							{children}
						</table>
					</div>
				</div>
			</div>
		</TableContext.Provider>
	);
}

export function TableHead({
	className,
	...props
}: React.ComponentPropsWithoutRef<"thead">) {
	return (
		<thead
			{...props}
			className={clsx(
				className,
				"text-sm font-semibold text-zinc-900 dark:text-white",
			)}
		/>
	);
}

export function TableBody(props: React.ComponentPropsWithoutRef<"tbody">) {
	return (
		<tbody
			{...props}
			className="divide-y divide-zinc-200 dark:divide-zinc-800"
		/>
	);
}

const TableRowContext = createContext<{
	href?: string;
	target?: string;
	title?: string;
}>({
	href: undefined,
	target: undefined,
	title: undefined,
});

export function TableRow({
	href,
	target,
	title,
	className,
	...props
}: {
	href?: string;
	target?: string;
	title?: string;
} & React.ComponentPropsWithoutRef<"tr">) {
	const { striped } = useContext(TableContext);

	return (
		<TableRowContext.Provider value={{ href, target, title }}>
			<tr
				{...props}
				className={clsx(
					className,
					href && "hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
					striped && "even:bg-zinc-100/50 dark:even:bg-zinc-800/50",
					href &&
						"has-[[data-row-link][data-focus]]:ring-2 has-[[data-row-link][data-focus]]:ring-inset has-[[data-row-link][data-focus]]:ring-primary dark:has-[[data-row-link][data-focus]]:ring-primary-dark",
				)}
			/>
		</TableRowContext.Provider>
	);
}

export function TableHeader({
	className,
	...props
}: React.ComponentPropsWithoutRef<"th">) {
	const { bleed, grid } = useContext(TableContext);

	return (
		<th
			{...props}
			className={clsx(
				className,
				"border-b border-zinc-200 px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:border-zinc-800 dark:text-white",
				grid &&
					"border-l border-zinc-200 first:border-l-0 dark:border-zinc-800",
				bleed ? "pl-4 pr-3 sm:pl-6 lg:pl-8" : "pl-3 pr-3",
			)}
		/>
	);
}

export function TableCell({
	className,
	children,
	...props
}: React.ComponentPropsWithoutRef<"td">) {
	const { bleed, dense, grid } = useContext(TableContext);
	const { href, target, title } = useContext(TableRowContext);
	const [cellRef, setCellRef] = useState<HTMLElement | null>(null);

	return (
		<td
			ref={href ? setCellRef : undefined}
			{...props}
			className={clsx(
				className,
				"relative px-3",
				dense ? "py-2" : "py-4",
				grid &&
					"border-l border-zinc-200 first:border-l-0 dark:border-zinc-800",
				bleed ? "pl-4 pr-3 sm:pl-6 lg:pl-8" : "pl-3 pr-3",
			)}
		>
			{href && (
				<Link
					data-row-link
					href={href}
					target={target}
					aria-label={title}
					tabIndex={cellRef?.previousElementSibling === null ? 0 : -1}
					className="absolute inset-0 focus:outline-none"
				/>
			)}
			{children}
		</td>
	);
}
