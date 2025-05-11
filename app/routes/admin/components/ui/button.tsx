import * as Headless from "@headlessui/react";
import clsx from "clsx";
import type React from "react";
import { forwardRef } from "react";
import { Link as RouterLink } from "react-router"; // Changed import name

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

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
	{
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
		...props
	}: ButtonProps,
	ref,
) {
	const sizeMap: Record<string, string> = {
		xs: "px-2 py-1 text-xs",
		sm: "px-2.5 py-1.5 text-sm", // Adjusted padding for sm
		md: "px-3 py-2 text-sm",    // Adjusted padding for md
		lg: "px-4 py-2.5 text-base",
	};

	// ─── Tailwind‑based styling ────────────────────────────────────────────────
	const baseClasses =
		"group flex items-center justify-center gap-2 flex-wrap rounded-md font-medium transition-[box-shadow,background-color,color] duration-200 ease-in-out select-none";

	const sizeClass = size ? sizeMap[size] : sizeMap.md;

	const solidColorMap: Record<ButtonColor, string> = {
		primary:
			"text-[var(--admin-color-white)] bg-[var(--admin-color-primary)] shadow-[var(--admin-shadow-button-primary)] active:shadow-[var(--admin-shadow-button-primary-active)]",
		secondary:
			"text-[var(--admin-color-white)] bg-[var(--admin-color-secondary)] shadow-[inset_1px_1px_1px_#ffffffb3,inset_-1px_-1px_1px_#0000003b,0.444584px_0.444584px_0.628737px_-0.75px_#00000042,1.21072px_1.21072px_1.71222px_-1.5px_#0000003f,-0.5px_-0.5px_0_0_#000000af] active:shadow-[inset_0.5px_0.5px_1px_#ffffffb3,inset_-0.5px_-0.5px_1px_#0000005b,0.222px_0.222px_0.314px_-1px_#0003,-0.5px_-0.5px_0_0_#000000ac]",
		tertiary:
			"text-[var(--admin-color-white)] bg-[var(--admin-color-tertiary)] shadow-[inset_1px_1px_1px_#ffffffba,inset_-1px_-1px_1px_#0000003b,0.444584px_0.444584px_0.628737px_-1px_#00000042,-0.5px_-0.5px_0_0_#0000006b] active:shadow-[inset_0.5px_0.5px_1px_#ffffffba,inset_-0.5px_-0.5px_1px_#0000005b,0.222px_0.222px_0.314px_-1px_#0003,-0.5px_-0.5px_0_0_#0000007b]",
		neutral:
			"text-[var(--admin-color-white)] bg-[var(--admin-color-neutral)] shadow-[inset_1px_1px_1px_#ffffffc2,inset_-1px_-1px_1px_#0000003b,0.444584px_0.444584px_0.628737px_-1px_#00000042,-0.5px_-0.5px_0_0_#00000012] active:shadow-[inset_0.5px_0.5px_1px_#fff,inset_-0.5px_-0.5px_1px_#0000005b,0.222px_0.222px_0.314px_-1px_#0003,-0.5px_-0.5px_0_0_#00000022]",
		danger:
			"text-[var(--admin-color-white)] bg-[var(--admin-color-error)] shadow-[var(--admin-shadow-button-primary)] hover:brightness-90 active:shadow-[var(--admin-shadow-button-primary-active)] active:brightness-80",
		default:
			"text-[var(--admin-color-foreground)] bg-[var(--admin-color-default-button-bg)] shadow-[var(--admin-shadow-button-default)] active:shadow-[var(--admin-shadow-button-default-active)]",
	};

	const ghostClasses =
		"bg-transparent shadow-none text-[var(--admin-color-foreground)] hover:bg-black/5 dark:hover:bg-white/8";

	const outlineBase =
		"bg-transparent border border-[var(--admin-color-border)] text-[var(--admin-color-foreground)] shadow-none hover:bg-black/3 dark:hover:bg-white/5 hover:border-[var(--admin-color-foreground)]";

	const outlineSelected =
		"bg-[var(--admin-color-primary)] text-[var(--admin-color-white)] border-[var(--admin-color-primary)]";

	const variantClasses =
		variant === "ghost"
			? ghostClasses
			: variant === "outline"
			? clsx(outlineBase, selected && outlineSelected)
			: solidColorMap[color ?? "default"];

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
		"data-color": variant === "solid" ? color : undefined, // Apply color attribute only for solid variant
		"data-variant": variant !== "solid" ? variant : undefined, // Apply variant attribute for ghost/outline
		onClick: disabled ? undefined : onClick,
		...props, // Pass through other props like aria-label
	};

	const ComponentToRender = as ?? (to ? RouterLink : href ? "a" : Headless.Button);

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


	return (
		<ComponentToRender {...finalProps}>
			{children}
		</ComponentToRender>
	);
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

export const ButtonLED = () => {
	return (
		<span className="block w-[7px] h-[7px] rounded-full bg-black/10 shadow-[inset_1px_1px_2px_#0000001c,0_1px_0_0_#ffffff30] transition-colors group-data-[selected=true]:bg-[var(--admin-color-primary)]" />
	);
};
