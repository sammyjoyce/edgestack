import clsx from "clsx";
import type React from "react";

export function SectionCard({
	children,
	className,
}: React.PropsWithChildren<{ className?: string }>) {
	return (
		<div
			className={clsx(
				"overflow-hidden bg-admin-white rounded-lg shadow-input-default border border-admin-border",
				className,
			)}
		>
			<div className="p-6">{children}</div>
		</div>
	);
}

export function SectionHeading({
	children,
	className,
}: React.PropsWithChildren<{ className?: string }>) {
	return (
		<h2
			className={clsx(
				"text-xl font-semibold text-admin-foreground mb-4 md:mb-6",
				className,
			)}
		>
			{children}
		</h2>
	);
}

export function FieldRow({
	children,
	className,
}: React.PropsWithChildren<{ className?: string }>) {
	return (
		<div className={clsx("flex flex-col gap-y-1.5", className)}>{children}</div>
	);
}

export function FieldLabel({
	htmlFor,
	children,
	className,
}: React.PropsWithChildren<{ htmlFor?: string; className?: string }>) {
	return (
		<label
			htmlFor={htmlFor}
			className={clsx(
				"block text-sm font-medium text-admin-text mb-1",
				className,
			)}
		>
			{children}
		</label>
	);
}
