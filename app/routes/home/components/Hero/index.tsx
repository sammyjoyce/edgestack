import React, { type JSX } from "react"; // Import React
// Define props interface
import { Button } from "~/routes/common/components/ui/Button";

import clsx from "clsx"; // Ensure clsx is imported if not already
// Define props interface
// import { Button } from "~/routes/common/components/ui/Button"; // This was also a duplicate, but the React import is the primary error cause. Let's stick to the React import.

interface HeroProps {
	title: string;
	subtitle?: string;
	imageUrl?: string;
	altText?: string;
	theme?: 'light' | 'dark'; // Add theme prop
}

export default function Hero({
	title,
	subtitle,
	imageUrl,
	altText = "Modern home extension background",
	theme = "light", // Default theme
}: HeroProps): JSX.Element {
	const backgroundUrl = imageUrl ?? "/assets/rozelle.jpg";

	return (
		<div
			className={clsx(
				"relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-950",
				theme === "dark" && "dark",
			)}
		>
			{/* Background image with soft gradient overlay */}
			{/* Adjust brightness/blur based on theme if needed */}
			<div className="-z-10 absolute inset-0">
				<img
					src={backgroundUrl}
					alt={altText}
					className="h-full w-full scale-105 object-cover object-center blur-[1px] brightness-90 transition-all duration-700"
				/>
			</div>

			<div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 lg:px-8">
				<div className="mx-auto flex min-h-[calc(100vh-3.5rem)] flex-col justify-center py-32 sm:py-48 lg:py-56">
					{/* Animated headline and subheadline */}
					<div className="relative animate-fade-in-up text-center">
						<h1 className="text-wrap:balance mb-4 rounded-xl bg-white/90 px-5 py-2 font-display font-medium font-serif text-5xl tracking-tight text-gray-900 drop-shadow-2xl backdrop-blur-md transition-all duration-300 ease-in-out dark:bg-black/80 dark:text-gray-100 sm:text-6xl lg:text-7xl">
							{title}
						</h1>
						{/* Conditionally render subtitle if provided */}
						{subtitle && (
							<div className="mx-auto inline-block">
								<p className="mx-auto rounded-xl bg-white/90 px-4 py-2 text-center font-sans text-lg text-gray-700 drop-shadow-md backdrop-blur-md transition-all duration-300 ease-in-out dark:bg-black/80 dark:text-gray-100 sm:text-lg lg:text-2xl">
									{subtitle}
								</p>
							</div>
						)}
						{/* CTA Buttons */}
						<div className="mt-6 flex items-center justify-center gap-x-6">
							<Button invert={theme === 'light'} to="#contact">
								Enquire Now
							</Button>
							<Button invert={theme === 'light'} to="#services">
								Our Services <span aria-hidden="true">→</span>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
