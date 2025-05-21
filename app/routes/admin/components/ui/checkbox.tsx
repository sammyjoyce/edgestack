import * as Headless from "@headlessui/react";
import clsx from "clsx";
import type React from "react";

export function CheckboxGroup({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	return (
		<div
			data-slot="control"
			{...props}
			className={clsx(
				className,
				"space-y-3",
				"has-data-[slot=description]:space-y-6 has-data-[slot=description]:**:data-[slot=label]:font-medium",
			)}
		/>
	);
}

export function CheckboxField({
	className,
	...props
}: { className?: string } & Omit<Headless.FieldProps, "as" | "className">) {
	return (
		<Headless.Field
			data-slot="field"
			{...props}
			className={clsx(
				className,
				"grid grid-cols-[1.125rem_1fr] gap-x-4 gap-y-1 sm:grid-cols-[1rem_1fr]",
				"*:data-[slot=control]:col-start-1 *:data-[slot=control]:row-start-1 *:data-[slot=control]:mt-0.75 sm:*:data-[slot=control]:mt-1",
				"*:data-[slot=label]:col-start-2 *:data-[slot=label]:row-start-1",
				"*:data-[slot=description]:col-start-2 *:data-[slot=description]:row-start-2",
				"has-data-[slot=description]:**:data-[slot=label]:font-medium",
			)}
		/>
	);
}

const baseStyles = [
	"relative isolate flex size-4 items-center justify-center rounded-sm",
	"border border-admin-border",
	"bg-admin-white",
	"group-data-checked:bg-admin-primary group-data-checked:border-admin-primary",
	"group-data-focus:outline-2 group-data-focus:outline-offset-2 group-data-focus:outline-admin-primary",
	"group-data-disabled:opacity-50 group-data-disabled:cursor-not-allowed",
	"group-data-disabled:border-admin-border",
	"group-data-disabled:bg-admin-background",
	"group-data-checked:group-data-disabled:bg-admin-primary/50 group-data-checked:group-data-disabled:border-admin-primary/50",
];

export function Checkbox({
	className,
	...props
}: {
	className?: string;
} & Omit<Headless.CheckboxProps, "as" | "className">) {
	return (
		<Headless.Checkbox
			data-slot="control"
			{...props}
			className={clsx(className, "group inline-flex focus:outline-hidden")}
		>
			<span className={clsx(baseStyles)}>
				<svg
					className="size-3.5 stroke-white opacity-0 group-data-checked:opacity-100 group-data-disabled:stroke-zinc-400"
					viewBox="0 0 14 14"
					fill="none"
				>
					<title>Checkmark</title>
					<path
						className="opacity-100 group-data-indeterminate:opacity-0"
						d="M3 8L6 11L11 3.5"
						strokeWidth={2}
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						className="opacity-0 group-data-indeterminate:opacity-100"
						d="M3 7H11"
						strokeWidth={2}
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</span>
		</Headless.Checkbox>
	);
}
