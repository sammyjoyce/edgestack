import React from "react";
import { Form, Link, redirect, useLoaderData } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { ProjectImageSelector } from "~/routes/admin/components/ProjectImageSelector";
import RichTextField from "~/routes/admin/components/RichTextField";
import { FadeIn } from "~/routes/common/components/ui/FadeIn";
import { getProjectById, updateProject } from "~/routes/common/db";
import { handleImageUpload } from "~/utils/upload.server";
// The validateProjectUpdate function is not found, we'll implement inline validation
import type { Project } from "../../../../../database/schema";
import { Label } from "../../../components/ui/fieldset";
import { Heading } from "../../../components/ui/heading";
import { Input } from "../../../components/ui/input";
import { Button } from "../components/ui/button";
import type { Route } from "./+types/edit";

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
}: Route.LoaderArgs) {
	// Use generated type
	const projectId = Number(params.projectId);

	if (Number.isNaN(projectId)) {
		throw new Error("Invalid Project ID");
	}

	try {
		const project = await getProjectById(context.db, projectId);
		if (!project) {
			throw new Error("Project not found");
		}
		return { project };
	} catch (error: any) {
		console.error("Error fetching project:", error);
		throw new Response(error.message || "Failed to load project", {
			status: 500,
		});
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
			return data(
				{ success: false, error: "Title is required" },
				{ status: 400 },
			);
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

		// Validate project data before updating
		try {
			validateProjectUpdate(projectData);
		} catch (validationError: any) {
			console.error("Project validation failed:", validationError);
			// Consider extracting Valibot error messages like in new.tsx if desired
			return data(
				{
					success: false,
					error: validationError.message || "Validation failed",
				},
				{ status: 400 },
			);
		}

		if (!title.trim()) {
			return data({
				success: false,
				error: "Title is required",
			});
		}

		// Update the project in the database
		const updated = await updateProject(context.db, projectId, projectData);

		if (!updated) {
			return data(
				{
					success: false,
					error:
						"Failed to update project, project might not exist or update failed.",
				},
				{ status: 500 },
			);
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
	const { project } = useLoaderData<typeof loader>();

	return (
		<FadeIn>
			<Heading level={1} className="mb-8">
				Edit Project: {project.title}
			</Heading>

			<Form
				method="post"
				encType="multipart/form-data"
				className="bg-gray-50 shadow-(--shadow-input-default) border border-gray-200 rounded-lg p-6 flex flex-col gap-6"
			>
				<div>
					<Label htmlFor="title" className="mb-1">
						Project Title <span className="text-red-600">*</span>
					</Label>
					<Input
						type="text"
						name="title"
						id="title"
						required
						defaultValue={project.title}
						className="block w-full rounded-md border-gray-300 bg-white shadow-(--shadow-input-default) focus:border-primary focus:ring-primary text-sm"
					/>
				</div>

				<div>
					<Label htmlFor="description" className="mb-1">
						Description
					</Label>
					<RichTextField
						name="description"
						initialJSON={project.description || ""}
					/>
					{/* Hidden input for description is handled by RichTextField */}
				</div>

				<div>
					<Label htmlFor="details" className="mb-1">
						Details (e.g., Location, Duration, Budget)
					</Label>
					<RichTextField name="details" initialJSON={project.details || ""} />
				</div>

				<div className="flex items-center gap-2">
					<Input
						type="checkbox"
						name="isFeatured"
						id="isFeatured"
						value="true"
						defaultChecked={project.isFeatured ?? false}
						className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
					/>
					<Label htmlFor="isFeatured">Feature on Home Page</Label>
				</div>

				<div>
					<Label className="mb-1">Project Image</Label>
					<ProjectImageSelector currentImage={project.imageUrl || undefined} />
				</div>

				<div>
					<Label htmlFor="sortOrder" className="mb-1">
						Sort Order (lower numbers appear first)
					</Label>
					<Input
						type="number"
						name="sortOrder"
						id="sortOrder"
						min="0"
						defaultValue={project.sortOrder ?? 0}
						className="block w-full rounded-md border-gray-300 bg-white shadow-(--shadow-input-default) focus:border-primary focus:ring-primary text-sm"
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
