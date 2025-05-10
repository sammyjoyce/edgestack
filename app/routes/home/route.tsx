import { type MetaFunction, useLoaderData } from "react-router";
import type { Route } from "./+types/route"; // Ensure this is present or generated

const DEBUG = process.env.NODE_ENV !== "production";
import type { JSX } from "react";
import invariant from "tiny-invariant";
import Footer from "~/routes/common/components/Footer";
import Header from "~/routes/common/components/Header";
import RecentProjects from "~/routes/common/components/RecentProjects";
import { getFeaturedProjects } from "~/routes/common/db";
import { getAllContent } from "~/routes/common/db";
import type { Project } from "../../../database/schema";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import Hero from "./components/Hero";
import OurServices from "./components/OurServices";

export const meta: MetaFunction<typeof loader> = ({ data, matches }) => {
	// Access loader data safely. The loader ensures 'content' is an object.
	const content = data?.content ?? {};
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

export async function loader({ request, context }: Route.LoaderArgs): Promise<{
	content: Record<string, string>;
	projects: Project[];
	revalidatedAt?: number;
}> {
	invariant(request instanceof Request, "loader: request must be a Request");
	invariant(context?.db, "loader: missing DB in context");
	const url = new URL(request.url);
	const revalidate = url.searchParams.get("revalidate") === "true";
	if (DEBUG) console.log("[HOME LOADER] Revalidation requested:", revalidate);

	let content: Record<string, string> = {};
	let projects: Project[] = [];
	try {
		content = await getAllContent(context.db);
		projects = await getFeaturedProjects(context.db);
		if (DEBUG) {
			console.log("[HOME LOADER] Content keys loaded:", Object.keys(content));
			console.log("[HOME LOADER] Project count:", projects.length);
		}
	} catch (error: unknown) {
		if (DEBUG) {
			console.error("[HOME LOADER] Error fetching data:", error);
			if (error instanceof Error) {
				console.error("[HOME LOADER] Error message:", error.message);
				console.error("[HOME LOADER] Error stack:", error.stack);
			}
		}
	}
	invariant(typeof content === "object", "loader: content must be an object");
	invariant(Array.isArray(projects), "loader: projects must be an array");
	// Return a plain object without headers
	return {
		content,
		projects,
		revalidatedAt: revalidate ? Date.now() : undefined,
	};
}

export default function HomeRoute(): JSX.Element {
	const { content, projects, revalidatedAt } = useLoaderData<typeof loader>();
	if (DEBUG) console.log("[HOME ROUTE] Revalidated at:", revalidatedAt);

	invariant(
		typeof content === "object",
		"HomeRoute: content must be an object",
	);
	invariant(Array.isArray(projects), "HomeRoute: projects must be an array");

	const typedContent = content as unknown as Record<string, string>;

	const order = ["hero", "services", "projects", "about", "contact"];

	invariant(Array.isArray(order), "HomeRoute: order must be an array");
	invariant(
		order.every((id) => typeof id === "string"),
		"HomeRoute: all order ids must be strings",
	);

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
		contact: <ContactUs key="contact" content={typedContent} />,
	};

	invariant(
		typeof sectionBlocks === "object",
		"HomeRoute: sectionBlocks must be an object",
	);

	return (
		<div className="bg-linear-180/oklch from-0% from-gray-600/0 via-20% via-80% via-gray-600/10 to-100% to-gray-600/0">
			<Header />
			{order.map((id) => sectionBlocks[id])}
			<Footer />
		</div>
	);
}
