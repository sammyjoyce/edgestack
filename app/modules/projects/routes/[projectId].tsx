import React from "react";
import { data, Link, useLoaderData } from "react-router";
import { FadeIn } from "~/modules/common/components/ui/FadeIn";
import { getProjectById } from "app/modules/common/db";
import type { Project } from "~/database/schema";
import type { Route } from "../+types/detail";

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

export function ProjectDetailRoute() {
  // Get project data and error from the loader
  const { project, error } = useLoaderData<{
    project: Project | null;
    error: string | undefined;
  }>();

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
