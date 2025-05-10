import React from "react"; 
import { type MetaFunction, Outlet, data, useLoaderData } from "react-router";
import type { Project } from "~/database/schema";
import Footer from "~/routes/common/components/Footer";
import Header from "~/routes/common/components/Header";
import { getAllContent, getAllProjects } from "~/routes/common/db";
import type { Route } from "./+types/route";
export const meta: MetaFunction = () => {
	return [
		{ title: "Projects | Lush Constructions" },
		{
			name: "description",
			content: "Explore our recent construction and renovation projects",
		},
	];
};
export const loader = async ({ context }: Route.LoaderArgs) => {
	try {
		const content = await getAllContent(context.db);
		const projects = await getAllProjects(context.db);
		return { content, projects };
	} catch (error) {
		console.error("Failed to fetch content or projects:", error);
		throw data({ message: "Failed to load projects data" }, { status: 500 });
	}
};
export default function Projects() {
	const { content, projects } = useLoaderData<typeof loader>();
	return (
		<div className="bg-linear-180/oklch from-0% from-gray-600/0 via-20% via-80% via-gray-600/10 to-100% to-gray-600/0">
			<Header />
			<div className="bg-white pt-20 pb-10">
				<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
					<h1 className="mb-4 text-center font-bold font-serif text-4xl text-black">
						Our Projects
					</h1>
					<p className="mx-auto max-w-3xl text-center text-gray-700 text-xl">
						{content?.projects_page_intro ??
							"Explore our portfolio of completed projects, showcasing our commitment to quality craftsmanship and attention to detail."}
					</p>
				</div>
			</div>
			<Outlet context={{ content, projects }} />
			<Footer />
		</div>
	);
}
