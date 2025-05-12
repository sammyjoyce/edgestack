import clsx from "clsx";
import React, { type JSX } from "react";
import { Button } from "~/routes/common/components/ui/Button";
import { ConditionalRichTextRenderer } from "~/routes/common/components/ConditionalRichTextRenderer";

interface HeroProps {
	title: string;
	subtitle?: string;
	imageUrl?: string;
	altText?: string;
	theme?: "light" | "dark";
}

export default function Hero({
	title,
	subtitle,
	imageUrl,
	altText = "Modern home extension background",
	theme = "light",
}: HeroProps): JSX.Element {
	const backgroundUrl = imageUrl ?? "/assets/rozelle.jpg";
	return (
		<div
			className={clsx(
				"relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-950",
				theme === "dark" && "dark",
			)}
		>
			<div className="-z-10 absolute inset-0">
				<img
					src={backgroundUrl}
					alt={altText}
					className="h-full w-full scale-105 object-cover object-center blur-[1px] brightness-90 transition-all duration-700"
				/>
			</div>
			<div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 lg:px-8">
				<div className="mx-auto flex min-h-[calc(100vh-3.5rem)] flex-col justify-center py-32 sm:py-48 lg:py-56">
					<div className="relative animate-fade-in-up text-center">
						<h1 className="text-wrap:balance mb-4 rounded-xl bg-white/90 px-5 py-2 font-display font-medium font-serif text-5xl tracking-tight text-gray-900 drop-shadow-2xl backdrop-blur-md transition-all duration-300 ease-in-out dark:bg-black/80 dark:text-gray-100 sm:text-6xl lg:text-7xl">
							{title}
						</h1>
						{subtitle && (
							<div className="mx-auto inline-block">
								<ConditionalRichTextRenderer 
									text={subtitle} 
									fallbackClassName="mx-auto rounded-xl bg-white/90 px-4 py-2 text-center font-sans text-lg text-gray-700 drop-shadow-md backdrop-blur-md transition-all duration-300 ease-in-out dark:bg-black/80 dark:text-gray-100 sm:text-lg lg:text-2xl"
									richTextClassName="mx-auto rounded-xl bg-white/90 px-4 py-2 text-center font-sans text-lg drop-shadow-md backdrop-blur-md transition-all duration-300 ease-in-out dark:bg-black/80 sm:text-lg lg:text-2xl prose-headings:font-display prose-headings:font-medium prose-headings:text-gray-700 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-100 prose-strong:text-gray-700 dark:prose-strong:text-gray-100 prose-em:text-gray-700 dark:prose-em:text-gray-100"
								/>
							</div>
						)}
						<div className="mt-6 flex items-center justify-center gap-x-6">
							<Button invert={theme === "light"} to="#contact">
								Enquire Now
							</Button>
							<Button invert={theme === "light"} to="#services">
								Our Services <span aria-hidden="true">→</span>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
