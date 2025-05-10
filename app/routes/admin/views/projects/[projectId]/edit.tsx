import type { Route } from "./+types/[projectId]/edit";
import React from "react";
import {
	Form,
	Link,
	redirect,
	useActionData,
	useLoaderData,
} from "react-router";
import type { Project } from "~/database/schema";
import { ProjectImageSelector } from "~/routes/admin/components/ProjectImageSelector";
import RichTextField from "~/routes/admin/components/RichTextField";
import { FadeIn } from "~/routes/common/components/ui/FadeIn";
import { getProjectById, updateProject } from "~/routes/common/db";
import { handleImageUpload } from "~/utils/upload.server";
import { validateProjectUpdate } from "../../../../../../database/valibot-validation.js";
import { ProjectFormFields } from "../../../components/ProjectFormFields";
import { FormCard } from "../../../components/ui/FormCard";
import { PageHeader } from "../../../components/ui/PageHeader";
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "../../../components/ui/alert";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/fieldset";
import { Input } from "../../../components/ui/input";
import { Text } from "../../../components/ui/text";
// Removed missing Route type import.

export async function loader({
	params,
	context,
	request,
}: Route.LoaderArgs): Promise<{ project: Project } | Response> {
	const projectId = Number(params.projectId);
	if (Number.isNaN(projectId)) {
		throw new Response("Invalid Project ID", { status: 400 });
	}
	try {
		const project = await getProjectById(context.db, projectId);
		if (!project) {
			throw new Response("Project not found", { status: 404 });
		}
		return { project };
	} catch (error: any) {
		console.error("Error fetching project:", error);
		throw new Response(error.message || "Failed to load project", {
			status: 500,
		});
	}
}
export async function action({
	request,
	params,
	context,
}: Route.ActionArgs): Promise<
	Response | { success: boolean; errors?: Record<string, string>; error?: string }
> {
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
	const imageFile = formData.get("image") as File;
	let imageUrl = formData.get("currentImageUrl") as string;
	try {
		if (imageFile && imageFile.size > 0) {
			const env = context.cloudflare?.env;
			if (!env) {
				return { success: false, error: "Environment not available" };
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
					const errorMsg =
						typeof uploadResult === "object" &&
						uploadResult !== null &&
						"error" in uploadResult
							? (uploadResult as { error: string }).error
							: "Failed to upload image";
					return { success: false, error: errorMsg };
				}
			} catch (error) {
				console.error("Image upload error:", error);
				return { success: false, error: "Failed to upload image" };
			}
		}
		if (!title) {
			return {
				success: false,
				error: "Title is required",
				errors: { title: "Title is required" },
			};
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
			return {
				success: false,
				error:
					"Failed to update project, project might not exist or update failed.",
			};
		}
		return redirect("/admin/projects");
	} catch (error: any) {
		console.error("Error updating project:", error);
		const errors: Record<string, string> = {};
		if (error.issues && Array.isArray(error.issues)) {
			for (const issue of error.issues) {
				const fieldName = issue.path?.[0]?.key;
				if (typeof fieldName === "string" && !errors[fieldName]) {
					errors[fieldName] = issue.message;
				}
			}
		}
		if (Object.keys(errors).length > 0) {
			return { success: false, errors, error: "Validation failed." };
		}
		return {
			success: false,
			error: error.message || "Failed to update project",
		};
	}
}
export default function EditProjectPage({ loaderData, actionData, params }: Route.ComponentProps) {
	const project = loaderData?.project;
	const errors = actionData?.errors;
	const handleCancel = () => window.location.assign("/admin/projects");
	return (
		<FadeIn>
			<PageHeader title={`Edit Project: ${project?.title ?? ""}`} />

			{actionData && !actionData.success && actionData.error && (
				<Alert variant="error" className="mb-4">
					{actionData.error}
				</Alert>
			)}
			<FormCard
				as="form"
				method="post"
				encType="multipart/form-data"
				className="flex flex-col gap-6"
			>
				<ProjectFormFields
					initial={project as any}
					errors={errors}
					isEdit
					onCancel={handleCancel}
				/>
			</FormCard>
		</FadeIn>
	);
}
