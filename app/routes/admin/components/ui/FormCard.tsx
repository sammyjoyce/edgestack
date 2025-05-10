import clsx from "clsx";
import type React from "react";

type FormCardProps<T extends React.ElementType = "div"> = {
	as?: T;
	className?: string;
	children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function FormCard<T extends React.ElementType = "div">({
	as,
	className,
	children,
	...props
}: FormCardProps<T>) {
	const Component = as || "div";
	return (
		<Component
			className={clsx(
				"rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 p-8 w-full max-w-md mx-auto",
				className,
			)}
			{...props}
		>
			{children}
		</Component>
	);
}
