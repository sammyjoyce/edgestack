import clsx from "clsx";
import type React from "react";

/**
 * SectionCard: Wraps a section in the standard admin container style.
 */
export function SectionCard({
	children,
	className,
}: React.PropsWithChildren<{ className?: string }>) {
	return (
		<div
			className={clsx(
				"overflow-hidden bg-gray-50 sm:rounded-lg shadow-[var(--shadow-input-default)] border border-gray-200",
				className,
			)}
		>
			<div className="p-6">{children}</div>
		</div>
	);
}

/**
 * SectionHeading: Large heading for a section.
 */
export function SectionHeading({
	children,
	className,
}: React.PropsWithChildren<{ className?: string }>) {
	return (
		<h2 className={clsx("text-xl font-semibold text-gray-900 mb-6", className)}>
			{children}
		</h2>
	);
}

/**
 * FieldRow: For grouping a label and input/field together in a vertical stack.
 */
export function FieldRow({
	children,
	className,
}: React.PropsWithChildren<{ className?: string }>) {
	return (
		<div className={clsx("flex flex-col gap-y-1.5", className)}>{children}</div>
	);
}

/**
 * FieldLabel: Standard label styling for section forms.
 */
export function FieldLabel({
	htmlFor,
	children,
	className,
}: React.PropsWithChildren<{ htmlFor?: string; className?: string }>) {
	return (
		<label
			htmlFor={htmlFor}
			className={clsx(
				"block text-sm font-medium text-gray-700 mb-1",
				className,
			)}
		>
			{children}
		</label>
	);
}
