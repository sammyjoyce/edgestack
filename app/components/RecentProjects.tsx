import clsx from "clsx";
import React from "react";
import { Container } from "./ui/Container";
import { FadeIn, FadeInStagger } from "./ui/FadeIn";
import { SectionIntro } from "./ui/SectionIntro";

const projects = [
	{
		title: "Modern Home Extension",
		image: "/assets/pic13-C3BImLY9.png",
		description:
			"A seamless blend of old and new, this extension maximizes light and space while maintaining character.",
	},
	{
		title: "Luxury Kitchen Renovation",
		image: "/assets/pic09-By9toE8x.png",
		description:
			"Premium finishes and high-end appliances transform this kitchen into the heart of the home.",
	},
	{
		title: "Outdoor Living Retreat",
		image: "/assets/pic08-B09tdJ9o.png",
		description:
			"A resort-style alfresco area perfect for entertaining and relaxation, year-round.",
	},
];

export default function RecentProjects() {
	return (
		<section id="projects" className="w-full bg-white py-20">
			<SectionIntro
				title="Recent Projects"
				className="mb-16 max-w-6xl px-4 lg:px-8"
			/>
			<Container className="max-w-6xl px-4 lg:px-8">
				<FadeInStagger>
					<div className="flex flex-col gap-24">
						{projects.map((project, idx) => (
							<FadeIn key={idx}>
								<div
									className={clsx(
										"grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12",
										idx % 2 === 1 && "md:flex-row-reverse",
									)}
								>
									<div className="w-full">
										<img
											src={project.image}
											alt={project.title}
											className="aspect-3/2 w-full rounded-md object-cover"
										/>
									</div>
									<div className="flex w-full flex-col justify-center px-4 py-6 md:px-8 md:py-0">
										<h3 className="mb-4 font-serif text-2xl text-black leading-snug md:mb-6 md:text-3xl">
											{project.title}
										</h3>
										<p className="mb-4 text-base text-gray-700 md:mb-6 md:text-lg">
											{project.description}
										</p>
										<a
											href="#"
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
