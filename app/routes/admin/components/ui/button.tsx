import * as Headless from "@headlessui/react";
import clsx from "clsx";
import type React from "react";
import { forwardRef } from "react";
import { Link } from "./link"; // Assuming Link component is styled similarly or not a priority for this task

// Simplified styles based on openai-fm Button.module.css and globals.css
const styles = {
	base: [
		// Base styles from openai-fm .Button
		"relative isolate inline-flex items-center justify-center gap-2 rounded-md p-3 font-semibold",
		"transition-shadow duration-300 ease-in-out cursor-pointer select-none",
		// Focus (keeping existing focus, can be refined if needed)
		"focus:not-data-focus:outline-hidden data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-blue-500",
		// Disabled
		"data-disabled:opacity-50 data-disabled:cursor-not-allowed",
		// Icon styles (simplified, assuming direct SVG usage or a separate Icon component)
		"*:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0",
	],
	// Color variants will now primarily use Tailwind utility classes for direct styling
	// instead of complex CSS variable overrides for pseudo-elements.
	// The box-shadows are complex and would ideally be part of a theme or utility classes.
	// For now, we'll use simpler shadows or rely on direct Tailwind shadow classes.
	color: {
		ghost: [
			"bg-transparent text-foreground shadow-none",
			"hover:bg-zinc-100 dark:hover:bg-zinc-800",
		],
		outline: [
			"bg-transparent text-foreground border border-foreground shadow-none",
			"hover:bg-foreground hover:text-white",
		],
		primary: [
			"text-white bg-primary",
			"shadow-[inset_1px_1px_1px_#ffffffd4,inset_-1px_-1px_1px_#0000003b,0.44px_0.44px_0.62px_-1px_#00000042,1.21px_1.21px_1.71px_-1.5px_#0000003f,2.65px_2.65px_3.75px_-2.25px_#0000003b,5.9px_5.9px_8.34px_-3px_#00000031,10px_10px_21.21px_-3.75px_#0000003b,-0.5px_-0.5px_0_0_#952b0087]",
			"data-active:shadow-[inset_0.5px_0.5px_1px_#fff,inset_-0.5px_-0.5px_1px_#0000005b,0.22px_0.22px_0.31px_-1px_#0003,0.6px_0.6px_0.85px_-1px_#0000002e,1.32px_1.32px_1.88px_-1.5px_#00000040,2.95px_2.95px_4.17px_-2px_#0000001a,2.5px_2.5px_3px_-2.5px_#00000026,-0.5px_-0.5px_0_0_#00000022]",
			"data-selected:shadow-[inset_0.5px_0.5px_1px_#fff,inset_-0.5px_-0.5px_1px_#0000005b,0.22px_0.22px_0.31px_-1px_#0003,0.6px_0.6px_0.85px_-1px_#0000002e,1.32px_1.32px_1.88px_-1.5px_#00000040,2.95px_2.95px_4.17px_-2px_#0000001a,2.5px_2.5px_3px_-2.5px_#00000026,-0.5px_-0.5px_0_0_#00000022]",
		],
		secondary: [
			"text-white bg-foreground", // Assuming foreground is #222
			"shadow-[inset_1px_1px_1px_#ffffffb3,inset_-1px_-1px_1px_#0000003b,0.44px_0.44px_0.62px_-0.75px_#00000042,1.21px_1.21px_1.71px_-1.5px_#0000003f,2.65px_2.65px_3.75px_-2.25px_#0000003b,5.9px_5.9px_8.34px_-3px_#00000031,14px_14px_21.21px_-3.75px_#00000033,-0.5px_-0.5px_0_0_#000000af]",
			"data-active:shadow-[inset_0.5px_0.5px_1px_#ffffffb3,inset_-0.5px_-0.5px_1px_#0000005b,0.22px_0.22px_0.31px_-1px_#0003,0.6px_0.6px_0.85px_-1px_#0000002e,1.32px_1.32px_1.88px_-1.5px_#00000040,2.95px_2.95px_4.17px_-2px_#0000001a,4px_4px_3px_-2.5px_#00000026,-0.5px_-0.5px_0_0_#000000ac]",
			"data-selected:shadow-[inset_0.5px_0.5px_1px_#ffffffb3,inset_-0.5px_-0.5px_1px_#0000005b,0.22px_0.22px_0.31px_-1px_#0003,0.6px_0.6px_0.85px_-1px_#0000002e,1.32px_1.32px_1.88px_-1.5px_#00000040,2.95px_2.95px_4.17px_-2px_#0000001a,4px_4px_3px_-2.5px_#00000026,-0.5px_-0.5px_0_0_#000000ac]",
		],
		tertiary: [
			"text-white bg-[#6a6a6a]",
			"shadow-[inset_1px_1px_1px_#ffffffba,inset_-1px_-1px_1px_#0000003b,0.44px_0.44px_0.62px_-1px_#00000042,1.21px_1.21px_1.71px_-1.5px_#0000003f,2.65px_2.65px_3.75px_-2.25px_#0000003b,5.9px_5.9px_8.34px_-3px_#0000004f,12px_12px_21.21px_-3.75px_#0000001a,-0.5px_-0.5px_0_0_#0000006b]",
			"data-active:shadow-[inset_0.5px_0.5px_1px_#ffffffba,inset_-0.5px_-0.5px_1px_#0000005b,0.22px_0.22px_0.31px_-1px_#0003,0.6px_0.6px_0.85px_-1px_#0000002e,1.32px_1.32px_1.88px_-1.5px_#00000040,2.95px_2.95px_4.17px_-2px_#0000001a,4px_4px_3px_-2.5px_#00000026,-0.5px_-0.5px_0_0_#0000007b]",
			"data-selected:shadow-[inset_0.5px_0.5px_1px_#ffffffba,inset_-0.5px_-0.5px_1px_#0000005b,0.22px_0.22px_0.31px_-1px_#0003,0.6px_0.6px_0.85px_-1px_#0000002e,1.32px_1.32px_1.88px_-1.5px_#00000040,2.95px_2.95px_4.17px_-2px_#0000001a,4px_4px_3px_-2.5px_#00000026,-0.5px_-0.5px_0_0_#0000007b]",
		],
		neutral: [
			"text-white bg-[#aaa]",
			"shadow-[inset_1px_1px_1px_#ffffffc2,inset_-1px_-1px_1px_#0000003b,0.44px_0.44px_0.62px_-1px_#00000042,1.21px_1.21px_1.71px_-1.5px_#0000003f,2.65px_2.65px_3.75px_-2.25px_#0000003b,5.9px_5.9px_8.34px_-3px_#00000031,10px_10px_21.21px_-3.75px_#0000000e,-0.5px_-0.5px_0_0_#00000012]",
			"data-active:shadow-[inset_0.5px_0.5px_1px_#fff,inset_-0.5px_-0.5px_1px_#0000005b,0.22px_0.22px_0.31px_-1px_#0003,0.6px_0.6px_0.85px_-1px_#0000002e,1.32px_1.32px_1.88px_-1.5px_#00000040,2.95px_2.95px_4.17px_-2px_#0000001a,2.5px_2.5px_3px_-2.5px_#00000026,-0.5px_-0.5px_0_0_#00000022]",
			"data-selected:shadow-[inset_0.5px_0.5px_1px_#fff,inset_-0.5px_-0.5px_1px_#0000005b,0.22px_0.22px_0.31px_-1px_#0003,0.6px_0.6px_0.85px_-1px_#0000002e,1.32px_1.32px_1.88px_-1.5px_#00000040,2.95px_2.95px_4.17px_-2px_#0000001a,2.5px_2.5px_3px_-2.5px_#00000026,-0.5px_-0.5px_0_0_#00000022]",
		],
		default: [
			// Corresponds to the default .Button style in openai-fm
			"bg-[#f4f4f4] text-foreground", // Assuming foreground is #222
			"shadow-[rgb(255,255,255)_1px_1px_1px_0px_inset,rgba(0,0,0,0.15)_-1px_-1px_1px_0px_inset,rgba(0,0,0,0.26)_0.44px_0.44px_0.62px_-1px,rgba(0,0,0,0.247)_1.21px_1.21px_1.71px_-1.5px,rgba(0,0,0,0.23)_2.65px_2.65px_3.75px_-2.25px,rgba(0,0,0,0.192)_5.9px_5.9px_8.34px_-3px,rgba(0,0,0,0.056)_10px_10px_21.21px_-3.75px,-0.5px_-0.5px_0_0_rgb(0_0_0/5%)]",
			"data-active:shadow-[inset_0.5px_0.5px_1px_#fff,inset_-0.5px_-0.5px_1px_#00000026,0.22px_0.22px_0.31px_-0.5px_#0003,0.6px_0.6px_0.85px_-1px_#0000002e,1.32px_1.32px_1.88px_-1.5px_#00000040,2.95px_2.95px_4.17px_-2px_#0000001a,2.5px_2.5px_3px_-2.5px_#00000026,-0.5px_-0.5px_0_0_rgb(0_0_0/10%)]",
			"data-selected:shadow-[inset_0.5px_0.5px_1px_#fff,inset_-0.5px_-0.5px_1px_#00000026,0.22px_0.22px_0.31px_-0.5px_#0003,0.6px_0.6px_0.85px_-1px_#0000002e,1.32px_1.32px_1.88px_-1.5px_#00000040,2.95px_2.95px_4.17px_-2px_#0000001a,2.5px_2.5px_3px_-2.5px_#00000026,-0.5px_-0.5px_0_0_rgb(0_0_0/10%)]",
		],
		danger: ["text-white bg-red-600", "hover:bg-red-700"],
	},
	// outline and plain variants are removed for simplicity to match openai-fm's Button structure
	// which primarily uses a 'color' prop with predefined values.
};

