import { motion } from "framer-motion";
import { Button } from "./ui/Button";
import { Container } from "./ui/Container";
import { FadeIn, FadeInStagger } from "./ui/FadeIn";
import { SectionIntro } from "./ui/SectionIntro";

const services = [
	{
		title: "Kitchens",
		image: "/assets/pic09-By9toE8x.png",
		link: "#request-quote",
	},
	{
		title: "Bathrooms",
		image: "/assets/pic06-BnCQnmx7.png",
		link: "#request-quote",
	},
	{
		title: "Roofing",
		image: "/assets/pic13-C3BImLY9.png",
		link: "#request-quote",
	},
	{
		title: "Renovations",
		image: "/assets/pic04-CxD2NUJX.png",
		link: "#request-quote",
	},
];

export default function OurServices() {
	return (
		<div className="relative bg-white py-16 sm:py-24">
			<div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-gray-50" />

			<Container>
				<section className="mt-12 mb-6 sm:mt-16 sm:mb-8 lg:mt-20 lg:mb-10">
					<SectionIntro centered title="Renovation and Extension Specialists">
						<p>
							Qualified & Professional Building Services from Start to Finish
						</p>
						<div className="mt-6 flex justify-center">
							<Button to="#contact">Get Started</Button>
						</div>
					</SectionIntro>
				</section>

				<FadeInStagger faster>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
						{services.map((service, index) => (
							<FadeIn key={index}>
								<div className="group relative overflow-hidden rounded-lg">
									{/* Service Image */}
									<div className="aspect-[5/9] overflow-hidden">
										<img
											src={service.image}
											alt={service.title}
											className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
										/>
									</div>

									{/* Service Info */}
									<div className="absolute inset-0 z-10 flex flex-col justify-end p-6">
										<div className="flex flex-col gap-3">
											<h3 className="font-bold text-4xl text-white">
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
									<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
								</div>
							</FadeIn>
						))}
					</div>
				</FadeInStagger>
			</Container>
		</div>
	);
}
