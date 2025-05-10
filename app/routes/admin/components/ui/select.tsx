import * as Headless from "@headlessui/react";
import clsx from "clsx";
import type React from "react";
import { forwardRef } from "react";

const ChevronUpDownIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 20 20"
		fill="currentColor"
		aria-hidden="true"
		className="size-5"
	>
		<path
			fillRule="evenodd"
			d="M10 3a.75.75 0 01.53.22l3.5 3.5a.75.75 0 01-1.06 1.06L10 4.81 6.53 7.78a.75.75 0 01-1.06-1.06l3.5-3.5A.75.75 0 0110 3zm-3.72 9.28a.75.75 0 011.06 0L10 14.19l2.66-2.67a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0l-3.25-3.25a.75.75 0 010-1.06z"
			clipRule="evenodd"
		/>
	</svg>
);

export const Select = forwardRef(function Select(
	{
		className,
		multiple,
		...props
	}: { className?: string } & Omit<Headless.SelectProps, "as" | "className">,
	ref: React.ForwardedRef<HTMLSelectElement>,
) {
	return (
		<div className={clsx("relative", className)}>
			<Headless.Select
				ref={ref}
				multiple={multiple}
				{...props}
				className={clsx([
					"block w-full appearance-none rounded-md border-zinc-300 bg-white py-2 dark:border-zinc-700 dark:bg-zinc-900",
					"text-base text-zinc-900 placeholder:text-zinc-500 dark:text-white sm:text-sm",
					"focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:focus:border-primary-dark dark:focus:ring-primary-dark",
					"data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
					"data-[invalid]:border-red-500 data-[invalid]:focus:border-red-500 data-[invalid]:focus:ring-red-500 dark:data-[invalid]:border-red-600 dark:data-[invalid]:focus:border-red-600 dark:data-[invalid]:focus:ring-red-600",
					multiple ? "px-3" : "pl-3 pr-10",
				])}
			/>
			{!multiple && (
				<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
					<ChevronUpDownIcon />
				</span>
			)}
		</div>
	);
});
