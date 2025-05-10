import React, { type JSX } from "react";
import { type MetaFunction, useOutletContext } from "react-router";
const DEBUG = process.env.NODE_ENV !== "production";
import { assert } from "~/routes/common/utils/assert";
import RecentProjects from "~/routes/common/components/RecentProjects";
import type { loader as parentLayoutLoader } from "~/routes/home/views/_layout";
import AboutUs from "../components/AboutUs";
import ContactUs from "../components/ContactUs";
import Hero from "../components/Hero";
import OurServices from "../components/OurServices";
export const meta: MetaFunction<
	never,
	{ "routes/home/views/_layout": typeof parentLayoutLoader }
> = ({ matches }) => {
	const parentLayoutMatch = matches.find(
		(match) => match?.id === "routes/home/views/_layout",
	);
	const parentLayoutData = parentLayoutMatch?.data as
		| Awaited<ReturnType<typeof parentLayoutLoader>>
		| undefined;
	const c = parentLayoutData?.content ?? {};
	const pageTitle = c.meta_title ?? "Lush Constructions";
	const pageDescription =
		c.meta_description ??
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
	const { content: rawContent, projects = [] } =
		useOutletContext<Awaited<ReturnType<typeof parentLayoutLoader>>>();
	const content = (rawContent ?? {}) as Record<string, string>;
	assert(typeof content === "object", "HomeRoute: content must be an object");
	assert(Array.isArray(projects), "HomeRoute: projects must be an array");
	if (DEBUG)
		console.log(
			"[HOME ROUTE] Rendering with content keys:",
			Object.keys(content),
		);
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
	const DEFAULT_ORDER = ["hero", "services", "projects", "about", "contact"];
	const orderString = content.home_sections_order as string | undefined;
	const order = orderString
		? orderString.split(",").filter((id) => id in sectionBlocks)
		: DEFAULT_ORDER;
	assert(Array.isArray(order), "HomeRoute: order must be an array");
	assert(
		order.every((id) => typeof id === "string"),
		"HomeRoute: all order ids must be strings",
	);
	return <>{order.map((id) => sectionBlocks[id])}</>;
}
export default HomeRoute;