export interface ButtonProps {
	children: React.ReactNode;
	className?: string;
	/** new variants for outline/ghost calls */
	variant?: keyof typeof styles.color | "ghost" | "outline";
	/** alias */
	color?: keyof typeof styles.color;
	/** you were sprinkling `as={…}` in dozens of places */
	as?: React.ElementType;
	/** many files pass `invert` today */
	invert?: boolean;
	/** some calls pass `size="sm"` etc */
	size?: "xs" | "sm" | "md" | "lg";
	type?: "button" | "submit" | "reset";
	selected?: boolean;
	disabled?: boolean;
	block?: boolean;
	onClick?: (evt: React.MouseEvent<HTMLElement>) => void;
	href?: string;
	target?: "_blank";
	"aria-label"?: string;
}

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
	{
		as,
		variant,
		color,
		invert,
		size,
		className,
		children,
		selected,
		block,
		type = "button",
		href,
		target,
		onClick,
		...props
	}: ButtonProps,
	ref,
) {
	// figure out which color‐style to use (including our new ghost/outline)
	const key = variant ?? color ?? "default";
	const colorClasses =
		styles.color[key as keyof typeof styles.color] || styles.color.default;

	// optional size helper
	const sizeMap: Record<string, string> = {
		xs: "px-2 py-1 text-xs",
		sm: "px-2.5 py-1 text-sm",
		md: "px-3 py-2 text-base",
		lg: "px-4 py-2.5 text-base",
	};

	const classes = clsx(
		className,
		styles.base,
		colorClasses,
		size ? sizeMap[size] : null,
		invert && "invert",
		block ? "w-full" : "inline-flex",
		selected && "data-selected",
	);

	const commonProps = {
		ref,
		className: classes,
		"data-selected": selected ? "" : undefined,
		"data-disabled": props.disabled ? "" : undefined,
		"aria-label": props["aria-label"],
		onClick: props.disabled ? undefined : onClick,
	};

	// Pick element: explicit `as`, then `href`→<Link>, otherwise headless Button
	const Component = as ?? (href ? Link : Headless.Button);

	return (
		<Component
			{...commonProps}
			{...props}
			href={href}
			target={target}
			type={Component === Headless.Button ? type : undefined}
		>
			{children}
		</Component>
	);
});

// TouchTarget can be kept if needed, or removed if not part of openai-fm style
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

// LED component can be added if it's used from openai-fm's Button.module.css
export const ButtonLED = () => {
	return (
		<span className="block w-[7px] h-[7px] rounded-full bg-black-10 shadow-[inset_1px_1px_2px_#0000001c,0_1px_0_0px_#ffffff30] transition-colors group-data-selected:bg-primary" />
	);
};
