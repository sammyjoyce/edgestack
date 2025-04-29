import React from "react";
import { data, Form, Link, redirect } from "react-router";
import type { Route } from "./+types/edit";
import { Button } from "~/modules/common/components/ui/Button";
import { FadeIn } from "~/modules/common/components/ui/FadeIn";
import { validateProjectInsert } from "~/database/valibot-validation";
import { getProjectById, updateProject } from "~/db";
import { getSessionCookie, verify } from "~/modules/common/utils/auth";
import type { NewProject, Project } from "~/database/schema";
import { handleImageUpload } from "~/utils/upload.server"; // Import the helper

// Loader to fetch the project data for editing
export async function loader({ request, params, context }: Route.LoaderArgs) {
  const sessionValue = getSessionCookie(request);
  const jwtSecret = context.cloudflare?.env?.JWT_SECRET;
  if (!sessionValue || !jwtSecret || !(await verify(sessionValue, jwtSecret))) {
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
  const jwtSecret = context.cloudflare?.env?.JWT_SECRET;
  if (!sessionValue || !jwtSecret || !(await verify(sessionValue, jwtSecret))) {
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

    // Use the helper function for upload if a file exists
    let imageUrl: string | undefined = undefined;
    const imageFile = formData.get("image");
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      try {
        // Use project ID or title in the key for context if desired
        imageUrl = await handleImageUpload(
          imageFile,
          `project-${projectId}-image`,
          context
        ); // Pass context directly
      } catch (uploadError: any) {
        // Handle upload error specifically, maybe return to form with error
        const project = await getProjectById(context.db, projectId);
        return data({ error: uploadError.message, project }, { status: 500 });
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
export default function AdminEditProject({
  loaderData,
  actionData,
}: Route.ComponentProps): React.ReactElement {
  // Use React.ReactElement
  // Use loader data for initial form values, action data for errors
  // Use optional chaining for loaderError as it might not exist on the loaderData type union
  const { project } = loaderData ?? {};
  const loaderError = loaderData?.error;
  const { project: actionProject, error: actionError } = actionData ?? {};

  // Use project data from actionData if available (e.g., validation error), otherwise use loaderData
  const currentProject = actionProject || project;
  const currentError = actionError || loaderError;

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
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        {" "}
        {/* Use gray-900, increased margin */}
        Edit Project: {currentProject.title}
      </h1>

      {currentError && (
        <div
          className="p-4 mb-6 text-sm text-red-700 rounded-lg bg-red-100 border border-red-200" /* Adjusted colors/spacing */
          role="alert"
        >
          {currentError}
        </div>
      )}

      <Form
        method="post"
        encType="multipart/form-data"
        className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 space-y-6"
      >
        {" "}
        {/* Added encType, adjusted shadow/border, increased spacing */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1" /* Added margin */
          >
            Project Title <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            defaultValue={currentProject.title}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" /* Use text-sm */
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1" /* Added margin */
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            defaultValue={currentProject.description ?? ""}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" /* Use text-sm */
          />
        </div>
        <div>
          <label
            htmlFor="details"
            className="block text-sm font-medium text-gray-700 mb-1" /* Added margin */
          >
            Details (e.g., Location, Duration, Budget)
          </label>
          <input
            type="text"
            name="details"
            id="details"
            defaultValue={currentProject.details ?? ""}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" /* Use text-sm */
          />
        </div>
        <div className="flex items-center gap-2">
          {" "}
          {/* Added gap */}
          <input
            type="checkbox"
            name="isFeatured"
            id="isFeatured"
            value="true"
            defaultChecked={currentProject.isFeatured ?? false}
            className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="isFeatured"
            className="block text-sm font-medium text-gray-700" /* Use font-medium */
          >
            Feature on Home Page
          </label>
        </div>
        {/* Display current image if available */}
        {currentProject.imageUrl && (
          <div className="mt-2">
            {" "}
            {/* Reduced top margin */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {" "}
              {/* Added margin */}
              Current Image
            </label>
            <img
              src={currentProject.imageUrl}
              alt="Current project image"
              className="max-w-xs h-auto rounded border border-gray-200" /* Added border color */
            />
          </div>
        )}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-1" /* Added margin */
          >
            Replace Image (Optional)
          </label>
          <input
            type="file"
            name="image"
            id="image"
            accept="image/*"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" /* Adjusted file input style */
          />
        </div>
        <div>
          <label
            htmlFor="sortOrder"
            className="block text-sm font-medium text-gray-700 mb-1" /* Added margin */
          >
            Sort Order (lower numbers appear first)
          </label>
          <input
            type="number"
            name="sortOrder"
            id="sortOrder"
            min="0"
            defaultValue={currentProject.sortOrder ?? 0}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" /* Use text-sm */
          />
        </div>
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          {" "}
          {/* Increased top padding, added border */}
          <Button
            as={Link}
            to="/admin/projects"
            className="bg-gray-100 text-gray-700 hover:bg-gray-200" /* Lighter cancel button */
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {" "}
            {/* Explicit primary button style */}
            Save Changes
          </Button>
        </div>
      </Form>
    </FadeIn>
  );
}
