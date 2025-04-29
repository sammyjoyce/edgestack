import React from "react";
import { data, Link, Form } from "react-router";
import type { Route } from "./+types/index";

import { Button } from "~/modules/common/components/ui/Button";
import { FadeIn } from "~/modules/common/components/ui/FadeIn";
import { getAllProjects } from "~/db";
import { getSessionCookie, verify } from "~/modules/common/utils/auth";
import type { Project } from "~/database/schema";

export async function loader({ request, context }: Route.LoaderArgs) {
  const unauthorized = () =>
    data({ projects: [], error: "Unauthorized" }, { status: 401 });

  const sessionValue = getSessionCookie(request);
  if (
    !sessionValue ||
    !context.JWT_SECRET ||
    !(await verify(sessionValue, context.JWT_SECRET))
  ) {
    return unauthorized();
  }
  try {
    const projects = await getAllProjects(context.db);
    return data({ projects, error: undefined });
  } catch (error) {
    return data(
      { projects: [], error: "Failed to load projects" },
      { status: 500 }
    );
  }
}

export default function AdminProjectsIndex({
  loaderData,
}: Route.ComponentProps): JSX.Element {
  const { projects, error } = loaderData;

  return (
    <FadeIn>
      <div className="flex justify-between items-center mb-8">
        {" "}
        {/* Increased bottom margin */}
        <h1 className="text-2xl font-semibold text-gray-900">
          {" "}
          {/* Use text-gray-900 */}
          Manage Projects
        </h1>
        <Button as={Link} to="new" className="text-sm">
          {" "}
          {/* Ensure button text size */}
          Add New Project
        </Button>
      </div>

      {error && (
        <div
          className="p-4 mb-6 text-sm text-red-700 rounded-lg bg-red-100 border border-red-200" /* Adjusted colors/spacing */
          role="alert"
        >
          {error}
        </div>
      )}

      {projects.length === 0 && !error ? (
        <p className="text-base text-gray-600">
          {" "}
          {/* Use text-base and gray-600 */}
          No projects found. Add your first project!
        </p>
      ) : (
        <div className="bg-white shadow-sm border border-gray-200 overflow-hidden rounded-lg">
          {" "}
          {/* Adjusted shadow/border */}
          <ul role="list" className="divide-y divide-gray-200">
            {projects.map((project: Project) => (
              <li
                key={project.id}
                className="px-6 py-5 hover:bg-gray-50 transition-colors duration-150" /* Increased padding */
              >
                <div className="flex items-center justify-between gap-4">
                  {" "}
                  {/* Added gap */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`${project.id}/edit`}
                      className="text-base font-semibold text-blue-600 truncate hover:underline" /* Use text-base font-semibold */
                    >
                      {project.title}
                    </Link>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {" "}
                      {/* Use gray-600 */}
                      {project.description || "No description"}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex items-center space-x-3">
                    {" "}
                    {/* Increased space */}
                    <Button
                      as={Link}
                      to={`${project.id}/edit`}
                      className="text-xs px-3 py-1" /* Smaller button */
                    >
                      Edit
                    </Button>
                    <Form method="post" action={`${project.id}/delete`} replace>
                      <Button
                        type="submit"
                        className="text-xs px-3 py-1 bg-red-600 text-white hover:bg-red-700" /* Smaller button */
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
    </FadeIn>
  );
}
