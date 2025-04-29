import React from "react";
import {
  data,
  Form,
  Link,
  redirect,
  useActionData,
  useLoaderData,
  useParams,
} from "react-router";
import type { Route } from "./+types/edit";
import { Button } from "~/modules/common/components/ui/Button";
import { FadeIn } from "~/modules/common/components/ui/FadeIn";
import { validateProjectInsert } from "~/database/valibot-validation";
import { getProjectById, updateProject } from "~/db";
import { getSessionCookie, verify } from "~/modules/common/utils/auth";
import type { NewProject, Project } from "~/database/schema";

// Loader to fetch the project data for editing
export async function loader({ request, params, context }: Route.LoaderArgs) {
  const sessionValue = getSessionCookie(request);
  if (
    !sessionValue ||
    !context.JWT_SECRET ||
    !(await verify(sessionValue, context.JWT_SECRET))
  ) {
    return data({ error: "Unauthorized", project: undefined }, { status: 401 });
  }

  const projectId = params.projectId
    ? Number.parseInt(params.projectId, 10)
    : Number.NaN;
  if (isNaN(projectId)) {
    return data(
      { error: "Invalid Project ID", project: undefined },
      { status: 400 }
    );
  }

  try {
    const project = await getProjectById(context.db, projectId);
    if (!project) {
      return data(
        { error: "Project not found", project: undefined },
        { status: 404 }
      );
    }
    return data({ project });
  } catch (error) {
    return data(
      { error: "Failed to load project data", project: undefined },
      { status: 500 }
    );
  }
}

// Action to handle updating the project
export async function action({ request, params, context }: Route.ActionArgs) {
  const sessionValue = getSessionCookie(request);
  if (
    !sessionValue ||
    !context.JWT_SECRET ||
    !(await verify(sessionValue, context.JWT_SECRET))
  ) {
    return data({ error: "Unauthorized", project: undefined }, { status: 401 });
  }

  const projectId = params.projectId
    ? Number.parseInt(params.projectId, 10)
    : Number.NaN;
  if (isNaN(projectId)) {
    return data(
      { error: "Invalid Project ID", project: undefined },
      { status: 400 }
    );
  }

  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const details = formData.get("details");
    const isFeatured = formData.get("isFeatured") === "true"; // Convert checkbox value
    const sortOrderRaw = formData.get("sortOrder");
    let sortOrder: number | undefined = undefined;
    if (typeof sortOrderRaw === "string" && sortOrderRaw.trim() !== "") {
      sortOrder = Number.parseInt(sortOrderRaw, 10);
      if (isNaN(sortOrder)) sortOrder = undefined;
    }

    // Handle image upload
    let imageUrl: string | undefined = undefined;
    const imageFile = formData.get("image");
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      // Reuse /admin/upload logic inline (could be extracted)
      const uniqueFilename = `${Date.now()}-${imageFile.name.replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      )}`;
      const fileData = await imageFile.arrayBuffer();
      if (context.ASSETS_BUCKET) {
        await context.ASSETS_BUCKET.put(uniqueFilename, fileData, {
          httpMetadata: { contentType: imageFile.type },
        });
        imageUrl = context.PUBLIC_R2_URL
          ? `${context.PUBLIC_R2_URL.replace(/\/?$/, "/")}${uniqueFilename}`
          : `/assets/${uniqueFilename}`;
      }
    }

    if (typeof title !== "string" || title.trim() === "") {
      // Need to reload project data for the form if validation fails
      const project = await getProjectById(context.db, projectId);
      return data({ error: "Title is required.", project }, { status: 400 });
    }

    // Fetch the original project to ensure we validate a full object, not a partial
    const originalProject = await getProjectById(context.db, projectId);
    if (!originalProject) {
      return data(
        { error: "Project not found for update.", project: undefined },
        { status: 404 }
      );
    }
    const updatedProjectData: Partial<NewProject> = {
      title: title.trim(),
      description:
        typeof description === "string"
          ? description.trim()
          : originalProject.description,
      details:
        typeof details === "string" ? details.trim() : originalProject.details,
      isFeatured,
      sortOrder:
        typeof sortOrder === "number" ? sortOrder : originalProject.sortOrder,
      ...(imageUrl ? { imageUrl } : { imageUrl: originalProject.imageUrl }),
    };

    // Merge with original to create a fully populated object for validation
    const fullProjectForValidation = {
      ...originalProject,
      ...updatedProjectData,
    };
    // Remove fields not in insert schema (id, createdAt, updatedAt)
    const { id, createdAt, updatedAt, ...projectInsertObj } =
      fullProjectForValidation;

    // Validate the full project object using Valibot
    // This is necessary because valibot's insert schema expects all required fields
    try {
      validateProjectInsert(projectInsertObj);
    } catch (e: any) {
      return data(
        {
          error: `Validation failed for project update: ${e.message || e}`,
          project: originalProject,
        },
        { status: 400 }
      );
    }
    const updatedProject = await updateProject(
      context.db,
      projectId,
      updatedProjectData
    );

    if (!updatedProject) {
      const project = await getProjectById(context.db, projectId);
      return data(
        { error: "Failed to update project.", project },
        { status: 500 }
      );
    }

    // Redirect back to the project list after successful update
    return redirect("/admin/projects");
  } catch (error: any) {
    // Need to reload project data for the form if update fails
    const project = await getProjectById(context.db, projectId);
    return data(
      { error: "Failed to update project.", project },
      { status: 500 }
    );
  }
}

