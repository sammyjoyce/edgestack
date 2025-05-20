import type { Route } from "./+types/route";
import React from "react";
import { data, type MetaFunction, Outlet } from "react-router";
import Footer from "~/routes/common/components/Footer";
import Header from "~/routes/common/components/Header";
import { getAllContent, getAllProjects } from "~/routes/common/db";

export const meta: MetaFunction = () => {
       return [
               { title: "Projects" },
		{
			name: "description",
			content: "Explore our recent construction and renovation projects",
		},
	];
};
import { redirect } from "react-router";
export const loader = async ({
	context,
	request,
	params,
}: Route.LoaderArgs) => {
	try {
		const content = await getAllContent(context.db);
		const projects = await getAllProjects(context.db);
		if (!projects || projects.length === 0) {
			return redirect("/");
		}
		return { content, projects };
	} catch (error) {
		console.error("Failed to fetch content or projects:", error);
		throw data({ message: "Failed to load projects data" }, { status: 500 });
	}
};
export default function Projects({ loaderData }: Route.ComponentProps) {
	const { content, projects } = loaderData;
	return (
		<div className="bg-linear-180/oklch from-0% from-gray-600/0 via-20% via-80% via-gray-600/10 to-100% to-gray-600/0">
			<Header hasProjects={projects && projects.length > 0} />
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
