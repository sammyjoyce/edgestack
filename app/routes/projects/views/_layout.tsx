import { Outlet, data, useLoaderData } from "react-router";
import type { Project } from "~/database/schema";
import Footer from "~/routes/common/components/Footer";
import Header from "~/routes/common/components/Header";
import { ProjectsErrorBoundary } from "../components/ProjectsErrorBoundary";
// Removed duplicate import

// Loader with generated type safety
type ProjectsLayoutLoaderData = {
	content: Record<string, string>;
	projects: Project[];
	error?: string;
};

export const loader = async ({ context }: any) => {
	// Adjusted type for LoaderArgs
	try {
		const { getAllContent, getAllProjects } = await import(
			"~/routes/common/db"
		);
		const content = await getAllContent(context.db);
		const projects = await getAllProjects(context.db);
		// Return data directly without helper for clearer typing
		return { content, projects };
	} catch (error: any) {
		console.error("Failed to fetch content or projects:", error);
		// Throw data response for error handling by ErrorBoundary
		throw data(
			{ message: error.message || "Failed to load projects layout data" },
			{ status: 500 },
		);
	}
};

export function ProjectsLayout() {
	// Use type inference with the loader function
	const loaderData = useLoaderData<typeof loader>();

	return (
		<div className="bg-linear-180/oklch from-0% from-gray-600/0 via-20% via-80% via-gray-600/10 to-100% to-gray-600/0">
			<Header />

			<div className="bg-white pt-20 pb-10">
				<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
					<h1 className="mb-4 text-center font-bold font-serif text-4xl text-black">
						Our Projects
					</h1>
					<p className="mx-auto max-w-3xl text-center text-gray-700 text-xl">
						{loaderData.content.projects_page_intro ??
							"Explore our portfolio of completed projects, showcasing our commitment to quality craftsmanship and attention to detail."}
					</p>
				</div>
			</div>

			{/* Pass loader data explicitly to the Outlet context */}
			<Outlet context={loaderData} />

			<Footer />
		</div>
	);
}

export function ErrorBoundary() {
	return <ProjectsErrorBoundary />;
}

// Default export for backwards compatibility
export default ProjectsLayout;
