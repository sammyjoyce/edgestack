"use client";
import * as Headless from "@headlessui/react";
import clsx from "clsx";
import type React from "react";
import { Button } from "./button";
import { Link } from "./link";

export function Dropdown(props: Headless.MenuProps) {
	return <Headless.Menu {...props} />;
}

export function DropdownButton<T extends React.ElementType = typeof Button>({
	as,
	...props
}: { className?: string; as?: T } & Omit<
	Headless.MenuButtonProps<T>,
	"className" | "as"
>) {
	const Component = as || Button;
	return <Headless.MenuButton as={Component as React.ElementType} {...props} />;
}

export function DropdownMenu({
	anchor = "bottom",
	className,
	...props
}: { className?: string } & Omit<Headless.MenuItemsProps, "as" | "className">) {
	return (
		<Headless.MenuItems
			{...props}
			transition
			anchor={anchor}
			className={clsx(
				className,
				"isolate z-10 mt-1 w-max min-w-48 rounded-md p-1",
				"bg-white dark:bg-zinc-800",
				"shadow-lg ring-1 ring-black/5 dark:ring-white/10",
				"focus:outline-none",
				"transition ease-out duration-100 data-closed:transform data-closed:opacity-0 data-closed:scale-95",
				"data-enter:transform data-enter:opacity-100 data-enter:scale-100",
			)}
		/>
	);
}

export function DropdownItem({
	className,
	...props
}: { className?: string } & (
	| Omit<Headless.MenuItemProps<"button">, "as" | "className">
	| Omit<Headless.MenuItemProps<typeof Link>, "as" | "className">
)) {
	const itemClasses = clsx(
		className,
		"group flex w-full items-center gap-x-2 rounded-md px-2.5 py-1.5 text-sm",
		"text-zinc-700 dark:text-zinc-200",
		"data-focus:bg-primary data-focus:text-white dark:data-focus:bg-primary-dark dark:data-focus:text-white",
		"data-disabled:opacity-50 data-disabled:cursor-not-allowed",
		"*:data-[slot=icon]:size-4 *:data-[slot=icon]:text-zinc-500 group-data-focus:*:data-[slot=icon]:text-white dark:*:data-[slot=icon]:text-zinc-400",
		"*:data-[slot=avatar]:size-5",
	);
	return "href" in props ? (
		<Headless.MenuItem as={Link} {...props} className={itemClasses} />
	) : (
		<Headless.MenuItem
			as="button"
			type="button"
			{...props}
			className={itemClasses}
		/>
	);
}

export function DropdownHeader({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	return (
		<div
			{...props}
			className={clsx(
				className,
				"px-2.5 py-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400",
			)}
		/>
	);
}

export function DropdownSection({
	className,
	...props
}: { className?: string } & Omit<
	Headless.MenuSectionProps,
	"as" | "className"
>) {
	return (
		<Headless.MenuSection {...props} className={clsx(className, "py-1")} />
	);
}

export function DropdownHeading({
	className,
	...props
}: { className?: string } & Omit<
	Headless.MenuHeadingProps,
	"as" | "className"
>) {
	return (
		<Headless.MenuHeading
			{...props}
			className={clsx(
				className,
				"px-2.5 pt-1.5 pb-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-300",
			)}
		/>
	);
}

export function DropdownDivider({
	className,
	...props
}: { className?: string } & Omit<
	Headless.MenuSeparatorProps,
	"as" | "className"
>) {
	return (
		<Headless.MenuSeparator
			{...props}
			className={clsx(className, "mx-1 my-1 h-px bg-zinc-200 dark:bg-zinc-700")}
		/>
	);
}

export function DropdownLabel({
	className,
	...props
}: { className?: string } & Omit<Headless.LabelProps, "as" | "className">) {
	return (
		<Headless.Label
			{...props}
			data-slot="label"
			className={clsx(className, "flex-1 truncate")}
		/>
	);
}

export function DropdownDescription({
	className,
	...props
}: { className?: string } & Omit<
	Headless.DescriptionProps,
	"as" | "className"
>) {
	return (
		<Headless.Description
			data-slot="description"
			{...props}
			className={clsx(
				className,
				"text-xs text-zinc-500 group-data-focus:text-primary-100 dark:text-zinc-400 dark:group-data-focus:text-primary-dark-100",
			)}
		/>
	);
}

export function DropdownShortcut({
	keys,
	className,
	...props
}: { keys: string | string[]; className?: string } & Omit<
	Headless.DescriptionProps<"kbd">,
	"as" | "className"
>) {
	return (
		<Headless.Description
			as="kbd"
			{...props}
			className={clsx(
				className,
				"ml-auto text-xs text-zinc-400 group-data-focus:text-primary-100 dark:group-data-focus:text-primary-dark-100",
			)}
		>
			{(Array.isArray(keys) ? keys : keys.split("")).map((char, index) => (
				<kbd
					key={index}
					className={clsx(
						"min-w-[1.5ch] text-center font-sans",
						index > 0 && char.length > 1 && "pl-0.5",
					)}
				>
					{char}
				</kbd>
			))}
		</Headless.Description>
	);
}
