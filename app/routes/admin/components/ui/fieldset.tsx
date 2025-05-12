import * as Headless from "@headlessui/react";
import clsx from "clsx";
import type React from "react";

export function Fieldset({
	className,
	...props
}: { className?: string } & Omit<Headless.FieldsetProps, "as" | "className">) {
	return (
		<Headless.Fieldset
			{...props}
			className={clsx(
				className,
				"space-y-6 rounded-lg border border-admin-border p-4",
			)}
		/>
	);
}

export function Legend({
	className,
	...props
}: { className?: string } & Omit<Headless.LegendProps, "as" | "className">) {
	return (
		<Headless.Legend
			data-slot="legend"
			{...props}
			className={clsx(
				className,
				"text-base font-semibold text-zinc-900 data-disabled:opacity-50",
			)}
		/>
	);
}

export function FieldGroup({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	return (
		<div
			data-slot="control"
			{...props}
			className={clsx(className, "space-y-4")}
		/>
	);
}

export function Field({
	className,
	...props
}: { className?: string } & Omit<Headless.FieldProps, "as" | "className">) {
	return (
		<Headless.Field
			{...props}
			className={clsx(className, "flex flex-col gap-1.5")}
		/>
	);
}

export function Label({
	className,
	...props
}: { className?: string } & Omit<Headless.LabelProps, "as" | "className">) {
	return (
		<Headless.Label
			data-slot="label"
			{...props}
			className={clsx(
				className,
				"text-sm font-medium text-zinc-900 select-none data-disabled:opacity-50",
			)}
		/>
	);
}

export function Description({
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
				"text-sm text-zinc-500 data-disabled:opacity-50",
			)}
		/>
	);
}

export function ErrorMessage({
	className,
	...props
}: { className?: string } & Omit<
	Headless.DescriptionProps,
	"as" | "className"
>) {
	return (
		<Headless.Description
			data-slot="error"
			{...props}
			className={clsx(
				className,
				"text-sm text-red-600 data-disabled:opacity-50",
			)}
		/>
	);
}
