import * as Headless from "@headlessui/react";
import clsx from "clsx";
import React, { forwardRef } from "react";
import { TouchTarget } from "./button";
import { Link } from "./link";
type AvatarProps = {
	src?: string | null;
	square?: boolean;
	initials?: string;
	alt?: string;
	className?: string;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
};
const avatarSizes = {
	xs: "size-6 text-xs",
	sm: "size-8 text-sm",
	md: "size-10 text-base",
	lg: "size-12 text-lg",
	xl: "size-14 text-xl",
};
export function Avatar({
	src = null,
	square = false,
	initials,
	alt = "",
	className,
	size = "md",
	...props
}: AvatarProps & React.ComponentPropsWithoutRef<"span">) {
	const sizeClasses = avatarSizes[size] || avatarSizes.md;
	return (
		<span
			data-slot="avatar"
			{...props}
			className={clsx(
				className,
				"inline-grid shrink-0 align-middle relative group",
				sizeClasses,
				square ? "rounded-md" : "rounded-full",
				"ring-1 ring-inset ring-black/10 dark:ring-white/10",
			)}
		>
			{initials && (
				<svg
					className={clsx(
						"absolute inset-0 size-full fill-current select-none",
						square ? "rounded-md" : "rounded-full",
						"bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200",
					)}
					viewBox="0 0 100 100"
					aria-hidden={alt ? undefined : "true"}
				>
					{alt && <title>{alt}</title>}
					<text
						x="50%"
						y="50%"
						alignmentBaseline="middle"
						dominantBaseline="middle"
						textAnchor="middle"
						dy=".125em"
						className="font-medium uppercase"
					>
						{initials}
					</text>
				</svg>
			)}
			{src && (
				<img
					className={clsx(
						"size-full object-cover",
						square ? "rounded-md" : "rounded-full",
					)}
					src={src}
					alt={alt}
				/>
			)}
		</span>
	);
}
export const AvatarButton = forwardRef(function AvatarButton(
	{
		src,
		square = false,
		initials,
		alt,
		className,
		size = "md",
		...props
	}: AvatarProps &
		(
			| Omit<Headless.ButtonProps, "as" | "className">
			| Omit<React.ComponentPropsWithoutRef<typeof Link>, "className">
		),
	ref: React.ForwardedRef<HTMLElement>,
) {
	const sizeClasses = avatarSizes[size] || avatarSizes.md;
	const classes = clsx(
		className,
		sizeClasses,
		square ? "rounded-md" : "rounded-full",
		"relative inline-flex items-center justify-center",
		"focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary dark:focus:ring-primary-dark",
	);
	const avatarContent = (
		<Avatar
			src={src}
			square={square}
			initials={initials}
			alt={alt}
			size={size}
		/>
	);
	return "href" in props ? (
		<Link
			{...props}
			className={classes}
			ref={ref as React.ForwardedRef<HTMLAnchorElement>}
		>
			<TouchTarget>{avatarContent}</TouchTarget>
		</Link>
	) : (
		<Headless.Button {...props} className={classes} ref={ref}>
			<TouchTarget>{avatarContent}</TouchTarget>
		</Headless.Button>
	);
});
