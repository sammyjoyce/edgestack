import React from "react";
import { Form, redirect, useLoaderData, useNavigate } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import type { Project } from "~/database/schema";
import { getProjectById } from "~/routes/common/db";
import { deleteProject } from "~/routes/common/db"; // Import deleteProject
// Import generated types from the .react-router directory
import type { Route } from "../../../../../../.react-router/types/app/routes/admin/routes/projects/[projectId]/+types/delete";
import { Button } from "../../../components/ui/Button";
import { FadeIn } from "../../../components/ui/FadeIn";

// Return plain objects for type safety
export async function loader({ params, context }: Route.LoaderArgs) {
	// Use generated type
	const projectId = Number(params.projectId);

	if (Number.isNaN(projectId)) {
		return { project: null, error: "Invalid Project ID" };
	}

	try {
		const project = await getProjectById(context.db, projectId);
		if (!project) {
			return { project: null, error: "Project not found" };
		}
		return { project };
	} catch (error: any) {
		console.error("Error fetching project:", error);
		return { project: null, error: error.message || "Failed to load project" };
	}
}

// Return plain objects or Response for type safety
export async function action({
	request,
	params,
	context, // context will be typed by Route.ActionArgs
}: Route.ActionArgs) {
	// Use generated type
	const projectId = Number(params.projectId);

	if (Number.isNaN(projectId)) {
		return { success: false, error: "Invalid Project ID" };
	}

	const formData = await request.formData();
	const confirmDelete = formData.get("confirmDelete") === "true";

	if (!confirmDelete) {
		return { success: false, error: "Deletion was not confirmed" };
	}

	try {
		await deleteProject(context.db, projectId);

		// Redirect to projects list after successful deletion
		return redirect("/admin/projects");
	} catch (error: any) {
		console.error("Error deleting project:", error);
		return {
			success: false,
			error: error.message || "Failed to delete project",
		};
	}
}

export function DeleteProjectRoute() {
	// Use type inference for useLoaderData
	const { project, error } = useLoaderData<typeof loader>();
	const navigate = useNavigate();

	if (error || !project) {
		return (
			<div className="rounded-md bg-red-50 p-4 mb-6">
				<div className="flex">
					<div className="ml-3">
						<h3 className="text-sm font-medium text-red-800">
							{error || "Failed to load project"}
						</h3>
						<div className="mt-4">
							<Button
								type="button"
								onClick={() => navigate("/admin/projects")}
								className="text-sm"
							>
								Return to Projects
							</Button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<FadeIn>
			<div className="flex flex-col gap-8">
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-semibold text-gray-900">
						Delete Project
					</h1>
					<Button
						variant="secondary"
						onClick={() => navigate("/admin/projects")}
						className="text-sm"
					>
						Cancel
					</Button>
				</div>

				<div className="bg-white p-6 rounded-lg shadow-xs border border-gray-200">
					<div className="rounded-md bg-yellow-50 p-4 mb-6">
						<div className="flex">
							<div className="ml-3">
								<h3 className="text-sm font-medium text-yellow-800">
									Warning: This action cannot be undone
								</h3>
								<p className="mt-2 text-sm text-yellow-700">
									You are about to permanently delete the project "
									{project.title}".
								</p>
							</div>
						</div>
					</div>

					<div className="mb-6">
						<h2 className="text-xl font-semibold mb-2">{project.title}</h2>
						<p className="text-gray-600">{project.description}</p>
					</div>

					<Form method="post" className="flex flex-col gap-6">
						<div className="flex items-start">
							<div className="flex items-center h-5">
								<input
									id="confirmDelete"
									name="confirmDelete"
									type="checkbox"
									value="true"
									className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
								/>
							</div>
							<div className="ml-3 text-sm">
								<label
									htmlFor="confirmDelete"
									className="font-medium text-gray-700"
								>
									I confirm that I want to delete this project
								</label>
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
							<Button
								type="submit"
								className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
							>
								Delete Project
							</Button>
						</div>
					</Form>
				</div>
			</div>
		</FadeIn>
	);
}

// Default export for backwards compatibility
export default DeleteProjectRoute;
