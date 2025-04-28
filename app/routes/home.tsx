
import { data, useLoaderData } from "react-router"; // data helper is typically in the node adapter
import type { Route } from ".react-router/types/app/routes/+types/home";
import { schema } from "../../database/schema";

import AboutUs from "../components/About";
import ContactUs from "../components/ContactUs";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { getFeaturedProjects } from "../db/index"; // Import the new function
import type { Project } from "../../database/schema"; // Import Project type
import AboutUs from "../components/About";
import ContactUs from "../components/ContactUs";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import OurServices from "../components/OurServices";
import RecentProjects from "../components/RecentProjects";

export const meta: Route.MetaFunction = () => {
	return [
		{ title: "Lush Constructions" },
		{
			name: "description",
			content: "High-Quality Solutions for Home & Office Improvement",
		},
	];
};

// Update loader to fetch dynamic content from D1
export async function loader({ context }: Route.LoaderArgs) {
	let contentMap: Record<string, string> = {};

	try {
		// Query the content table - Remove explicit type argument from .all()
		const results = await context.db.select({ key: schema.content.key, value: schema.content.value }).from(schema.content);

		if (results) {
			contentMap = (results as Array<{ key: string; value: string }>).reduce(
				(acc: Record<string, string>, { key, value }) => {
					acc[key] = value;
					return acc;
				},
				{},
			);
		}
	} catch (error) {
		console.error("Error fetching content from D1:", error);
	}

	return {
		content: contentMap as Record<string, string>,
	};
}

export default function Home() {
	// Use the local ContentMap type for loader data
	const loaderData = useLoaderData<typeof loader>();
	const { content } = loaderData;

	return (
		<div className="bg-linear-180/oklch from-0% from-gray-600/0 via-20% via-80% via-gray-600/10 via-gray-600/10 to-100% to-gray-600/0">
			{/* Pass fetched content down to components as props */}
			<Header />
			{/* Use optional chaining and default values for robustness */}
			<Hero
				title={content?.hero_title ?? "Building Dreams, Creating Spaces"}
				subtitle={
					content?.hero_subtitle ??
					"Your trusted partner in construction and renovation."
				}
				imageUrl={content?.hero_image_url ?? "/assets/team.jpg"} // Default image if not set
			/>
			<OurServices
				introTitle={content?.services_intro_title ?? "Our Services"}
				introText={
					content?.services_intro_text ??
					"We offer a wide range of construction services."
				}
				servicesData={[
					{
						title: content?.service_1_title ?? "Kitchens",
						image: content?.service_1_image ?? "/assets/pic09-By9toE8x.png",
						link: "#contact",
					},
					{
						title: content?.service_2_title ?? "Bathrooms",
						image: content?.service_2_image ?? "/assets/pic06-BnCQnmx7.png",
						link: "#contact",
					},
					{
						title: content?.service_3_title ?? "Roofing",
						image: content?.service_3_image ?? "/assets/pic13-C3BImLY9.png",
						link: "#contact",
					},
					{
						title: content?.service_4_title ?? "Renovations",
						image: content?.service_4_image ?? "/assets/pic04-CxD2NUJX.png",
						link: "#contact",
					},
				]}
			/>
			<RecentProjects
				introTitle={content?.projects_intro_title ?? "Recent Projects"}
				introText={
					content?.projects_intro_text ??
					"Take a look at some of our recent work."
				}
				projects={projects} // Pass fetched projects to the component
			/>
			<AboutUs
				title={content?.about_title ?? "About Us"}
				text={content?.about_text ?? "Learn more about our company and values."}
				imageUrl={content?.about_image_url ?? "/assets/rozelle.jpg"} // Default image
			/>
			<ContactUs />
			<Footer />
		</div>
	);
}
