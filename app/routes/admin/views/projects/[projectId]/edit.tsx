import React from "react";
import { Form, Link, redirect, useLoaderData } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
// The validateProjectUpdate function is not found, we'll implement inline validation
import type { Project } from "~/database/schema";
import { ProjectImageSelector } from "~/routes/admin/components/ProjectImageSelector";
import RichTextField from "~/routes/admin/components/RichTextField";
import { getProjectById, updateProject } from "~/routes/common/db";
import { handleImageUpload } from "~/utils/upload.server";
import type { Route } from "./+types/edit";
import { Button } from "../../../components/ui/Button";
import { FadeIn } from "../../../components/ui/FadeIn";

// Define return types for loader and action
type ProjectLoaderData = {
	project: Project | null;
	error?: string;
};

type ProjectActionData = {
	success: boolean;
	error?: string;
	project?: Project;
};

// Return plain objects with proper typing
export async function loader({
	params, // params will be typed by Route.LoaderArgs
	context, // context will be typed by Route.LoaderArgs
}: Route.LoaderArgs): Promise<ProjectLoaderData> {
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
	} catch (error) {
		console.error("Error fetching project:", error);
		return { project: null, error: "Failed to load project" };
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

	const title = formData.get("title")?.toString() ?? "";
	const description = formData.get("description")?.toString() ?? "";
	const details = formData.get("details")?.toString() ?? "";
	const isFeatured = formData.has("isFeatured");
	const sortOrder =
		Number.parseInt(formData.get("sortOrder") as string, 10) || 0;

	// Handle file upload if present
	const imageFile = formData.get("image") as File;
	let imageUrl = formData.get("currentImageUrl") as string;

	try {
		// Process image upload if a new file was provided
		if (imageFile && imageFile.size > 0) {
			// Access bucket from context
			const env = context.cloudflare?.env;
			if (!env) {
				return { success: false, error: "Environment not available" };
			}

			try {
				// Generate a key based on project ID and timestamp
				const imageKey = `project-${projectId}-${Date.now()}`;

				// Pass the FormData file to the image upload handler with all required parameters
				const uploadResult = await handleImageUpload(
					imageFile,
					imageKey,
					context,
				);
				if (uploadResult && typeof uploadResult === "string") {
					imageUrl = uploadResult;
				} else {
					return { success: false, error: "Failed to upload image" };
				}
			} catch (error) {
				console.error("Image upload error:", error);
				return { success: false, error: "Failed to upload image" };
			}
		}

		if (!title) {
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

		// Basic validation - since validateProjectUpdate is not found
		if (!title.trim()) {
			return {
				success: false,
				error: "Title is required",
			} as const;
		}

		// Update the project in the database
		const updated = await updateProject(context.db, projectId, projectData);

		if (!updated) {
			return data({ success: false, error: "Failed to update project, project might not exist or update failed." }, { status: 500 });
		}

		// Redirect to projects list after successful update
		return redirect("/admin/projects");
	} catch (error: any) {
		console.error("Error updating project:", error);
		return data(
			{ success: false, error: error.message || "Failed to update project" },
			{ status: 500 },
		);
	}
}

export default function Component() {
	// Error and !project cases are now handled by ErrorBoundary if loader throws
	const { project } = useLoaderData<typeof loader>();

	// This check might be redundant if loader always throws for !project
	if (!project) {
        // This case should ideally be caught by an ErrorBoundary if loader throws a 404
        return (
            <FadeIn>
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                    Edit Project
                </h1>
                <div
                    className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
                    role="alert"
                >
                    Error: Project not found or could not be loaded.
                </div>
                <Link to="/admin/projects" className="text-primary hover:underline">
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
				className="bg-gray-50 shadow-[var(--shadow-input-default)] border border-gray-200 rounded-lg p-6 flex flex-col gap-6"
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
						className="block w-full rounded-md border-gray-300 bg-white shadow-[var(--shadow-input-default)] focus:border-primary focus:ring-primary text-sm"
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
						initialJSON={project.description || ""}
					/>
					{/* Hidden input for description is handled by RichTextField */}
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
						className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
					/>
					<label
						htmlFor="isFeatured"
						className="block text-sm font-medium text-gray-700"
					>
						Feature on Home Page
					</label>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Project Image
					</label>
					<ProjectImageSelector currentImage={project.imageUrl || undefined} />
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
						className="block w-full rounded-md border-gray-300 bg-white shadow-[var(--shadow-input-default)] focus:border-primary focus:ring-primary text-sm"
					/>
				</div>

				<div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
					<Button
						as={Link}
						to="/admin/projects"
						className="bg-gray-100 text-gray-700 hover:bg-gray-200"
					>
						Cancel
					</Button>
					<Button
						type="submit"
						className="bg-primary text-white hover:bg-primary/90"
					>
						Save Changes
					</Button>
				</div>
			</Form>
		</FadeIn>
	);
}
