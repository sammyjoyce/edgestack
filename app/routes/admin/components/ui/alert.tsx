import clsx from "clsx";
import type React from "react";
import { Text } from "./text";

const icons = {
	info: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			className="size-5"
		>
			<path
				fillRule="evenodd"
				d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
				clipRule="evenodd"
			/>
		</svg>
	),
	success: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			className="size-5"
		>
			<path
				fillRule="evenodd"
				d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
				clipRule="evenodd"
			/>
		</svg>
	),
	warning: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			className="size-5"
		>
			<path
				fillRule="evenodd"
				d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75H10Z"
				clipRule="evenodd"
			/>
		</svg>
	),
	error: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			className="size-5"
		>
			<path
				fillRule="evenodd"
				d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
				clipRule="evenodd"
			/>
		</svg>
	),
};
const alertStyles = {
	base: "flex items-start p-4 rounded-md border",
	variants: {
		info: {
			container: "bg-admin-info border-admin-info",
			icon: "text-admin-info",
			title: "text-admin-info",
			description: "text-admin-info",
		},
		success: {
			container: "bg-green-50 border-green-300",
			icon: "text-green-500",
			title: "text-green-800",
			description: "text-green-700",
		},
		warning: {
			container: "bg-yellow-50 border-yellow-300",
			icon: "text-yellow-500",
			title: "text-yellow-800",
			description: "text-yellow-700",
		},
		error: {
			container: "bg-red-50 border-red-300",
			icon: "text-red-500",
			title: "text-red-800",
			description: "text-red-700",
		},
	},
};
export type AlertVariant = keyof typeof alertStyles.variants;

export interface AlertProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
	variant?: AlertVariant;
	title?: React.ReactNode;
	children: React.ReactNode;
	showIcon?: boolean;
}

export function Alert({
	variant = "info",
	title,
	children,
	className,
	showIcon = true,
	...props
}: AlertProps) {
	const variantStyles = alertStyles.variants[variant];
	return (
		<div
			role="alert"
			className={clsx(alertStyles.base, variantStyles.container, className)}
			{...props}
		>
			{showIcon && icons[variant] && (
				<div className={clsx("shrink-0 mr-3", variantStyles.icon)}>
					{icons[variant]}
				</div>
			)}
			<div className="grow">
				{title && (
					<AlertTitle className={variantStyles.title}>{title}</AlertTitle>
				)}
				<AlertDescription className={variantStyles.description}>
					{children}
				</AlertDescription>
			</div>
		</div>
	);
}

export function AlertTitle({
	className,
	...props
}: { className?: string } & React.HTMLAttributes<HTMLHeadingElement>) {
	return <h5 {...props} className={clsx(className, "font-medium")} />;
}

export function AlertDescription({
	className,
	...props
}: { className?: string } & React.HTMLAttributes<HTMLDivElement>) {
	return <Text {...props} className={clsx(className, "text-sm")} />;
}
