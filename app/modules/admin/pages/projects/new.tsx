import React from "react";
import { data, Form, Link, redirect, useActionData } from "react-router";
import type { Route } from "./+types/new";

import { Button } from "~/modules/common/components/ui/Button";
import { FadeIn } from "~/modules/common/components/ui/FadeIn";
import { createProject } from "~/db";
import { getSessionCookie, verify } from "~/modules/common/utils/auth";
import type { NewProject } from "~/database/schema";
import { validateProjectInsert } from "~/database/valibot-validation";

// Action to handle creating a new project
export async function action({ request, context }: Route.ActionArgs) {
  const unauthorized = () => data({ error: "Unauthorized" }, { status: 401 });

  const badRequest = (msg: string) => data({ error: msg }, { status: 400 });

  const sessionValue = getSessionCookie(request);
  if (
    !sessionValue ||
    !context.JWT_SECRET ||
    !(await verify(sessionValue, context.JWT_SECRET))
  ) {
    return unauthorized();
  }

  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const details = formData.get("details");
    const isFeatured = formData.get("isFeatured") === "true"; // Convert checkbox value to boolean
    // TODO: Add image upload handling later if needed

    if (typeof title !== "string" || title.trim() === "") {
      return badRequest("Title is required.");
    }

    const newProjectData: NewProject = {
      title: title.trim(),
      description:
        typeof description === "string" ? description.trim() : undefined,
      details: typeof details === "string" ? details.trim() : undefined,
      isFeatured: isFeatured, // Add isFeatured flag
      // imageUrl will be handled separately, perhaps in the edit step
      // sortOrder will be handled in the list view
    };

    // Validate newProjectData using Valibot
    try {
      validateProjectInsert({ ...newProjectData });
    } catch (e: any) {
      return badRequest(
        `Validation failed for project creation: ${e.message || e}`
      );
    }
    const createdProject = await createProject(context.db, newProjectData);

    // Redirect to the project list page after successful creation
    return redirect("/admin/projects");
  } catch (error: any) {
    return data({ error: "Failed to create project." }, { status: 500 });
  }
}

// Component to render the "Add New Project" form
export default function AdminNewProject(): JSX.Element {
  const actionData = useActionData<typeof action>();

  return (
    <FadeIn>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Add New Project
      </h1>

      {actionData?.error && (
        <div
          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
          role="alert"
        >
          {actionData.error}
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isFeatured"
            id="isFeatured"
            value="true" // Send "true" when checked
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="isFeatured"
            className="ml-2 block text-sm text-gray-900"
          >
            Feature on Home Page
          </label>
        </div>

        {/* TODO: Add image upload field later */}
        {/*
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Project Image
          </label>
          <input type="file" name="image" id="image" accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
        </div> 
        */}

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            as={Link}
            to="/admin/projects"
            className="bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </Button>
          <Button type="submit">Create Project</Button>
        </div>
      </Form>
    </FadeIn>
  );
}
