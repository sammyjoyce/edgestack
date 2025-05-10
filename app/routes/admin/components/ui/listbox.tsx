"use client";
import * as Headless from "@headlessui/react";
import clsx from "clsx";
import React, { Fragment } from "react";
const CheckIcon = () => (
	<svg
		className="size-4 stroke-current group-data-selected/option:inline"
		viewBox="0 0 16 16"
		fill="none"
		aria-hidden="true"
	>
		<path
			d="M4 8.5l3 3L12 4"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);
const ChevronUpDownIcon = () => (
	<svg
		className="size-5 stroke-zinc-500 group-data-disabled:stroke-zinc-600 dark:stroke-zinc-400"
		viewBox="0 0 16 16"
		aria-hidden="true"
		fill="none"
	>
		<path
			d="M5.75 10.75L8 13L10.25 10.75"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M10.25 5.25L8 3L5.75 5.25"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);
export function Listbox<TValue>({
	className,
	placeholder,
	autoFocus,
	"aria-label": ariaLabel,
	children: options,
	value,
	onChange,
	...props
}: {
	className?: string;
	placeholder?: React.ReactNode;
	autoFocus?: boolean;
	"aria-label"?: string;
	children?: React.ReactNode;
	value: TValue;
	onChange: (value: TValue) => void;
} & Omit<
	Headless.ListboxProps<typeof Fragment, TValue>,
	"as" | "multiple" | "value" | "onChange"
>) {
	return (
		<Headless.Listbox
			{...props}
			value={value}
			onChange={onChange}
			multiple={false}
		>
			<Headless.ListboxButton
				autoFocus={autoFocus}
				aria-label={ariaLabel}
				className={clsx(
					className,
					"relative block w-full rounded-md border bg-white py-2 pl-3 pr-10 text-left text-sm",
					"border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800",
					"focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
					"data-disabled:cursor-not-allowed data-disabled:opacity-75 data-disabled:bg-zinc-100 dark:data-disabled:bg-zinc-700/50",
				)}
			>
				<Headless.ListboxSelectedOption
					as="span"
					options={options}
					placeholder={
						placeholder && (
							<span className="block truncate text-zinc-400 dark:text-zinc-500">
								{placeholder}
							</span>
						)
					}
					className="block truncate text-zinc-900 dark:text-white"
				/>
				<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
					<ChevronUpDownIcon />
				</span>
			</Headless.ListboxButton>
			<Headless.ListboxOptions
				transition
				anchor="bottom start"
				className={clsx(
					"isolate z-10 mt-1 w-full min-w-(--button-width) overflow-auto rounded-md bg-white p-1 shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-zinc-800 dark:ring-white/10",
					"transition ease-out duration-100 data-closed:transform data-closed:opacity-0 data-closed:scale-95",
					"data-enter:transform data-enter:opacity-100 data-enter:scale-100",
				)}
			>
				{options}
			</Headless.ListboxOptions>
		</Headless.Listbox>
	);
}
export function ListboxOption<TValue>({
	children,
	className,
	value,
	...props
}: {
	className?: string;
	children?: React.ReactNode;
	value: TValue;
} & Omit<
	Headless.ListboxOptionProps<"div", TValue>,
	"as" | "className" | "value"
>) {
	return (
		<Headless.ListboxOption as={Fragment} value={value} {...props}>
			{({ selected, active }) => (
				<div
					className={clsx(
						className,
						"group/option relative flex cursor-default select-none items-center gap-x-2 rounded-md py-1.5 px-2.5 text-sm",
						active
							? "bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-dark"
							: "text-zinc-700 dark:text-zinc-200",
						selected ? "font-semibold" : "font-normal",
						"data-disabled:opacity-50 data-disabled:cursor-not-allowed",
					)}
				>
					{selected && <CheckIcon />}
					<span className={clsx("flex-1 truncate", selected ? "pl-1" : "pl-5")}>
						{children}
					</span>
				</div>
			)}
		</Headless.ListboxOption>
	);
}
export function ListboxLabel({
	className,
	...props
}: React.ComponentPropsWithoutRef<"span">) {
	return <span {...props} className={clsx(className, "truncate")} />;
}
export function ListboxDescription({
	className,
	children,
	...props
}: React.ComponentPropsWithoutRef<"span">) {
	return (
		<span
			{...props}
			className={clsx(
				className,
				"text-xs text-zinc-500 group-data-focus/option:text-primary-100 dark:text-zinc-400 dark:group-data-focus/option:text-primary-dark-100",
			)}
		>
			{children}
		</span>
	);
}
