import {
	type LoaderFunction,
	type MetaFunction,
	Outlet,
	data,
} from "react-router";

import { getAllContent, getAllProjects } from "~/routes/common/db";
import type { Project } from "~/database/schema";
import Footer from "~/routes/common/components/Footer";
import Header from "~/routes/common/components/Header";

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
export const loader: LoaderFunction = async ({ context }) => {
	try {
		const content = await getAllContent(context.db);
		const projects = await getAllProjects(context.db);
		// Use data helper
		return data({ content, projects });
	} catch (error) {
		console.error("Failed to fetch content or projects:", error);
		// Use data helper for error
		return data(
			{
				content: {} as Record<string, string>,
				projects: [] as Project[],
				error: "Failed to load projects data", // Add error field if needed
			},
			{ status: 500 },
		);
	}
};

export default function Projects({ loaderData }: { loaderData: any }) {
	const { content, projects } = loaderData; // Destructure projects here

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