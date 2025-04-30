import React from "react";
import { data, Link, useLoaderData } from "react-router";
import { FadeIn } from "~/modules/common/components/ui/FadeIn";
import { getProjectById } from "app/modules/common/db";
import type { Project } from "~/database/schema";
// Import generated types
import type {
  Route, // Use generated Route type
  LoaderData,
  Params, // Params is automatically part of Route.LoaderArgs
} from "../../../.react-router/types/app/modules/projects/routes/[projectId]";
import { type TypedResponse } from "react-router"; // Import TypedResponse

// Loader to fetch the specific project by ID
export async function loader({
  params,
  context,
}: Route.LoaderArgs): Promise<TypedResponse<LoaderData>> { // Use generated Route.LoaderArgs
  // params is already typed
  const projectId = Number(params.projectId);

    // Ensure shape matches LoaderData
    return data(
      { project: null, error: "Invalid Project ID" } satisfies LoaderData,
      { status: 400 }
    );
  }

  try {
    const project = await getProjectById(context.db, projectId);
    if (!project) {
      // Ensure shape matches LoaderData
      return data(
        { project: null, error: "Project not found" } satisfies LoaderData,
        { status: 404 }
      );
    }
    // Ensure shape matches LoaderData
    return data({ project, error: undefined } satisfies LoaderData);
  } catch {
    // Ensure shape matches LoaderData
    return data(
      {
        project: null,
        error: "Failed to load project details",
      } satisfies LoaderData,
      { status: 500 }
    );
  }
}

export function ProjectDetailRoute() {
  // Get project data and error from the loader using generated type generic
  const { project, error } = useLoaderData<LoaderData>();

  // Handle loader errors
  if (error) { // Check for error first
    return (
      <div className="py-16 bg-white text-center">
        <h2 className="text-2xl font-semibold text-red-700 mb-4">
          Error Loading Project
        </h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link
          to="/projects" // Use typed path
          className="inline-block text-blue-600 hover:underline"
        >
          ← Back to Projects
        </Link>
      </div>
    );
  }

  // Handle case where project is null (valid state if not found, but loader returns 404)
  // This case might not be reachable if loader always throws or returns error data on failure.
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
          to="/projects" // Use typed path
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
            <img
              src={project.imageUrl ?? "/assets/placeholder.png"}
              alt={project.title}
              className="w-full h-64 md:h-96 object-cover rounded-md mb-6 bg-gray-200"
            />
            <h2 className="text-3xl font-serif font-bold text-black mb-4">
              {project.title}
            </h2>
            <p className="text-gray-700 text-lg mb-4">
              {project.description ?? "No description provided."}
            </p>
            {project.details && (
              <p className="text-gray-600 text-sm mb-6">
                <strong>Details:</strong> {project.details}
              </p>
            )}
            <p className="text-gray-500 italic mb-6">
              Contact us for more information about similar projects.
            </p>
            <Link
              to="/projects" // Use typed path
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
