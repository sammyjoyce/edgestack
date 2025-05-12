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
				"relative block w-full ring-1 ring-gray-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-blue-500 disabled:opacity-50",
			])}
		>
			<Headless.Textarea
				ref={ref}
				{...props}
				className={clsx([
					"relative block h-full w-full appearance-none rounded-md px-3 py-2 sm:px-2.5 sm:py-1.5",
					"text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6",
					"bg-transparent",
					"focus:outline-hidden",
					"data-invalid:border-red-500 data-invalid:data-hover:border-red-500",
					"disabled:border-zinc-950/20",
					resizable ? "resize-y" : "resize-none",
				])}
			/>
		</span>
	);
});
