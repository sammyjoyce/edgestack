import React from "react";
import { Form, redirect, useNavigate, data, type Response } from "react-router";
import { Button } from "~/modules/common/components/ui/Button";
import RichTextField from "../../components/RichTextField";
import { FadeIn } from "~/modules/common/components/ui/FadeIn";
// Import generated types
import type { Route } from "../../../../.react-router/types/app/modules/admin/routes/projects/new";
import { createProject } from "~/modules/common/db"; // Import createProject
import { validateProjectInsert } from "~/database/valibot-validation"; // Import validation

// Use inferred return type
export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const details = formData.get("details") as string;
  const imageUrl = formData.get("imageUrl") as string | undefined; // Allow undefined
  const isFeatured = formData.has("isFeatured");
  const sortOrder = parseInt(formData.get("sortOrder") as string, 10) || 0;

  const projectData = {
    title,
    description: description || "",
    details: details || "",
    imageUrl: imageUrl || null, // Use null if empty
    isFeatured,
    sortOrder,
  };

  try {
    // Validate before creating
    validateProjectInsert(projectData);

    await createProject(context.db, projectData);

    // Redirect to projects list after successful creation
    return redirect("/admin/projects");
  } catch (error: any) {
    console.error("Error creating project:", error);
    // Use data helper for error response
    return data(
      {
        success: false,
        error: error.message || "Failed to create project",
      },
      { status: error.issues ? 400 : 500 } // Use 400 for validation errors
    );
  }
}

export function NewProjectRoute() {
  const navigate = useNavigate();

  return (
    <FadeIn>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Add New Project
          </h1>
          <Button
            variant="secondary"
            onClick={() => navigate("/admin/projects")}
            className="text-sm"
          >
            Cancel
          </Button>
        </div>

        <Form
          method="post"
          className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Project Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Enter project title"
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
              rows={3}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Brief description of the project"
            />
          </div>

          <div>
            <label
              htmlFor="details"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Project Details
            </label>
            <RichTextField name="details" initialJSON="" />
          </div>

          <div>
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Image URL
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                name="imageUrl"
                id="imageUrl"
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="URL to project image"
              />
              <Button
                as="a"
                href="/admin/upload"
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                className="whitespace-nowrap"
              >
                Upload Image
              </Button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/admin/projects")}
            >
              Cancel
            </Button>
            <Button type="submit">Create Project</Button>
          </div>
        </Form>
      </div>
    </FadeIn>
  );
}

// Default export for backwards compatibility
export default NewProjectRoute;
