import { Button } from "./ui/Button";

export default function Hero() {
	return (
		<div className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden">
			{/* Background image with soft gradient overlay */}
			<div className="-z-10 absolute inset-0">
				<img
					src="/assets/rozelle.jpg"
					alt="Modern home extension background"
					className="h-full w-full scale-105 object-cover object-center blur-[1px] brightness-90 transition-all duration-700"
				/>
			</div>

			<div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 lg:px-8">
				<div className="mx-auto flex min-h-[calc(100vh-3.5rem)] flex-col justify-center py-32 sm:py-48 lg:py-56">
					{/* Animated headline and subheadline */}
					<div className="relative animate-fade-in-up text-center">
						<h1 className="text-wrap:balance mb-4 rounded-xl bg-black/80 px-5 py-2 font-display font-medium font-serif text-5xl text-gray-100 text-white tracking-tight drop-shadow-2xl backdrop-blur-md transition-all duration-300 ease-in-out sm:text-6xl lg:text-7xl">
							Lush Contructions
						</h1>
						<div className="mx-auto inline-block">
							<p className="mx-auto rounded-xl bg-black/80 px-4 py-2 text-center font-sans text-gray-100 text-lg drop-shadow-md backdrop-blur-md transition-all duration-300 ease-in-out sm:text-lg lg:text-2xl">
								Building Beyond Expectations
							</p>
						</div>
						{/* CTA Buttons */}
						<div className="mt-6 flex items-center justify-center gap-x-6">
							<Button invert to="#contact">
								Enquire Now
							</Button>
							<Button invert to="#services">
								Our Services <span aria-hidden="true">→</span>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
