import * as Headless from "@headlessui/react";
import clsx from "clsx";
import type React from "react";

export function RadioGroup({
	className,
	...props
}: { className?: string } & Omit<
	Headless.RadioGroupProps,
	"as" | "className"
>) {
	return (
		<Headless.RadioGroup {...props} className={clsx(className, "space-y-3")} />
	);
}

export function RadioField({
	className,
	...props
}: { className?: string } & Omit<Headless.FieldProps, "as" | "className">) {
	return (
		<Headless.Field
			{...props}
			className={clsx(className, "flex items-center gap-x-3")}
		/>
	);
}

export function Radio({
	className,
	...props
}: { className?: string } & Omit<
	Headless.RadioProps,
	"as" | "className" | "children"
>) {
	return (
		<Headless.Radio
			{...props}
			className={clsx(
				className,
				"group flex size-5 items-center justify-center rounded-full border bg-white",
				"border-zinc-300 hover:border-zinc-400",
				"focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
				"data-checked:border-primary data-checked:hover:border-primary-hover",
				"data-disabled:opacity-50 data-disabled:pointer-events-none",
			)}
		>
			<span
				className={clsx(
					"size-2 rounded-full bg-transparent",
					"group-data-checked:bg-primary",
				)}
			/>
		</Headless.Radio>
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
			className={clsx(className, "text-sm font-medium text-zinc-900")}
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
			className={clsx(className, "text-sm text-zinc-600")}
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
			className={clsx(className, "text-sm text-red-600")}
		/>
	);
}
