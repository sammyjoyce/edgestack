import React from "react";
import { Form, Link, redirect, useLoaderData, useActionData, data } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { ProjectImageSelector } from "~/routes/admin/components/ProjectImageSelector";
import RichTextField from "~/routes/admin/components/RichTextField";
import { FadeIn } from "~/routes/common/components/ui/FadeIn";
import { getProjectById, updateProject } from "~/routes/common/db";
import { handleImageUpload } from "~/utils/upload.server";
import { validateProjectUpdate } from "../../../../../../database/valibot-validation.js";
import type { Project } from "~/database/schema";
import { Label } from "../../../components/ui/fieldset";
import { Heading } from "../../../components/ui/heading";
import { Input } from "../../../components/ui/input";
import { Text } from "../../../components/ui/text";
import { Button } from "../../../components/ui/button";
import type { Route } from "./+types/projectId/edit";
import type { SerializeFrom } from "react-router";
export async function loader({
	params, 
	context, 
}: Route.LoaderArgs): Promise<SerializeFrom<Route.LoaderData> | Response> { 
	const projectId = Number(params.projectId);
	if (Number.isNaN(projectId)) {
		throw data({ error: "Invalid Project ID" }, { status: 400 }); 
	}
	try {
		const project = await getProjectById(context.db, projectId);
		if (!project) {
			throw data({ error: "Project not found" }, { status: 404 }); 
		}
		return { project }; 
	} catch (error: any) {
		console.error("Error fetching project:", error);
		throw data({ error: error.message || "Failed to load project" }, { status: 500 }); 
	}
}
export async function action({
	request,
	params,
	context, 
}: Route.ActionArgs): Promise<Response | Route.ActionData> { 
	const projectId = Number(params.projectId);
	if (Number.isNaN(projectId)) {
		return data({ success: false, error: "Invalid Project ID" }, { status: 400 });
	}
	const formData = await request.formData();
	const title = formData.get("title")?.toString() ?? "";
	const description = formData.get("description")?.toString() ?? "";
	const details = formData.get("details")?.toString() ?? "";
	const isFeatured = formData.has("isFeatured");
	const sortOrder =
		Number.parseInt(formData.get("sortOrder") as string, 10) || 0;
	const imageFile = formData.get("image") as File;
	let imageUrl = formData.get("currentImageUrl") as string;
	try {
		if (imageFile && imageFile.size > 0) {
			const env = context.cloudflare?.env;
			if (!env) {
				return data({ success: false, error: "Environment not available" }, { status: 500 });
			}
			try {
				const imageKey = `project-${projectId}-${Date.now()}`;
				const uploadResult = await handleImageUpload(
					imageFile,
					imageKey,
					context,
				);
				if (uploadResult && typeof uploadResult === "string") {
					imageUrl = uploadResult;
				} else {
					const errorMsg = typeof uploadResult === 'object' && uploadResult !== null && 'error' in uploadResult ? (uploadResult as {error: string}).error : "Failed to upload image";
					return data({ success: false, error: errorMsg }, { status: 400 });
				}
			} catch (error) {
				console.error("Image upload error:", error);
				return data({ success: false, error: "Failed to upload image" }, { status: 500 });
			}
		}
		if (!title) {
			return data(
				{ success: false, error: "Title is required", errors: { title: "Title is required" } }, 
				{ status: 400 },
			);
		}
		const projectData = {
			title,
			description: description || "",
			details: details || "",
			imageUrl: imageUrl || null, 
			isFeatured,
			sortOrder,
		};
		validateProjectUpdate(projectData);
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
		return redirect("/admin/projects");
	} catch (error: any) {
		console.error("Error updating project:", error);
		const errors: Record<string, string> = {};
		if (error.issues && Array.isArray(error.issues)) { 
			for (const issue of error.issues) {
				const fieldName = issue.path?.[0]?.key;
				if (typeof fieldName === 'string' && !errors[fieldName]) {
					errors[fieldName] = issue.message;
				}
			}
		}
		if (Object.keys(errors).length > 0) {
			return data({ success: false, errors, error: "Validation failed." }, { status: 400 }); 
		}
		return data({ success: false, error: error.message || "Failed to update project" }, { status: 500 });
	}
}
export default function EditProjectPage() {
	const { project } = useLoaderData<SerializeFrom<typeof loader>>(); 
	const actionData = useActionData<SerializeFrom<typeof action>>(); 
	const errors = actionData?.errors as Record<string, string> | undefined;
	return (
		<FadeIn>
			<Heading level={1} className="mb-8">
				Edit Project: {project?.title} {}
			</Heading>
			{actionData?.error && !errors && (
				<Text className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg border border-red-200" role="alert">
					{actionData.error}
				</Text>
			)}
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
						aria-invalid={!!errors?.title}
						aria-describedby={errors?.title ? "title-error" : undefined}
					/>
					{errors?.title && <Text id="title-error" className="text-sm text-red-600">{errors.title}</Text>}
				</div>
				<div>
					<Label htmlFor="description" className="mb-1">
						Description
					</Label>
					<RichTextField
						name="description"
						initialJSON={project.description || ""}
					/>
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
