import { clsx } from "clsx";
import React from "react";
import { Link } from "react-router";
import type { Project } from "~/database/schema";
import { ConditionalRichTextRenderer } from "~/routes/common/components/ConditionalRichTextRenderer";
import { Container } from "~/routes/common/components/ui/Container";
import { FadeIn, FadeInStagger } from "~/routes/common/components/ui/FadeIn";
import { SectionIntro } from "~/routes/common/components/ui/SectionIntro";

interface RecentProjectsProps {
	introTitle?: string;
	introText?: string;
	projects: Project[];
	theme?: "light" | "dark";
}

export default function RecentProjects({
	introTitle,
	introText,
	projects = [],
	theme = "light",
}: RecentProjectsProps) {
	return (
		<section
			id="projects"
			className={clsx(
				"w-full py-20 bg-white dark:bg-gray-900",
				theme === "dark" && "dark",
			)}
		>
			<SectionIntro
				title={introTitle ?? "Recent Projects"}
				className="mb-16 max-w-6xl px-4 lg:px-8"
				invert={theme === "dark"}
			>
				{introText && (
					<ConditionalRichTextRenderer
						text={introText}
						fallbackClassName="text-xl text-gray-600 dark:text-gray-300" // Standard Tailwind for fallback
						richTextClassName="prose-xl" // Assuming intro text should be larger
					/>
				)}
			</SectionIntro>
			<Container className="max-w-6xl px-4 lg:px-8">
				<FadeInStagger>
					<div className="flex flex-col gap-24">
						{projects.map((project, idx) => (
							<FadeIn key={project.id}>
								<div
									className={clsx(
										"grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12",
										idx % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row",
									)}
								>
									<div
										className={clsx(
											"w-full",
											idx % 2 === 1 ? "md:order-last" : "",
										)}
									>
										<img
											src={project.imageUrl ?? undefined}
											alt={project.title}
											className="aspect-3/2 w-full rounded-md object-cover"
										/>
									</div>
									<div
										className={clsx(
											"flex w-full flex-col justify-center px-4 py-6 md:px-8 md:py-0",
											idx % 2 === 1 ? "md:order-first" : "",
										)}
									>
										<h3 className="mb-4 font-serif text-2xl text-black leading-snug dark:text-white md:mb-6 md:text-3xl">
											{project.title}
										</h3>
										<ConditionalRichTextRenderer
											text={
												project.description ? String(project.description) : null
											}
											fallbackClassName="mb-4 text-base text-gray-700 dark:text-gray-300 md:mb-6 md:text-lg" // Standard Tailwind
											richTextClassName={clsx(
												"mb-4 md:mb-6 prose-base md:prose-lg", // Prose size modifiers
												"prose-p:text-gray-700 dark:prose-p:text-gray-300",
												"prose-headings:text-gray-700 dark:prose-headings:text-gray-300",
												"prose-strong:text-gray-700 dark:prose-strong:text-gray-300",
												"prose-em:text-gray-700 dark:prose-em:text-gray-300",
												"prose-a:text-gray-700 dark:prose-a:text-gray-300 hover:prose-a:underline",
												"prose max-w-none",
											)}
											fallbackTag="p"
										/>
										<Link
											to={`/projects/${project.id}`}
											className="font-semibold text-base text-black underline underline-offset-4 transition hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
										>
											View Project Details →
										</Link>
									</div>
								</div>
							</FadeIn>
						))}
					</div>
				</FadeInStagger>
			</Container>
		</section>
	);
}
