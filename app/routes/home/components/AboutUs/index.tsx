import clsx from "clsx";
import React, { type JSX } from "react";
import { ConditionalRichTextRenderer } from "~/routes/common/components/ConditionalRichTextRenderer";
import { FadeIn } from "~/routes/common/components/ui/FadeIn";

interface AboutProps {
	title?: string;
	text?: string;
	imageUrl?: string;
	altText?: string;
	theme?: "light" | "dark";
}

export default function AboutUs({
	title,
	text,
	imageUrl,
	altText,
	theme = "light",
}: AboutProps): JSX.Element | null {
	if (!title && !text && !imageUrl) return null;
	return (
		<section
			className={clsx(
				"py-12 sm:py-20 md:py-28 bg-white text-gray-900 dark:bg-gray-900 dark:text-white",
				theme === "dark" && "dark",
			)}
			id="about"
		>
			<div className="mx-auto max-w-7xl px-4 lg:px-6">
				<div className="flex flex-col md:flex-row md:gap-12">
					<div className="mb-8 w-full md:mb-0 md:max-w-xl">
						<div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
							{title && (
								<FadeIn>
									<h2
										className={clsx(
											"font-medium font-serif text-3xl tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl",
										)}
									>
										{title}
									</h2>
								</FadeIn>
							)}
						</div>
						{text && (
							<div className="space-y-4 text-gray-700 dark:text-gray-300">
								<ConditionalRichTextRenderer
									text={text}
									fallbackClassName="text-base sm:text-lg text-gray-700 dark:text-gray-300"
									richTextClassName={clsx(
										"prose-base sm:prose-lg", // Prose size modifiers
										"prose-p:text-gray-700 dark:prose-p:text-gray-300",
										"prose-headings:text-gray-700 dark:prose-headings:text-gray-300",
										"prose-strong:text-gray-700 dark:prose-strong:text-gray-300",
										"prose-em:text-gray-700 dark:prose-em:text-gray-300",
										"prose-a:text-gray-700 dark:prose-a:text-gray-300 hover:prose-a:underline",
										"prose max-w-none",
									)}
									fallbackTag="p"
								/>
							</div>
						)}
					</div>
					{imageUrl && (
						<div className="w-full md:w-1/2">
							<img
								src={imageUrl}
								alt={altText ?? title ?? ""}
								className="aspect-3/2 w-full rounded-md object-cover"
							/>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
