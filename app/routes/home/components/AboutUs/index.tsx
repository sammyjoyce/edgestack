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
	title = "About Us",
	text,
	imageUrl,
	altText,
	theme = "light",
}: AboutProps): JSX.Element {
	const defaultAboutText = `At Lush Constructions, we're driven by a passion for building more than just structures – we craft homes, communities, and memories that last a lifetime. With a relentless focus on quality, transparency, and trust, we're dedicated to turning your vision into a breathtaking reality. As proud members of Master Builders NSW, we uphold the highest standards in the industry, ensuring every project is delivered with precision, care, and a commitment to excellence. Whether you're dreaming of a grand renovation, a thoughtful extension, or a brand-new build, our team of experts is here to guide you every step of the way.`;
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
							<FadeIn>
								<img
									src="/assets/master-builders-logo.png"
									alt="Master Builders Logo"
									className="h-16 sm:h-18"
								/>
							</FadeIn>
							<FadeIn>
								<h2
									className={clsx(
										"font-medium font-serif text-3xl tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl",
									)}
								>
									{title ?? "About Us"}
								</h2>
							</FadeIn>
						</div>
						<div className="space-y-4 text-gray-700 dark:text-gray-300">
							<ConditionalRichTextRenderer
								text={text ?? defaultAboutText}
								fallbackClassName="text-base sm:text-lg text-gray-700 dark:text-gray-300"
								richTextClassName={clsx(
									"text-base sm:text-lg",
									"prose-p:text-gray-700 dark:prose-p:text-gray-300",
									"prose-headings:text-gray-700 dark:prose-headings:text-gray-300",
									"prose-strong:text-gray-700 dark:prose-strong:text-gray-300",
									"prose-em:text-gray-700 dark:prose-em:text-gray-300",
									"prose-a:text-gray-700 dark:prose-a:text-gray-300 hover:prose-a:underline",
									theme === "dark" && "dark:prose-invert",
									"prose max-w-none",
								)}
								fallbackTag="p"
							/>
						</div>
					</div>
					<div className="w-full md:w-1/2">
						<img
							src={imageUrl ?? "/assets/team.jpg"}
							alt={altText ?? title}
							className="aspect-3/2 w-full rounded-md object-cover"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
