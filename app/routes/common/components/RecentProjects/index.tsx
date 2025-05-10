import { clsx } from "clsx"; // Ensure clsx is imported if not already
import React from "react";
import { Link, type To } from "react-router"; // Import To type
import ConditionalRichTextRenderer from "~/routes/common/components/ConditionalRichTextRenderer"; // Import the new component
import { Container } from "~/routes/common/components/ui/Container";
import { FadeIn, FadeInStagger } from "~/routes/common/components/ui/FadeIn";
import { SectionIntro } from "~/routes/common/components/ui/SectionIntro";
import type { Project } from "~/database/schema";

// Define props interface
interface RecentProjectsProps {
	introTitle?: string;
	introText?: string;
	projects: Project[]; // Expect projects array as a prop
	theme?: 'light' | 'dark'; // Add theme prop
}

export default function RecentProjects({
	introTitle,
	introText,
	projects = [],
	theme = "light", // Default theme
}: RecentProjectsProps) {
	// No longer use hardcoded data

	return ( // Apply theme to the section's root element
		<section id="projects" className={clsx("w-full py-20 bg-white dark:bg-gray-900", theme === "dark" && "dark")}>
			{/* Use props for intro title and text, with defaults */}
			<SectionIntro
				title={introTitle ?? "Recent Projects"}
				className="mb-16 max-w-6xl px-4 lg:px-8"
				invert={theme === 'dark'} // Invert SectionIntro if the section theme is dark
			>
				{introText && <p>{introText}</p>}
				{/* Conditionally render intro text if provided */}
			</SectionIntro>
			<Container className="max-w-6xl px-4 lg:px-8">
				<FadeInStagger>
					<div className="flex flex-col gap-24">
						{projects.map((project, idx) => (
							<FadeIn key={project.id}>
								<div
									className={clsx(
										"grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12",
										// Alternate layout direction based on index
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
											fallbackClassName="mb-4 text-base text-gray-700 dark:text-gray-300 md:mb-6 md:text-lg"
											richTextClassName={clsx(theme === "dark" && "dark:prose-invert")}
											fallbackTag="p"
										/>
										{/* Use Link with typed 'to' prop */}
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
