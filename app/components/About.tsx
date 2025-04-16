import { FadeIn } from "./ui/FadeIn";
import { SectionIntro } from "./ui/SectionIntro";

export default function AboutUs() {
	return (
		<section className="bg-white py-12 sm:py-20 md:py-28" id="about">
			<div className="mx-auto flex max-w-7xl flex-row gap-12 px-4 lg:px-6">
				<div className="max-w-xl">
					<div className="flex w-content flex-row items-center gap-2 align-start">
						<FadeIn className="max-w-2xl">
							<h2 className="flex w-content flex-row items-center gap-12 align-start">
								<img
									src="/assets/master-builders-logo.png"
									alt="Master Builders Logo"
									className="mt-4 h-18"
								/>
								<span className="text-wrap:balance block font-display font-medium font-serif text-4xl tracking-tight sm:text-5xl">
									About Us
								</span>
							</h2>
						</FadeIn>
					</div>
					<div className="space-y-4 text-body text-gray-700">
						<p className="mb-2 text-body-lg">
							At Lush Constructions, we're driven by a passion for building more
							than just structures – we craft homes, communities, and memories
							that last a lifetime.
						</p>
						<p>
							With a relentless focus on quality, transparency, and trust, we're
							dedicated to turning your vision into a breathtaking reality.
						</p>
						<p>
							As proud members of Master Builders NSW, we uphold the highest
							standards in the industry, ensuring every project is delivered
							with precision, care, and a commitment to excellence.
						</p>
						<p>
							Whether you're dreaming of a grand renovation, a thoughtful
							extension, or a brand-new build, our team of experts is here to
							guide you every step of the way.
						</p>
					</div>
				</div>
				<img
					src="/assets/team.jpg"
					alt="About Us"
					className="aspect-3/2 w-1/2 rounded-md object-cover"
				/>
			</div>
		</section>
	);
}
