import React, { type JSX } from "react"; // Import React
import { useOutletContext } from "react-router";
import RecentProjects from "~/routes/common/components/RecentProjects";
// Import parent route loader function for typing
import type { loader as parentLoader } from "~/routes/home/views/_layout";
import AboutUs from "../components/AboutUs";
import ContactUs from "../components/ContactUs";
import Hero from "../components/Hero";
import OurServices from "../components/OurServices";

export const meta: any = ({ matches }: { matches: any[] }) => { // Adjusted type for meta function and matches
	// Access loader data safely from parent layout match using the correct type (Awaited to unwrap the Promise)
	const parentLayoutMatch = matches.find(
		(match) => match?.id === "routes/home/views/_layout",
	);
	const parentLayoutData = parentLayoutMatch?.data as
		| Awaited<ReturnType<typeof parentLoader>>
		| undefined;
	const c = parentLayoutData?.content as Record<string, string> | undefined;
	const pageTitle =
		c?.["meta_title"] ?? "Lush Constructions";
	const pageDescription =
		c?.["meta_description"] ??
		"High-Quality Solutions for Home & Office Improvement";

	return [
		{ title: pageTitle },
		{
			name: "description",
			content: pageDescription,
		},
	];
};

export function HomeRoute(): JSX.Element {
	// Use useOutletContext with Awaited<ReturnType> to unwrap the Promise
	const { content: rawContent, projects = [] } =
		useOutletContext<Awaited<ReturnType<typeof parentLoader>>>();
	const content = (rawContent ?? {}) as Record<string, string>;

	// Section mapping
	const sectionBlocks: Record<string, JSX.Element> = {
		hero: (
			<Hero
				key="hero"
				title={content.hero_title ?? "Building Dreams, Creating Spaces"}
				subtitle={
					content.hero_subtitle ??
					"Your trusted partner in construction and renovation."
				}
				imageUrl={content.hero_image_url ?? "/assets/rozelle.jpg"}
			/>
		),
		services: (
			<OurServices
				key="services"
				introTitle={content.services_intro_title ?? "Our Services"}
				introText={
					content.services_intro_text ??
					"We offer a wide range of construction services."
				}
				servicesData={[
					{
						title: content.service_1_title ?? "Kitchens",
						image: content.service_1_image ?? "/assets/pic09-By9toE8x.png",
						link: "#contact",
					},
					{
						title: content.service_2_title ?? "Bathrooms",
						image: content.service_2_image ?? "/assets/pic06-BnCQnmx7.png",
						link: "#contact",
					},
					{
						title: content.service_3_title ?? "Roofing",
						image: content.service_3_image ?? "/assets/pic13-C3BImLY9.png",
						link: "#contact",
					},
					{
						title: content.service_4_title ?? "Renovations",
						image: content.service_4_image ?? "/assets/pic04-CxD2NUJX.png",
						link: "#contact",
					},
				]}
			/>
		),
		projects: (
			<RecentProjects
				key="projects"
				introTitle={content.projects_intro_title ?? "Recent Projects"}
				introText={
					content.projects_intro_text ??
					"Take a look at some of our recent work."
				}
				projects={projects}
			/>
		),
		about: (
			<AboutUs
				key="about"
				title={content.about_title ?? "About Us"}
				text={content.about_text ?? "Learn more about our company and values."}
				imageUrl={content.about_image_url ?? "/assets/rozelle.jpg"}
			/>
		),
		contact: <ContactUs key="contact" content={content} />,
	};

	// Determine order
	const DEFAULT_ORDER = ["hero", "services", "projects", "about", "contact"];
	const orderString = content.home_sections_order as string | undefined;
	const order = orderString
		? orderString.split(",").filter((id) => id in sectionBlocks)
		: DEFAULT_ORDER;

	return <>{order.map((id) => sectionBlocks[id])}</>;
}

// Default export for backwards compatibility
export default HomeRoute;