// Component to render the "Edit Project" form
export default function AdminEditProject(_props: Route.ComponentProps): JSX.Element {
  // Use loader data for initial form values, action data for errors
  const { project, error: loaderError } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>(); // Matches action's possible return shape
  const params = useParams();

  // Use project data from actionData if available (e.g., validation error), otherwise use loaderData
  const currentProject = actionData?.project || project;
  const currentError = actionData?.error || loaderError;

  if (!currentProject && !currentError) {
    return <p>Loading project data...</p>; // Or a spinner
  }

  if (currentError && !currentProject) {
    return (
      <FadeIn>
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Edit Project
        </h1>
        <div
          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
          role="alert"
        >
          Error: {currentError}
        </div>
        <Link to="/admin/projects" className="text-blue-600 hover:underline">
          ← Back to Projects
        </Link>
      </FadeIn>
    );
  }

  if (!currentProject) {
    // Should be caught by loader 404, but handle defensively
    return <p>Project not found.</p>;
  }

  return (
    <FadeIn>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Edit Project: {currentProject.title}
      </h1>

      {currentError && (
        <div
          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
          role="alert"
        >
          {currentError}
        </div>
      )}

      <Form method="post" className="bg-white shadow rounded-lg p-6 space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Project Title <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            defaultValue={currentProject.title}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            defaultValue={currentProject.description ?? ""}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="details"
            className="block text-sm font-medium text-gray-700"
          >
            Details (e.g., Location, Duration, Budget)
          </label>
          <input
            type="text"
            name="details"
            id="details"
            defaultValue={currentProject.details ?? ""}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isFeatured"
            id="isFeatured"
            value="true" // Send "true" when checked
            defaultChecked={currentProject.isFeatured ?? false}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="isFeatured"
            className="ml-2 block text-sm text-gray-900"
          >
            Feature on Home Page
          </label>
        </div>

        {/* Display current image if available */}
        {currentProject.imageUrl && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Current Image
            </label>
            <img
              src={currentProject.imageUrl}
              alt="Current project image"
              className="mt-1 max-w-xs h-auto rounded border"
            />
          </div>
        )}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Replace Image (Optional)
          </label>
          <input
            type="file"
            name="image"
            id="image"
            accept="image/*"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="sortOrder"
            className="block text-sm font-medium text-gray-700"
          >
            Sort Order (lower numbers appear first)
          </label>
          <input
            type="number"
            name="sortOrder"
            id="sortOrder"
            min="0"
            defaultValue={currentProject.sortOrder ?? 0}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            as={Link}
            to="/admin/projects"
            className="bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </Form>
    </FadeIn>
  );
}
