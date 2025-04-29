import React from "react";
import type { Route } from "./+types/detail";
import { data, Link, useLoaderData, useOutletContext } from "react-router";
import { getProjectById } from "~/db";

import { FadeIn } from "~/modules/common/components/ui/FadeIn";
import type { Project } from "~/database/schema"; // Import FadeIn

// Define the type for the context passed from the parent route
type ProjectsContext = {
  content: { [key: string]: string } | undefined;
};

// Loader to fetch the specific project by ID
export async function loader({ params, context }: Route.LoaderArgs) {
  const projectId = params.projectId
    ? Number.parseInt(params.projectId, 10)
    : Number.NaN;

  if (isNaN(projectId)) {
    return data(
      { project: null, error: "Invalid Project ID" },
      { status: 400 }
    );
  }

  try {
    const project = await getProjectById(context.db, projectId);
    if (!project) {
      return data(
        { project: null, error: "Project not found" },
        { status: 404 }
      );
    }
    return data({ project, error: undefined });
  } catch {
    return data(
      { project: null, error: "Failed to load project details" },
      { status: 500 }
    );
  }
}

export default function ProjectDetail(_props: Route.ComponentProps) {
  // Get the content data from the parent route (optional, could be used for general text)
  const outletContext = useOutletContext<ProjectsContext>();
  const content = outletContext?.content; // Handle potential undefined context

  // Get project data and error from the loader
  const { project, error } = useLoaderData<typeof loader>();

  // Handle loader errors
  if (error && !project) {
    return (
      <div className="py-16 bg-white text-center">
        <h2 className="text-2xl font-semibold text-red-700 mb-4">
          Error Loading Project
        </h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link
          to="/projects"
          className="inline-block text-blue-600 hover:underline"
        >
          ← Back to Projects
        </Link>
      </div>
    );
  }

  // Handle case where project is somehow null/undefined even without error (defensive)
  if (!project) {
    return (
      <div className="py-16 bg-white text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Project Not Found
        </h2>
        <p className="text-gray-500 mb-6">
          The project data could not be loaded.
        </p>
        <Link
          to="/projects"
          className="inline-block text-blue-600 hover:underline"
        >
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="py-16 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <article className="bg-gray-50 p-6 rounded-lg shadow-md">
            {/* Use project.imageUrl, provide fallback */}
            <img
              src={project.imageUrl ?? "/assets/placeholder.png"} // Add a placeholder image path
              alt={project.title}
              className="w-full h-64 md:h-96 object-cover rounded-md mb-6 bg-gray-200" // Add bg color for missing images
            />
            <h2 className="text-3xl font-serif font-bold text-black mb-4">
              {project.title}
            </h2>
            <p className="text-gray-700 text-lg mb-4">
              {project.description ?? "No description provided."}{" "}
              {/* Fallback text */}
            </p>
            {project.details && (
              <p className="text-gray-600 text-sm mb-6">
                <strong>Details:</strong> {project.details}
              </p>
            )}
            {/* Optional: Use content from context for generic text */}
            <p className="text-gray-500 italic mb-6">
              {content?.project_detail_footer ??
                "Contact us for more information about similar projects."}
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
