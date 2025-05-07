import React from "react";
import { Link, useLoaderData, data } from "react-router";
import type { Project } from "~/database/schema";
import ConditionalRichTextRenderer from "~/routes/common/components/ConditionalRichTextRenderer";
import { FadeIn } from "~/routes/common/components/ui/FadeIn";
import { getProjectById } from "~/routes/common/db";
// Import generated Route type
import type { Route } from "./+types/[projectId]";

// Loader using the generated type for params and context
export const loader = async ({ params, context }: Route.LoaderArgs) => {
	const projectId = Number(params.projectId);

	if (Number.isNaN(projectId)) {
		throw data({ message: "Invalid Project ID" }, { status: 400 });
	}

	try {
		const project = await getProjectById(context.db, projectId);
		if (!project) {
			throw data({ message: "Project not found" }, { status: 404 });
		}
		// Return directly without the data helper
		return { project };
	} catch (error: any) {
		console.error("Error loading project details:", error);
		// Return error data directly
		throw data(
			{ message: error.message || "Failed to load project details" },
			{ status: 500 },
		);
	}
};

export function ProjectDetailRoute() {
	// Use type inference with the loader function
	// Error and !project cases are now handled by ErrorBoundary if loader throws
	const { project } = useLoaderData<typeof loader>();

	// The loader now guarantees that 'project' is available if no error was thrown.
	// Error cases (including not found) are handled by the ErrorBoundary.
	return (
		<div className="py-16 bg-white">
			<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
				<FadeIn>
					<article className="bg-gray-50 p-6 rounded-lg shadow-md">
						<img
							src={project.imageUrl ?? "/assets/placeholder.png"}
							alt={project.title}
							className="w-full h-64 md:h-96 object-cover rounded-md mb-6 bg-gray-200"
						/>
						<h2 className="text-3xl font-serif font-bold text-black mb-4">
							{project.title}
						</h2>
						<ConditionalRichTextRenderer
							text={project.description}
							fallbackClassName="text-gray-700 text-lg mb-4"
							fallbackTag="p"
						/>
						{project.details && (
							<div className="prose prose-sm mt-4 mb-6">
								<h3 className="font-semibold text-gray-800">Details:</h3>
								<ConditionalRichTextRenderer
									text={project.details}
									fallbackClassName="text-gray-600"
									fallbackTag="div" // Use div if details might contain multiple paragraphs
								/>
							</div>
						)}
						<p className="text-gray-500 italic mb-6">
							Contact us for more information about similar projects.
						</p>
						<Link
							to="/projects"
							className="inline-block text-blue-600 hover:underline"
						>
							← Back to Projects
						</Link>
					</article>
				</FadeIn>
			</div>
		</div>
	);
}

// Default export for backwards compatibility
export default ProjectDetailRoute;
