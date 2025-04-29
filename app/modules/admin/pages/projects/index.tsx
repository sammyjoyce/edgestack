import React from "react";
import {
  data,
  Link,
  Form,
  useLoaderData,
} from "react-router";
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

export default function AdminProjectsIndex(): JSX.Element {
  const { projects, error } = useLoaderData<typeof loader>();

  return (
    <FadeIn>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Manage Projects
        </h1>
        <Button as={Link} to="new">
          Add New Project
        </Button>
      </div>

      {error && (
        <div
          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
          role="alert"
        >
          {error}
        </div>
      )}

      {projects.length === 0 && !error ? (
        <p className="text-gray-500">
          No projects found. Add your first project!
        </p>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {projects.map((project: Project) => (
              <li
                key={project.id}
                className="px-4 py-4 sm:px-6 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`${project.id}/edit`}
                      className="text-lg font-medium text-blue-600 truncate hover:underline"
                    >
                      {project.title}
                    </Link>
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {project.description || "No description"}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                    <Button
                      as={Link}
                      to={`${project.id}/edit`}
                      className="text-sm"
                    >
                      Edit
                    </Button>
                    {/* Delete button will likely need a form/fetcher */}
                    <Form method="post" action={`${project.id}/delete`} replace>
                      <Button
                        type="submit"
                        className="text-sm bg-red-600 hover:bg-red-700"
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
