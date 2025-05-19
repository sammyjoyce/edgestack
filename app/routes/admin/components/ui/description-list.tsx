import clsx from "clsx";
import type React from "react";

export function DescriptionList({
	className,
	...props
}: React.ComponentPropsWithoutRef<"dl">) {
	return (
		<dl
			{...props}
			className={clsx(
				className,
				"grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3",
				"text-sm",
			)}
		/>
	);
}

export function DescriptionTerm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"dt">) {
	return (
		<dt
			{...props}
			className={clsx(
				className,
				"font-medium text-admin-foreground sm:col-span-1",
				"pt-2 pb-1 border-b border-admin-border first:pt-0 first:border-t-0 sm:border-b-0 sm:pb-0",
			)}
		/>
	);
}

export function DescriptionDetails({
	className,
	...props
}: React.ComponentPropsWithoutRef<"dd">) {
	return (
		<dd
			{...props}
			className={clsx(
				className,
				"text-admin-text sm:col-span-2",
				"pt-1 pb-2 border-b border-admin-border sm:border-b-0 sm:pt-2 sm:pb-0",
			)}
		/>
	);
}
