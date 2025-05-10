import * as Headless from "@headlessui/react";
import clsx from "clsx";
import React from "react"; 
export function SwitchGroup({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	return <div {...props} className={clsx(className, "space-y-3")} />;
}
export function SwitchField({
	className,
	...props
}: { className?: string } & Omit<Headless.FieldProps, "as" | "className">) {
	return (
		<Headless.Field
			{...props}
			className={clsx(className, "flex items-center justify-between gap-x-3")}
		/>
	);
}
export function Switch({
	className,
	...props
}: {
	className?: string;
} & Omit<Headless.SwitchProps, "as" | "className" | "children">) {
	return (
		<Headless.Switch
			{...props}
			className={clsx(
				className,
				"group relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out",
				"bg-zinc-200 data-checked:bg-primary dark:bg-zinc-700 dark:data-checked:bg-primary-dark",
				"focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-primary-dark dark:ring-offset-zinc-900",
				"data-disabled:cursor-not-allowed data-disabled:opacity-50",
			)}
		>
			<span
				aria-hidden="true"
				className={clsx(
					"pointer-events-none inline-block size-5 translate-x-0.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
					"group-data-checked:translate-x-5.5",
				)}
			/>
		</Headless.Switch>
	);
}
export function Label({
	className,
	...props
}: React.ComponentPropsWithoutRef<"label">) {
	return (
		<Headless.Label
			{...props}
			data-slot="label"
			className={clsx(
				className,
				"text-sm font-medium text-zinc-900 dark:text-white",
			)}
		/>
	);
}
export function Description({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	return (
		<Headless.Description
			{...props}
			data-slot="description"
			className={clsx(className, "text-sm text-zinc-600 dark:text-zinc-400")}
		/>
	);
}
export function ErrorMessage({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	return (
		<Headless.Description
			{...props}
			data-slot="error"
			className={clsx(className, "text-sm text-red-600 dark:text-red-500")}
		/>
	);
}
