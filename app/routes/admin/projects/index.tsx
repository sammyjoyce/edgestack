import React from "react";
import { useLoaderData, Link } from "react-router-dom";
import { data } from "react-router"; // Assuming 'data' is the correct helper
import type { LoaderFunctionArgs } from "react-router";
import { getAllProjects } from "../../../db/index";
import type { Project } from "../../../../database/schema";
import { getSessionCookie, verify } from "../../../utils/auth";
import { Button } from "../../../components/ui/Button";
import { FadeIn } from "../../../components/ui/FadeIn";

// Define CloudflareEnv type based on context usage elsewhere
interface CloudflareEnv {
  JWT_SECRET: string;
  db: any; // Use 'any' for now, or import AppLoadContext if available
}

// Loader to fetch all projects
export async function loader({ request, context }: LoaderFunctionArgs & { context: CloudflareEnv }) {
  const sessionValue = getSessionCookie(request);
  if (!sessionValue || !context.JWT_SECRET || !(await verify(sessionValue, context.JWT_SECRET))) {
    // Use data helper for consistency
    return data({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const projects = await getAllProjects(context.db);
    return data({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return data({ projects: [], error: "Failed to load projects" }, { status: 500 });
  }
}

export default function AdminProjectsIndex() {
  const { projects, error } = useLoaderData<{ projects: Project[], error?: string }>();

  return (
    <FadeIn>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Projects</h1>
        <Button as={Link} to="new">
          Add New Project
        </Button>
      </div>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
          {error}
        </div>
      )}

      {projects.length === 0 && !error ? (
        <p className="text-gray-500">No projects found. Add your first project!</p>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {projects.map((project) => (
              <li key={project.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <Link to={`${project.id}/edit`} className="text-lg font-medium text-blue-600 truncate hover:underline">
                      {project.title}
                    </Link>
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {project.description || "No description"}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                    <Button as={Link} to={`${project.id}/edit`} className="text-sm">
                      Edit
                    </Button>
                    {/* Delete button will likely need a form/fetcher */}
                    <Button as={Link} to={`${project.id}/delete`} className="text-sm bg-red-600 hover:bg-red-700">
                      Delete
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </FadeIn>
  );
}
