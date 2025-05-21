import type { JSX } from "react";
import type { MetaFunction } from "react-router";
import Footer from "~/routes/common/components/Footer";
import Header from "~/routes/common/components/Header";
import RecentProjects from "~/routes/common/components/RecentProjects";
import { assert } from "~/utils/assert";
import type { Project } from "../../../database/schema";
import type { Route } from "./+types/route";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import Hero from "./components/Hero";
import OurServices from "./components/OurServices";
import { extractServicesData, loadHomeData } from "./services";

const DEBUG = process.env.NODE_ENV !== "production";

export const meta: MetaFunction<typeof loader> = ({ data, matches }) => {
	const content = data?.content ?? {};
	const pageTitle = content.meta_title ?? "Your Company";
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

export async function loader({ request, context }: Route.LoaderArgs) {
	console.info(
		`[HOME LOADER START] Invoked at: ${new Date().toISOString()}, URL: ${request.url}`,
	);
	assert(request instanceof Request, "loader: request must be a Request");
	assert(context?.db, "loader: missing DB in context");
	const url = new URL(request.url);
	const revalidate = url.searchParams.get("revalidate") === "true";
	if (DEBUG) console.log("[HOME LOADER] Revalidation requested:", revalidate);
	let content: Record<string, string> = {};
	let projects: Project[] = [];
	try {
		({ content, projects } = await loadHomeData(context.db));
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
	assert(typeof content === "object", "loader: content must be an object");
	assert(Array.isArray(projects), "loader: projects must be an array");
	return {
		content,
		projects,
		revalidatedAt: revalidate ? Date.now() : undefined,
	};
}

export default function HomeRoute({
	loaderData,
}: Route.ComponentProps): JSX.Element {
	const { content, projects, revalidatedAt } = loaderData;
	if (DEBUG && revalidatedAt)
		console.log("[HOME ROUTE] Revalidated at:", revalidatedAt);
	assert(typeof content === "object", "HomeRoute: content must be an object");
	assert(Array.isArray(projects), "HomeRoute: projects must be an array");
	const typedContent = content as unknown as Record<string, string>;
	const sectionBlocks: Record<string, JSX.Element> = {
		...(typedContent.hero_title
			? {
					hero: (
						<Hero
							key="hero"
							title={typedContent.hero_title}
							subtitle={typedContent.hero_subtitle}
							image_url={typedContent.hero_image_url}
							theme={
								(typedContent.hero_title_theme as "light" | "dark") ?? "light"
							}
						/>
					),
				}
			: {}),
		...(typedContent.services_intro_title || typedContent.services_intro_text
			? {
					services: (
						<OurServices
							key="services"
							introTitle={typedContent.services_intro_title}
							introText={typedContent.services_intro_text}
							theme={
								(typedContent.services_intro_title_theme as "light" | "dark") ??
								"light"
							}
							servicesData={extractServicesData(typedContent)}
						/>
					),
				}
			: {}),
		// Only include the projects section if there are projects
		...(projects.length > 0
			? {
					projects: (
						<RecentProjects
							key="projects"
							introTitle={typedContent.projects_intro_title}
							introText={typedContent.projects_intro_text}
							projects={projects}
							theme={
								(typedContent.projects_intro_title_theme as "light" | "dark") ??
								"light"
							}
						/>
					),
				}
			: {}),
		...(typedContent.about_title ||
		typedContent.about_text ||
		typedContent.about_image_url
			? {
					about: (
						<AboutUs
							key="about"
							title={typedContent.about_title}
							text={typedContent.about_text}
							image_url={typedContent.about_image_url}
							theme={
								(typedContent.about_title_theme as "light" | "dark") ?? "light"
							}
						/>
					),
				}
			: {}),
		contact: (
			<ContactUs
				key="contact"
				content={typedContent}
				theme={
					(typedContent?.contact_title_theme as "light" | "dark") ?? "light"
				}
			/>
		),
	};
	assert(
		typeof sectionBlocks === "object",
		"HomeRoute: sectionBlocks must be an object",
	);
	const DEFAULT_ORDER = ["hero", "services", "projects", "about", "contact"];
	const orderString = typedContent?.home_sections_order as string | undefined;
	const order = orderString
		? orderString.split(",").filter((id) => id in sectionBlocks)
		: DEFAULT_ORDER.filter((id) => id in sectionBlocks);
	assert(Array.isArray(order), "HomeRoute: order must be an array");
	assert(
		order.every((id) => typeof id === "string"),
		"HomeRoute: all order ids must be strings",
	);
	return (
		<div className="bg-linear-180/oklch from-0% from-gray-600/0 via-20% via-80% via-gray-600/10 to-100% to-gray-600/0">
			<Header hasProjects={projects.length > 0} />
			{order.map((id) => sectionBlocks[id])}
			<Footer />
		</div>
	);
}
