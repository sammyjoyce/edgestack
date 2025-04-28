import clsx from "clsx";
import React from "react";
import { Container } from "./ui/Container";
import { FadeIn, FadeInStagger } from "./ui/FadeIn";
import { SectionIntro } from "./ui/SectionIntro";

// Define props interface
interface RecentProjectsProps {
	introTitle?: string;
	introText?: string;
	// Project data could also be passed as props if needed later
	// projects?: Array<{ id: string; title: string; image: string; description: string; url: string }>;
}

// Hardcoded project data for now
const defaultProjects = [
	{
		id: "modern-home-extension",
		title: "Modern Home Extension",
		image: "/assets/pic13-C3BImLY9.png",
		description:
			"A seamless blend of old and new, this extension maximizes light and space while maintaining character.",
		url: "#", // Link to contact or specific project page if exists
	},
	{
		id: "luxury-kitchen-renovation",
		title: "Luxury Kitchen Renovation",
		image: "/assets/pic09-By9toE8x.png",
		description:
			"Premium finishes and high-end appliances transform this kitchen into the heart of the home.",
		url: "#",
	},
	{
		id: "outdoor-living-retreat",
		title: "Outdoor Living Retreat",
		image: "/assets/pic08-B09tdJ9o.png",
		description:
			"A resort-style alfresco area perfect for entertaining and relaxation, year-round.",
		url: "#",
	},
];

export default function RecentProjects({
	introTitle,
	introText,
}: RecentProjectsProps) {
	// Use default projects if none are passed via props (though props aren't defined for projects yet)
	const projects = defaultProjects;

	return (
		<section id="projects" className="w-full bg-white py-20">
			{/* Use props for intro title and text, with defaults */}
			<SectionIntro
				title={introTitle ?? "Recent Projects"}
				className="mb-16 max-w-6xl px-4 lg:px-8"
			>
				{introText && <p>{introText}</p>}{" "}
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
											src={project.image}
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
										<h3 className="mb-4 font-serif text-2xl text-black leading-snug md:mb-6 md:text-3xl">
											{project.title}
										</h3>
										<p className="mb-4 text-base text-gray-700 md:mb-6 md:text-lg">
											{project.description}
										</p>
										<a
											href={project.url}
											className="font-semibold text-base text-black underline underline-offset-4 transition hover:text-gray-700"
										>
											View Project →
										</a>
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
