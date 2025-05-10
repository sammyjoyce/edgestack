import React, { type JSX } from "react";
import ConditionalRichTextRenderer from "~/routes/common/components/ConditionalRichTextRenderer"; // Import the new component
import { Button } from "~/routes/common/components/ui/Button";
import { Container } from "~/routes/common/components/ui/Container";
import { FadeIn, FadeInStagger } from "~/routes/common/components/ui/FadeIn";
import { SectionIntro } from "~/routes/common/components/ui/SectionIntro";

// Define props interface
interface ServiceItem {
	title: string;
	image: string;
	link: string;
}

interface OurServicesProps {
	introTitle?: string;
	introText?: string;
	servicesData?: ServiceItem[];
}

// Default hardcoded services
const defaultServices: ServiceItem[] = [
	{
		title: "Kitchens",
		image: "/assets/pic09-By9toE8x.png",
		link: "#contact",
	},
	{
		title: "Bathrooms",
		image: "/assets/pic06-BnCQnmx7.png",
		link: "#contact",
	},
	{
		title: "Roofing",
		image: "/assets/pic13-C3BImLY9.png",
		link: "#contact",
	},
	{
		title: "Renovations",
		image: "/assets/pic04-CxD2NUJX.png",
		link: "#contact",
	},
];

export default function OurServices({
	introTitle = "Renovation and Extension Specialists",
	introText,
	servicesData,
}: OurServicesProps): JSX.Element {
	const defaultIntroText =
		"Qualified & Professional Building Services from Start to Finish";
	const services = servicesData ?? defaultServices;

	return (
		<div className="relative bg-white py-16 sm:py-24" id="services">
			<div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-gray-50" />

			<Container>
				<section className="mt-12 mb-6 sm:mt-16 sm:mb-8 lg:mt-20 lg:mb-10">
					{/* Use props for intro title and text, with defaults */}
					<SectionIntro centered title={introTitle}>
						<ConditionalRichTextRenderer
							text={introText || defaultIntroText}
							fallbackTag="p"
						/>
						<div className="mt-6 flex justify-center">
							<Button to="#contact">Get Started</Button>
						</div>
					</SectionIntro>
				</section>

				<FadeInStagger faster>
					<div className="grid grid-cols-1 gap-8 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
						{/* Map over the provided services array or fallback to default */}
						{services.map((service) => (
							<FadeIn key={service.title}>
								<div className="group relative overflow-hidden rounded-lg">
									{/* Service Image */}
									<div className="aspect-5/9 overflow-hidden">
										<img
											src={service.image}
											alt={service.title}
											className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
										/>
									</div>

									{/* Service Info */}
									<div className="absolute inset-0 z-10 flex flex-col justify-end p-4 sm:p-6">
										<div className="flex flex-col gap-2 sm:gap-3">
											<h3 className="font-bold text-3xl text-white sm:text-4xl">
												{service.title}
											</h3>
											<a
												href={service.link}
												className="inline-flex items-center text-white hover:underline"
											>
												Request A Quote <span className="ml-2">→</span>
											</a>
										</div>
									</div>

									{/* Gradient Overlay */}
									<div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
								</div>
							</FadeIn>
						))}
					</div>
				</FadeInStagger>
			</Container>
		</div>
	);
}
