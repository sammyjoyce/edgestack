import React from "react";
import { Form, redirect, useNavigate, useActionData } from "react-router"; // Added useActionData
import type { ActionFunctionArgs } from "react-router";
import type { NewProject } from "~/database/schema"; // Import NewProject type
import { createProject } from "~/routes/common/db"; // Import createProject
import { validateProjectInsert } from "~/database/valibot-validation"; // Import validation
import RichTextField from "../../components/RichTextField";
import { Button } from "../../components/ui/Button";
import { FadeIn } from "~/routes/common/components/ui/FadeIn";
// Import generated types if available (assuming generouted)
import type { Route } from "./+types/new"; // Adjust path if needed

// Define return types for action
type ProjectActionData = {
	success: boolean;
	error?: string;
};

// Return plain objects or Response for type safety
export async function action({
	request,
	context, // context will be typed by Route.ActionArgs
}: Route.ActionArgs): Promise<Response | ProjectActionData> {
	// Use generated type
	const formData = await request.formData();

	const title = formData.get("title")?.toString() ?? "";
	const description = formData.get("description")?.toString() ?? "";
	const details = formData.get("details")?.toString() ?? "";
	const imageUrl = formData.get("imageUrl")?.toString() || null;
	const isFeatured = formData.has("isFeatured");
	const sortOrderString = formData.get("sortOrder")?.toString();
	// Ensure sortOrder is a number, default to 0 if not provided or invalid
	const sortOrder = (sortOrderString && !Number.isNaN(parseInt(sortOrderString, 10))) ? Number.parseInt(sortOrderString, 10) : 0;


	const projectData = {
		title,
		description, // Pass as is, schema defines it as nullable text
		details,     // Pass as is, schema defines it as nullable text
		imageUrl,    // Already null if empty
		isFeatured,
		sortOrder,
		// createdAt and updatedAt are handled by Drizzle/DB defaults or application logic in createProject
	};

	try {
		// Validate data using Valibot schema
		// Valibot expects all fields defined in the schema unless they are optional.
		// Ensure projectData aligns with what projectInsertSchema expects.
		// projectInsertSchema is derived from NewProject, where id, createdAt, updatedAt might be optional due to DB defaults.
		validateProjectInsert(projectData);

		await createProject(context.db, projectData as Omit<NewProject, "id" | "createdAt" | "updatedAt">);

		// Redirect to projects list after successful creation
		return redirect("/admin/projects");
	} catch (error: any) {
		console.error("Error creating project:", error);
		// Check for Valibot validation error structure
		if (error.issues && Array.isArray(error.issues)) {
			const issueMessages = error.issues
				.map(
					(issue: any) => // Consider typing 'issue' more strictly if possible
						`${issue.path?.map((p:any) => p.key).join(".") || "field"}: ${issue.message}`,
				)
				.join("; ");
			throw new Response(`Validation Error: ${issueMessages}`, { status: 400 });
		}
		throw new Error(error.message || "Failed to create project");
	}
}

export function NewProjectRoute() {
	const navigate = useNavigate();
	const actionData = useActionData<typeof action>();

	return (
		<FadeIn>
			<div className="flex flex-col gap-8">
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

				{actionData?.error && (
					<div
						className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200"
						role="alert"
					>
						{actionData.error}
					</div>
				)}

				<Form
					method="post"
					className="flex flex-col gap-6 bg-gray-50 p-6 rounded-lg shadow-[var(--shadow-input-default)] border border-gray-200"
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
							className="block w-full rounded-md border-gray-300 bg-white shadow-[var(--shadow-input-default)] focus:border-primary focus:ring-primary text-sm"
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
						<RichTextField
							name="description"
							initialJSON="" // Start empty for new project
						/>
						{/* Hidden input for description is handled by RichTextField */}
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
						<div className="flex gap-2">
							<input
								type="text"
								name="imageUrl"
								id="imageUrl"
								className="block w-full rounded-md border-gray-300 bg-white shadow-[var(--shadow-input-default)] focus:border-primary focus:ring-primary text-sm"
								placeholder="URL to project image (optional)"
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

					<div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
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
