import clsx from "clsx"; // Use direct import
import type React from "react"; // Import React

import { Container } from "~/routes/common/components/ui/Container"; // Corrected path
import { FadeIn } from "~/routes/common/components/ui/FadeIn"; // Corrected path

export function SectionIntro({
	title,
	eyebrow,
	children,
	smaller = false,
	invert = false,
	centered = false,
	...props
}: Omit<
	React.ComponentPropsWithoutRef<typeof Container>,
	"title" | "children"
> & {
	title: string;
	eyebrow?: string;
	children?: React.ReactNode;
	smaller?: boolean;
	invert?: boolean;
	centered?: boolean;
}) {
	return (
		<Container {...props}>
			<FadeIn className={clsx("max-w-2xl", centered && "mx-auto text-center")}>
				<h2>
					{eyebrow && (
						<>
							<span
								className={clsx(
									"mb-6 block font-display text-base font-semibold",
									invert ? "text-white" : "text-neutral-950",
								)}
							>
								{eyebrow}
							</span>
							<span className="sr-only"> - </span>
						</>
					)}
					<span
						className={clsx(
							"block font-display tracking-tight text-wrap:balance font-serif",
							smaller
								? "text-2xl font-semibold"
								: "text-4xl font-medium sm:text-5xl",
							invert ? "text-white" : "text-neutral-950",
						)}
					>
						{title}
					</span>
				</h2>
				{children && (
					<div
						className={clsx(
							"mt-6 text-xl",
							invert ? "text-neutral-300" : "text-neutral-600",
						)}
					>
						{children}
					</div>
				)}
			</FadeIn>
		</Container>
	);
}