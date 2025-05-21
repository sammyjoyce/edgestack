import clsx from "clsx";
import React, { type JSX } from "react";
import { useSectionScroll } from "~/hooks/useSectionScroll";
import { ConditionalRichTextRenderer } from "~/routes/common/components/ConditionalRichTextRenderer";
import { Button } from "~/routes/common/components/ui/Button";
import { Container } from "~/routes/common/components/ui/Container";
import { FadeIn, FadeInStagger } from "~/routes/common/components/ui/FadeIn";
import { SectionIntro } from "~/routes/common/components/ui/SectionIntro";

export interface ServiceItem {
	title: string;
	image: string;
	link: string;
}

interface OurServicesProps {
	introTitle?: string;
	introText?: string;
	servicesData?: ServiceItem[];
	theme?: "light" | "dark";
}

export default function OurServices({
	introTitle,
	introText,
	servicesData,
	theme = "light",
}: OurServicesProps): JSX.Element | null {
	if (!introTitle && !introText && !(servicesData && servicesData.length))
		return null;
	const services = servicesData ?? [];
	const scrollToSection = useSectionScroll();

	return (
		<div
			className={clsx(
				"relative py-16 sm:py-24 bg-white dark:bg-gray-900",
				theme === "dark" && "dark",
			)}
			id="services"
		>
			<div
				className={clsx(
					"absolute inset-x-0 top-0 h-40 bg-linear-to-b from-gray-50 dark:from-gray-800",
				)}
			/>
			<Container>
				<section className="mt-12 mb-6 sm:mt-16 sm:mb-8 lg:mt-20 lg:mb-10">
					<SectionIntro centered title={introTitle}>
						{introText && (
							<ConditionalRichTextRenderer
								text={introText}
								fallbackClassName="text-xl text-center text-gray-500 dark:text-gray-400"
								richTextClassName={clsx(
									"prose-xl text-center",
									"prose-p:text-gray-700 dark:prose-p:text-gray-300",
									"prose-headings:text-gray-700 dark:prose-headings:text-gray-300",
									"prose-strong:text-gray-700 dark:prose-strong:text-gray-300",
									"prose-em:text-gray-700 dark:prose-em:text-gray-300",
									"prose-a:text-gray-700 dark:prose-a:text-gray-300 hover:prose-a:underline",
									"prose max-w-none text-center",
								)}
								fallbackTag="p"
							/>
						)}
						<div className="mt-6 flex justify-center">
							<Button
								to="#contact"
								invert={theme === "light"}
								onClick={scrollToSection}
							>
								Get Started
							</Button>
						</div>
					</SectionIntro>
				</section>
				{services.length > 0 && (
					<FadeInStagger faster>
						<div className="grid grid-cols-1 gap-8 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
							{services.map((service) => (
								<FadeIn key={service.title}>
									<div className="group relative overflow-hidden rounded-lg">
										<div className="aspect-5/9 overflow-hidden">
											<img
												src={service.image}
												alt={service.title}
												className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
											/>
										</div>
										<div className="absolute inset-0 z-10 flex flex-col justify-end p-4 sm:p-6">
											<div className="flex flex-col gap-2 text-white sm:gap-3">
												<h3 className="font-bold text-3xl sm:text-4xl ">
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
										<div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
									</div>
								</FadeIn>
							))}
						</div>
					</FadeInStagger>
				)}
			</Container>
		</div>
	);
}
