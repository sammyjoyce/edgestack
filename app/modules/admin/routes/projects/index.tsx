import React from "react";
import { data, Link, Form, useLoaderData } from "react-router";
import { Button } from "~/modules/common/components/ui/Button";
import type { Project } from "~/database/schema";
// Import generated types for this specific route
import type {
  Route, // Use generated Route type
  LoaderData,
  ActionData,
} from "../../../../.react-router/types/app/modules/admin/routes/projects/index";

// Add a properly scoped action to handle project management
export async function action({
  request,
  context,
}: Route.ActionArgs): Promise<TypedResponse<ActionData>> { // Use generated Route.ActionArgs
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  // Ensure the user is authenticated (redundant with layout loader but good practice)
  // Ensure shape matches ActionData
  const unauthorized = () =>
    data({ success: false, error: "Unauthorized" } satisfies ActionData, {
      status: 401,
    });

  // Handle delete project intent
  if (intent === "deleteProject") {
    const projectId = formData.get("projectId") as string;
    if (!projectId) {
      // Ensure shape matches ActionData
      return data(
        { success: false, error: "Missing project ID" } satisfies ActionData,
        { status: 400 }
      );
    }

    try {
      // Implement project deletion logic here
      console.log(`Deleting project ${projectId}`);
      // Ensure shape matches ActionData
      return data({ success: true, projectId } satisfies ActionData);
    } catch (error) {
      console.error("Failed to delete project:", error);
      // Ensure shape matches ActionData
      return data(
        { success: false, error: "Failed to delete project" } satisfies ActionData,
        { status: 500 }
      );
  // Ensure shape matches ActionData
  return data({ success: false, error: "Unknown intent" } satisfies ActionData, {
    status: 400,
  });
}

export function ProjectsIndexRoute() {
  // Use generated LoaderData type with hook generic
  const { projects, error } = useLoaderData<LoaderData>();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Manage Projects
        </h1>
        <Button as={Link} to="/admin/projects/new" className="text-sm">
          Add New Project
        </Button>
      </div>

      {error && (
        <div
          className="p-4 mb-6 text-sm text-red-700 rounded-lg bg-red-100 border border-red-200"
          role="alert"
        >
          {error}
        </div>
      )}

      {projects.length === 0 && !error ? (
        <p className="text-base text-gray-600">
          No projects found. Add your first project!
        </p>
      ) : (
        <div className="bg-white shadow-sm border border-gray-200 overflow-hidden rounded-lg">
          <ul role="list" className="divide-y divide-gray-200">
            {projects.map((project: Project) => (
              <li
                key={project.id}
                className="px-6 py-5 hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <Link
                      to="/admin/projects/:projectId/edit"
                      params={{ projectId: String(project.id) }}
                      className="text-base font-semibold text-blue-600 truncate hover:underline"
                    >
                      {project.title}
                    </Link>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {project.description || "No description"}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex items-center space-x-3">
                    <Button
                      as={Link}
                      to="/admin/projects/:projectId/edit"
                      params={{ projectId: String(project.id) }}
                      className="text-xs px-3 py-1"
                    >
                      Edit
                    </Button>
                    <Form method="post" replace>
                      <input
                        type="hidden"
                        name="intent"
                        value="deleteProject"
                      />
                      <input
                        type="hidden"
                        name="projectId"
                        value={project.id}
                      />
                      <Button
                        type="submit"
                        className="text-xs px-3 py-1 bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete
                      </Button>
                    </Form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Default export for backwards compatibility
export default ProjectsIndexRoute;
