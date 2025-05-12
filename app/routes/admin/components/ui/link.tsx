import * as Headless from "@headlessui/react";
import clsx from "clsx";
import type React from "react";
import { forwardRef } from "react";
import type { LinkProps as RouterLinkProps } from "react-router";
import { Link as RouterLink } from "react-router";

export const Link = forwardRef(function Link(
	props: { to: RouterLinkProps["to"]; className?: string } & Omit<
		React.ComponentPropsWithoutRef<typeof RouterLink>,
		"to"
	>,
	ref: React.ForwardedRef<HTMLAnchorElement>,
) {
	return (
		<Headless.DataInteractive>
			<RouterLink
				{...props}
				ref={ref}
				className={clsx(
					props.className,
					"text-primary",
					"hover:underline hover:text-primary/80",
					"focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary",
				)}
			/>
		</Headless.DataInteractive>
	);
});
