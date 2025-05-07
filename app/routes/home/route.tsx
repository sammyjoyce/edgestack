import { useLoaderData, type MetaFunction, data } from "react-router"; // Added data import

import type { JSX } from "react";
import type { Route } from "./+types/route";
import Footer from "~/routes/common/components/Footer";
import Header from "~/routes/common/components/Header";
import RecentProjects from "~/routes/common/components/RecentProjects";
import { getFeaturedProjects } from "~/routes/common/db"; // Import the new function
import { getAllContent } from "~/routes/common/db";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import Hero from "./components/Hero";
import OurServices from "./components/OurServices";
import type { Project } from "~/database/schema"; // Ensure Project is imported

export const meta: MetaFunction<typeof loader> = ({ data: loaderData }) => {
	// Access loader data safely. The loader ensures 'content' is an object.
	const content = loaderData?.content ?? {};
	const pageTitle = content.meta_title ?? "Lush Constructions";
	const pageDescription =
		content.meta_description ??
		"High-Quality Solutions for Home & Office Improvement";

	return [
		{ title: pageTitle },
		{
			name: "description",
			content: pageDescription,
		},
	];
};

// Return a plain object for better type inference
export async function loader({ context }: Route.LoaderArgs) {
	try {
		const [content, projects] = await Promise.all([
			getAllContent(context.db),
			getFeaturedProjects(context.db),
		]);
		return { content, projects };
	} catch (error: any) {
		console.error("Error fetching data from D1:", error);
		// Throw an error response to be caught by the ErrorBoundary
		throw data(
			{ message: error.message || "Failed to load home page data" },
			{ status: 500 },
		);
	}
}

export default function HomeRoute(): JSX.Element {
	// Use type inference for useLoaderData
	// Error case is now handled by ErrorBoundary if loader throws
	const { content, projects } = useLoaderData<typeof loader>();

	// Type assert content to have string keys and values
	const typedContent = content as Record<string, string>;

	// Section mapping
	const sectionBlocks: Record<string, JSX.Element> = {
		hero: (
			<Hero
				key="hero"
				title={typedContent?.hero_title ?? "Building Dreams, Creating Spaces"}
				subtitle={
					typedContent?.hero_subtitle ??
					"Your trusted partner in construction and renovation."
				}
				imageUrl={typedContent?.hero_image_url ?? "/assets/rozelle.jpg"}
			/>
		),
		services: (
			<OurServices
				key="services"
				introTitle={typedContent?.services_intro_title ?? "Our Services"}
				introText={
					typedContent?.services_intro_text ??
					"We offer a wide range of construction services."
				}
				servicesData={[
					{
						title: typedContent?.service_1_title ?? "Kitchens",
						image:
							typedContent?.service_1_image ?? "/assets/pic09-By9toE8x.png",
						link: "#contact",
					},
					{
						title: typedContent?.service_2_title ?? "Bathrooms",
						image:
							typedContent?.service_2_image ?? "/assets/pic06-BnCQnmx7.png",
						link: "#contact",
					},
					{
						title: typedContent?.service_3_title ?? "Roofing",
						image:
							typedContent?.service_3_image ?? "/assets/pic13-C3BImLY9.png",
						link: "#contact",
					},
					{
						title: typedContent?.service_4_title ?? "Renovations",
						image:
							typedContent?.service_4_image ?? "/assets/pic04-CxD2NUJX.png",
						link: "#contact",
					},
				]}
			/>
		),
		projects: (
			<RecentProjects
				key="projects"
				introTitle={typedContent?.projects_intro_title ?? "Recent Projects"}
				introText={
					typedContent?.projects_intro_text ??
					"Take a look at some of our recent work."
				}
				projects={projects}
			/>
		),
		about: (
			<AboutUs
				key="about"
				title={typedContent?.about_title ?? "About Us"}
				text={
					typedContent?.about_text ?? "Learn more about our company and values."
				}
				imageUrl={typedContent?.about_image_url ?? "/assets/rozelle.jpg"}
			/>
		),
		contact: <ContactUs key="contact" content={typedContent} />, // Pass typed content prop
	};

	// Determine order
	const DEFAULT_ORDER = ["hero", "services", "projects", "about", "contact"];
	const orderString = typedContent?.home_sections_order;
	const order = orderString
		? orderString.split(",").filter((id) => id in sectionBlocks)
		: DEFAULT_ORDER;

	return (
		<div className="bg-linear-180/oklch from-0% from-gray-600/0 via-20% via-80% via-gray-600/10 to-100% to-gray-600/0">
			<Header />
			{order.map((id) => sectionBlocks[id])}
			<Footer />
		</div>
	);
}
