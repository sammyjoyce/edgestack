import * as Headless from "@headlessui/react";
import clsx from "clsx";
import type React from "react";
import { forwardRef } from "react";
export const Textarea = forwardRef(function Textarea(
	{
		className,
		resizable = true,
		...props
	}: { className?: string; resizable?: boolean } & Omit<
		Headless.TextareaProps,
		"as" | "className"
	>,
	ref: React.ForwardedRef<HTMLTextAreaElement>,
) {
	return (
		<span
			data-slot="control"
			className={clsx([
				className,
				"relative block w-full",
				"before:absolute before:inset-px before:rounded-[calc(var(--radius-md)-1px)] before:bg-screen before:shadow-textarea",
				"dark:before:hidden",
				"after:pointer-events-none after:absolute after:inset-0 after:rounded-md after:ring-transparent after:ring-inset sm:focus-within:after:ring-2 sm:focus-within:after:ring-blue-500",
				"has-data-disabled:opacity-50 has-data-disabled:before:bg-zinc-950/5 has-data-disabled:before:shadow-none",
			])}
		>
			<Headless.Textarea
				ref={ref}
				{...props}
				className={clsx([
					"relative block h-full w-full appearance-none rounded-md px-3 py-2 sm:px-2.5 sm:py-1.5",
					"text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white",
					"bg-transparent",
					"focus:outline-hidden",
					"data-invalid:border-red-500 data-invalid:data-hover:border-red-500 dark:data-invalid:border-red-600 dark:data-invalid:data-hover:border-red-600",
					"disabled:border-zinc-950/20 dark:disabled:border-white/15 dark:disabled:bg-white/2.5 dark:data-hover:disabled:border-white/15",
					resizable ? "resize-y" : "resize-none",
				])}
			/>
		</span>
	);
});
