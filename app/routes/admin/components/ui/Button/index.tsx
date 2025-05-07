import clsx from "clsx";
import type {
	ComponentPropsWithoutRef,
	ElementType,
	ForwardedRef,
} from "react";
import React, { forwardRef } from "react"; // Import React
import { Link, type To } from "react-router";
import { twMerge } from "tailwind-merge";

/* ---------- helper ---------- */
function cn(...classes: Array<string | undefined>) {
	return twMerge(clsx(classes));
}

/* ---------- polymorphic types ---------- */
type AsProp<C extends ElementType> = { as?: C };

type ButtonOwnProps = {
	invert?: boolean;
	to?: To;
	href?: string;
} & React.ComponentPropsWithoutRef<"button">;

type PolymorphicButton<C extends ElementType> = AsProp<C> &
	Omit<ComponentPropsWithoutRef<C>, keyof ButtonOwnProps | "as" | "ref"> &
	ButtonOwnProps;

/* ---------- component ---------- */
const Button = forwardRef(
	<C extends ElementType = "button">(
		{
			as,
			to,
			href,
			invert = false,
			className,
			children,
			...rest
		}: PolymorphicButton<C>,
		ref: ForwardedRef<HTMLElement>,
	) => {
		/* --- styling ------------------------------------------------------ */
		const base =
			"inline-flex rounded-full px-4 py-1.5 text-sm font-semibold " +
			"transition-shadow duration-300 ease-in-out";
		const light =
			"bg-gray-100 text-gray-800 shadow-[var(--shadow-openai)] active:shadow-[var(--shadow-openai-active)]";
		const dark =
			"bg-gray-900 text-white shadow-[var(--shadow-openai)] active:shadow-[var(--shadow-openai-active)]";

		const classes = cn(base, invert ? dark : light, className);

		/* --- content wrapper --------------------------------------------- */
		const inner = <span className="relative top-px">{children}</span>;

		/* --- router link -------------------------------------------------- */
		if (to !== undefined) {
			return (
				<Link
					ref={ref as ForwardedRef<HTMLAnchorElement>}
					to={to}
					className={classes}
					{...rest}
				>
					{inner}
				</Link>
			);
		}

		/* --- raw anchor --------------------------------------------------- */
		if (href !== undefined) {
			return (
				<a
					ref={ref as ForwardedRef<HTMLAnchorElement>}
					href={href}
					className={classes}
					{...rest}
				>
					{inner}
				</a>
			);
		}

		/* --- custom component -------------------------------------------- */
		if (as) {
			const Component = as as ElementType;
			return (
				<Component ref={ref} className={classes} {...rest}>
					{inner}
				</Component>
			);
		}

		/* --- fallback: native button ------------------------------------- */
		return (
			<button
				ref={ref as ForwardedRef<HTMLButtonElement>}
				className={classes}
				{...rest}
			>
				{inner}
			</button>
		);
	},
);

export { Button };
