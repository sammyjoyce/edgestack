import * as Headless from "@headlessui/react";
import clsx from "clsx";
import type React from "react";
import { forwardRef } from "react";
import { Link as RouterLink } from "react-router";

// Define the color prop based on openai-fm's approach + admin additions
type ButtonColor =
	| "primary"
	| "secondary"
	| "tertiary"
	| "neutral"
	| "default"
	| "danger";

// Define variant prop for ghost/outline, which don't have complex shadows like the colored buttons
type ButtonVariant = "ghost" | "outline" | "solid"; // 'solid' can be the default for colored buttons

export interface ButtonProps {
	children: React.ReactNode;
	className?: string;
	variant?: ButtonVariant; // For flat/outline styles
	color?: ButtonColor; // For openai-fm like colored buttons with shadows
	as?: React.ElementType;
	size?: "xs" | "sm" | "md" | "lg"; // Keep existing sizes
	type?: "button" | "submit" | "reset";
	selected?: boolean;
	disabled?: boolean;
	block?: boolean;
	onClick?: (evt: React.MouseEvent<HTMLElement>) => void;
	href?: string; // For standard anchor tags
	to?: string; // For react-router Link
	target?: "_blank";
	"aria-label"?: string;

	// Allow any other props to be passed through
	[key: string]: any;
}

export const Button = forwardRef<HTMLElement, ButtonProps>((props, ref) => {
	const {
		as,
		variant = "solid", // Default to solid, which will use color prop for styling
		color = "default", // Default color if variant is solid
		size, // Keep admin's size prop
		className,
		children,
		selected = false,
		block = false,
		type = "button", // Default type for button elements
		href,
		to,
		onClick,
		disabled,
		...rest
	} = props;

	const sizeMap: Record<string, string> = {
		xs: "px-2 py-1 text-xs",
		sm: "px-2.5 py-1.5 text-sm", // Adjusted padding for sm
		md: "px-3 py-2 text-sm", // Adjusted padding for md
		lg: "px-4 py-2.5 text-base",
	};

	// ─── Tailwind‑based styling ────────────────────────────────────────────────
	const baseClasses =
		"group flex items-center justify-center gap-2 flex-wrap rounded-md font-medium transition-[box-shadow,background-color,color] duration-200 ease-in-out select-none";

	const sizeClass = size ? sizeMap[size] : sizeMap.md;

	const solidColorMap: Record<ButtonColor, string> = {
		primary:
			"text-admin-white bg-admin-primary shadow-admin-button-primary active:shadow-admin-button-primary-active",
		secondary:
			"text-admin-white bg-admin-secondary shadow-admin-button-secondary active:shadow-admin-button-secondary-active",
		tertiary:
			"text-admin-white bg-admin-tertiary shadow-admin-button-tertiary active:shadow-admin-button-tertiary-active",
		neutral:
			"text-admin-white bg-admin-neutral shadow-admin-button-neutral active:shadow-admin-button-neutral-active",
		danger:
			"text-admin-white bg-admin-error shadow-admin-button-error active:shadow-admin-button-error-active",
		default:
			"text-admin-foreground bg-admin-default-button-bg shadow-admin-button-default active:shadow-admin-button-default-active",
	};

	const ghostClasses =
		"bg-transparent shadow-none text-admin-foreground hover:bg-black/5 dark:hover:bg-white/8";

	const outlineBase =
		"bg-transparent border border-admin-border text-admin-foreground shadow-none hover:bg-black/3 dark:hover:bg-white/5 hover:border-admin-foreground";

	const outlineSelected =
		"bg-admin-primary text-admin-white border-admin-primary";

	const variantClasses =
		variant === "ghost"
			? ghostClasses
			: variant === "outline"
				? clsx(outlineBase, selected && outlineSelected)
				: solidColorMap[(color ?? "default") as ButtonColor];

	const stateClasses = clsx(
		block && "w-full",
		disabled && "opacity-60 cursor-not-allowed",
	);

	const effectiveClassName = clsx(
		baseClasses,
		sizeClass,
		variantClasses,
		stateClasses,
		className,
	);

	const commonProps = {
		ref,
		className: effectiveClassName,
		"data-selected": selected ? "true" : undefined,
		"data-disabled": disabled ? "true" : undefined,
		"data-block": block ? "true" : undefined,
		"data-color": variant === "solid" ? color : undefined,
		"data-variant": variant !== "solid" ? variant : undefined,
		onClick: disabled ? undefined : onClick,
		...rest,
	};

	const ComponentToRender =
		as ?? (to ? RouterLink : href ? "a" : Headless.Button);

	const finalProps: any = { ...commonProps };

	if (ComponentToRender === Headless.Button) {
		finalProps.type = type;
		delete finalProps.to;
		delete finalProps.href;
	} else if (ComponentToRender === RouterLink) {
		finalProps.to = to;
		delete finalProps.href;
		delete finalProps.type;
	} else if (ComponentToRender === "a") {
		finalProps.href = href;
		delete finalProps.to;
		delete finalProps.type;
	}

	return <ComponentToRender {...finalProps}>{children}</ComponentToRender>;
});

export function TouchTarget({ children }: { children: React.ReactNode }) {
	return (
		<>
			<span
				className="absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 pointer-fine:hidden"
				aria-hidden="true"
			/>
			{children}
		</>
	);
}

interface ButtonLEDProps {
	isActive?: boolean;
}

export const ButtonLED = ({ isActive }: ButtonLEDProps) => {
	return (
		<span
			className={`block w-[7px] h-[7px] rounded-full shadow-admin-led transition-colors ${isActive ? "bg-admin-primary" : "bg-black/10"}`}
		/>
	);
};
