import clsx from "clsx";
import type React from "react";
import { Border } from "~/routes/common/components/ui/Border";
import { FadeIn, FadeInStagger } from "~/routes/common/components/ui/FadeIn";

export function List({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<FadeInStagger>
			<ul className={clsx("text-base text-neutral-600", className)}>
				{children}
			</ul>
		</FadeInStagger>
	);
}

export function ListItem({
	children,
	title,
}: {
	children: React.ReactNode;
	title?: string;
}) {
	return (
		<li className="group mt-10 first:mt-0">
			<FadeIn>
				<Border className="pt-10 group-first:pt-0 group-first:before:hidden group-first:after:hidden">
					{title && (
						<strong className="font-semibold text-neutral-950">{`${title}. `}</strong>
					)}
					{children}
				</Border>
			</FadeIn>
		</li>
	);
}
