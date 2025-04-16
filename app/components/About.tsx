import { FadeIn } from "./ui/FadeIn";
import { SectionIntro } from "./ui/SectionIntro";

export default function AboutUs() {
	return (
		<section className="bg-white py-12 sm:py-20 md:py-28" id="about">
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
								<h2 className="font-medium font-serif text-3xl tracking-tight sm:text-4xl md:text-5xl">
									About Us
								</h2>
							</FadeIn>
						</div>
						<div className="space-y-4 text-gray-700">
							<p className="mb-2 text-lg">
								At Lush Constructions, we're driven by a passion for building
								more than just structures – we craft homes, communities, and
								memories that last a lifetime.
							</p>
							<p className="text-base sm:text-lg">
								With a relentless focus on quality, transparency, and trust,
								we're dedicated to turning your vision into a breathtaking
								reality.
							</p>
							<p className="text-base sm:text-lg">
								As proud members of Master Builders NSW, we uphold the highest
								standards in the industry, ensuring every project is delivered
								with precision, care, and a commitment to excellence.
							</p>
							<p className="text-base sm:text-lg">
								Whether you're dreaming of a grand renovation, a thoughtful
								extension, or a brand-new build, our team of experts is here to
								guide you every step of the way.
							</p>
						</div>
					</div>
					<div className="w-full md:w-1/2">
						<img
							src="/assets/team.jpg"
							alt="About Us"
							className="aspect-3/2 w-full rounded-md object-cover"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
