import React from "react";
import { data, Form, Link, redirect } from "react-router";
import type { Route } from "./+types/new";

import { Button } from "~/modules/common/components/ui/Button";
import { FadeIn } from "~/modules/common/components/ui/FadeIn";
import { createProject } from "~/db";
import { getSessionCookie, verify } from "~/modules/common/utils/auth";
import type { NewProject } from "~/database/schema";
import { validateProjectInsert } from "~/database/valibot-validation";

// No action defined here - handled by parent route /admin/projects
// The action logic previously here is now in app/modules/admin/pages/projects/index.tsx

// Component to render the "Add New Project" form
export function Component({
  actionData, // Keep actionData prop for potential errors returned by the centralized action
}: Route.ComponentProps): React.ReactElement {
  // Use React.ReactElement
  return (
    <FadeIn>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        {" "}
        {/* Use gray-900, increased margin */}
        Add New Project
      </h1>

      {actionData?.error && (
        <div
          className="p-4 mb-6 text-sm text-red-700 rounded-lg bg-red-100 border border-red-200" /* Adjusted colors/spacing */
          role="alert"
        >
          {actionData.error}
        </div>
      )}

      {/* Update form to target the centralized action with intent */}
      <Form
        method="post"
        action="/admin/projects" // Target the projects index route
        className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 space-y-6"
      >
        <input type="hidden" name="intent" value="createProject" />
        {" "}
        {/* Adjusted shadow/border, increased spacing */}
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
            className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="isFeatured"
            className="block text-sm font-medium text-gray-700" /* Use font-medium */
          >
            Feature on Home Page
          </label>
        </div>
        {/* TODO: Add image upload field later */}
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
            Create Project
          </Button>
        </div>
      </Form>
    </FadeIn>
  );
}
