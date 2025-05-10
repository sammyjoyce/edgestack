import * as Headless from "@headlessui/react";
import clsx from "clsx";
import type React from "react";
import { Text } from "./text";

const sizes = {
	xs: "sm:max-w-xs",
	sm: "sm:max-w-sm",
	md: "sm:max-w-md",
	lg: "sm:max-w-lg",
	xl: "sm:max-w-xl",
	"2xl": "sm:max-w-2xl",
	"3xl": "sm:max-w-3xl",
	"4xl": "sm:max-w-4xl",
	"5xl": "sm:max-w-5xl",
};

export function Dialog({
	size = "lg",
	className,
	children,
	onClose, // Ensure onClose is passed to Headless.Dialog
	...props
}: {
	size?: keyof typeof sizes;
	className?: string;
	children: React.ReactNode;
	onClose: () => void;
} & Omit<
	Headless.DialogProps,
	"as" | "className" | "onClose" // Exclude onClose from Omit as it's explicitly typed
>) {
	return (
		<Headless.Dialog {...props} onClose={onClose}>
			<Headless.DialogBackdrop
				transition
				className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-out data-[closed]:opacity-0"
			/>

			<div className="fixed inset-0 w-screen overflow-y-auto p-4 flex items-center justify-center">
				{/* Removed nested div structure for simpler centering */}
				<Headless.DialogPanel
					transition
					className={clsx(
						className,
						sizes[size],
						"w-full min-w-0 rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-800 dark:ring-1 dark:ring-white/10",
						"transition-all duration-300 ease-out data-[closed]:opacity-0 data-[closed]:scale-95 data-[enter]:opacity-100 data-[enter]:scale-100",
					)}
				>
					{children}
				</Headless.DialogPanel>
			</div>
		</Headless.Dialog>
	);
}

export function DialogTitle({
	className,
	...props
}: { className?: string } & Omit<
	Headless.DialogTitleProps,
	"as" | "className"
>) {
	return (
		<Headless.DialogTitle
			{...props}
			className={clsx(
				className,
				"text-xl font-semibold text-zinc-900 dark:text-white",
			)}
		/>
	);
}

export function DialogDescription({
	className,
	...props
}: { className?: string } & Omit<
	Headless.DescriptionProps<typeof Text>,
	"as" | "className"
>) {
	// Using Text component for consistency if it's styled appropriately, otherwise a simple p or div
	return (
		<Headless.Description
			as={Text}
			{...props}
			className={clsx(className, "mt-2 text-zinc-600 dark:text-zinc-400")}
		/>
	);
}

export function DialogBody({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	return <div {...props} className={clsx(className, "mt-4 space-y-4")} />;
}

export function DialogActions({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	return (
		<div
			{...props}
			className={clsx(
				className,
				"mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end",
			)}
		/>
	);
}
