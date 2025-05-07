import { type MetaFunction, Outlet, data, useLoaderData } from "react-router";

import type { Project } from "~/database/schema";
import type { Route } from "./+types/route";
import Footer from "~/routes/common/components/Footer";
import Header from "~/routes/common/components/Header";
import { getAllContent, getAllProjects } from "~/routes/common/db";

export const meta: MetaFunction = () => {
	return [
		{ title: "Projects | Lush Constructions" },
		{
			name: "description",
			content: "Explore our recent construction and renovation projects",
		},
	];
};

// Loader to fetch dynamic content from D1
// The loader should return the data type, React Router handles the Response wrapping
export const loader = async ({ context }: Route.LoaderArgs) => {
	try {
		const content = await getAllContent(context.db);
		const projects = await getAllProjects(context.db);
		// Return plain object
		return { content, projects };
	} catch (error) {
		console.error("Failed to fetch content or projects:", error);
		// Return plain object for error
		return {
			content: {} as Record<string, string>,
			projects: [] as Project[],
			error: "Failed to load projects data", // Add error field if needed
		};
		// Consider throwing a response for errors to be caught by an ErrorBoundary
		// throw new Response("Failed to load projects data", { status: 500 });
	}
};

export default function Projects() {
	const { content, projects, error } = useLoaderData<typeof loader>();

	if (error) {
		// Handle error display, or let an ErrorBoundary catch it if thrown
		return <div>Error loading projects: {error}</div>;
	}

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

			{/* Outlet renders the child route */}
			{/* Pass projects to Outlet context */}
			<Outlet context={{ content, projects }} />

			<Footer />
		</div>
	);
}
