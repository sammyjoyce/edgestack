import React from "react";
import { Form, redirect, data, useLoaderData, Link, type Response } from "react-router";
import { Button } from "~/modules/common/components/ui/Button";
import RichTextField from "~/modules/admin/components/RichTextField";
import { FadeIn } from "~/modules/common/components/ui/FadeIn";
import { getProjectById, updateProject } from "app/modules/common/db";
import { validateProjectUpdate } from "~/database/valibot-validation"; // Use update validation
import type { Project } from "~/database/schema";
import { handleImageUpload } from "~/utils/upload.server";
// Import generated types for this specific route
import type { Route } from "../../../../../.react-router/types/app/modules/admin/routes/projects/[projectId]/edit";

// Use inferred return type
export async function loader({ params, context }: Route.LoaderArgs) {
  const projectId = Number(params.projectId);

  if (isNaN(projectId)) {
    // Use data helper
    return data({ project: null, error: "Invalid Project ID" }, { status: 400 });
  }

  try {
    const project = await getProjectById(context.db, projectId);
    if (!project) {
      // Use data helper
      return data({ project: null, error: "Project not found" }, { status: 404 });
    }
    // Use data helper
    return data({ project });
  } catch (error) {
    console.error("Error fetching project:", error);
    // Use data helper
    return data({ project: null, error: "Failed to load project" }, { status: 500 });
  }
}

// Use inferred return type
export async function action({ request, params, context }: Route.ActionArgs) {
  const projectId = Number(params.projectId);

  if (isNaN(projectId)) {
    // Use data helper
    return data({ success: false, error: "Invalid Project ID" }, { status: 400 });
  }

  const formData = await request.formData();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const details = formData.get("details") as string;
  const isFeatured = formData.has("isFeatured");
  const sortOrder = parseInt(formData.get("sortOrder") as string, 10) || 0;

  // Handle file upload if present
  const imageFile = formData.get("image") as File;
  let imageUrl = formData.get("currentImageUrl") as string;

  try {
    // Process image upload if a new file was provided
    if (imageFile && imageFile.size > 0) {
      // Access bucket from context
      const env = context.cloudflare?.env;
      if (!env) {
        // Use data helper
        return data(
          { success: false, error: "Environment not available" },
          { status: 500 }
        );
      }

      try {
        // Generate a key based on project ID and timestamp
        const imageKey = `project-${projectId}-${Date.now()}`;

        // Pass the FormData file to the image upload handler with all required parameters
        // Use the original context - the handleImageUpload function just needs access to ASSETS_BUCKET
        // Use a type assertion to bypass TypeScript's type checking while maintaining runtime compatibility
        const uploadResult = await handleImageUpload(
          imageFile,
          imageKey,
          context as any
        );
        if (uploadResult && typeof uploadResult === "string") {
          imageUrl = uploadResult;
        } else {
          // Use data helper
          return data({ success: false, error: "Failed to upload image" }, { status: 400 });
        }
      } catch (error) {
        console.error("Image upload error:", error);
        // Use data helper
        return data({ success: false, error: "Failed to upload image" }, { status: 400 });
      }
    }

    if (!title) {
      // Use data helper
      return data({ success: false, error: "Title is required" }, { status: 400 });
    }

    // Validate and update the project
    const projectData = {
      title,
      description: description || "",
      details: details || "",
      imageUrl: imageUrl || null, // Use null if empty
      isFeatured,
      sortOrder,
    };

    // Use valibot validation for updates
    try {
      validateProjectUpdate(projectData);
    } catch (error: any) {
      // Use data helper for validation error
      return data(
        {
          success: false,
          error: error.message || "Validation failed",
        },
        { status: 400 }
      );
    }

    // Update the project in the database
    await updateProject(context.db, projectId, projectData);

    // Redirect to projects list after successful update
    return redirect("/admin/projects");
  } catch (error: any) {
    console.error("Error updating project:", error);
    // Use data helper for general error
    return data(
      { success: false, error: error.message || "Failed to update project" },
      { status: 500 }
    );
  }
}

export function Component() {
  // Use type inference for useLoaderData
  const { project, error } = useLoaderData<typeof loader>();

  if (error || !project) {
    return (
      <FadeIn>
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Edit Project
        </h1>
        <div
          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
          role="alert"
        >
          Error: {error || "Failed to load project"}
        </div>
        <Link to="/admin/projects" className="text-blue-600 hover:underline">
          ← Back to Projects
        </Link>
      </FadeIn>
    );
  }

  return (
    <FadeIn>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Edit Project: {project.title}
      </h1>

      <Form
        method="post"
        encType="multipart/form-data"
        className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 space-y-6"
      >
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Project Title <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            defaultValue={project.title}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            defaultValue={project.description || ""}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="details"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Details (e.g., Location, Duration, Budget)
          </label>
          <RichTextField name="details" initialJSON={project.details || ""} />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isFeatured"
            id="isFeatured"
            value="true"
            defaultChecked={project.isFeatured ?? false}
            className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="isFeatured"
            className="block text-sm font-medium text-gray-700"
          >
            Feature on Home Page
          </label>
        </div>

        {/* Display current image if available */}
        {project.imageUrl && (
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Image
            </label>
            <img
              src={project.imageUrl}
              alt="Current project image"
              className="max-w-xs h-auto rounded border border-gray-200"
            />
            <input
              type="hidden"
              name="currentImageUrl"
              value={project.imageUrl}
            />
          </div>
        )}

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Replace Image (Optional)
          </label>
          <input
            type="file"
            name="image"
            id="image"
            accept="image/*"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
        </div>

        <div>
          <label
            htmlFor="sortOrder"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Sort Order (lower numbers appear first)
          </label>
          <input
            type="number"
            name="sortOrder"
            id="sortOrder"
            min="0"
            defaultValue={project.sortOrder ?? 0}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
          <Button
            as={Link}
            to="/admin/projects"
            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Save Changes
          </Button>
        </div>
      </Form>
    </FadeIn>
  );
}
