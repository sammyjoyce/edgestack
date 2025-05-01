import { getProjectById, updateProject } from "~/routes/common/db";
import React from "react";
import { Form, Link, redirect, useLoaderData } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
// The validateProjectUpdate function is not found, we'll implement inline validation
import type { Project } from "~/database/schema";
import RichTextField from "~/routes/admin/components/RichTextField";
import { Button } from "~/routes/common/components/ui/Button";
import { FadeIn } from "~/routes/common/components/ui/FadeIn";
import { handleImageUpload } from "~/utils/upload.server";
// Define route params type for type safety
type RouteParams = { projectId: string };

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
	params,
	context,
}: LoaderFunctionArgs & {
	params: RouteParams;
	context: { db: any };
}): Promise<ProjectLoaderData> {
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
	context,
}: ActionFunctionArgs & {
	params: RouteParams;
	context: { db: any; cloudflare?: { env?: any } };
}) {
	const projectId = Number(params.projectId);

	if (Number.isNaN(projectId)) {
		return { success: false, error: "Invalid Project ID" };
	}

	const formData = await request.formData();

	const title = formData.get("title") as string;
	const description = formData.get("description") as string;
	const details = formData.get("details") as string;
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
				// Use the original context - the handleImageUpload function just needs access to ASSETS_BUCKET
				// Use a type assertion to bypass TypeScript's type checking while maintaining runtime compatibility
				const uploadResult = await handleImageUpload(
					imageFile,
					imageKey,
					context as any,
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
			return { success: false, error: "Title is required" };
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
		await updateProject(context.db, projectId, projectData);

		// Redirect to projects list after successful update
		return redirect("/admin/projects");
	} catch (error: any) {
		console.error("Error updating project:", error);
		return {
			success: false,
			error: error.message || "Failed to update project",
		} as const;
	}
}

export default function Component() {
	// Use type inference with explicit error handling
	const loaderData = useLoaderData<typeof loader>();
	const project = loaderData.project;
	const error = "error" in loaderData ? loaderData.error : undefined;

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
				className="bg-white shadow-xs border border-gray-200 rounded-lg p-6 space-y-6"
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
