import type { Route } from "./+types/edit";
import React from "react";
import { Form, redirect } from "react-router";
import { FadeIn } from "~/routes/common/components/ui/FadeIn";
import { getProjectById, updateProject } from "~/routes/common/db";
import { handleImageUpload } from "~/utils/upload.server";
import { validateProjectUpdate } from "../../../../../../database/valibot-validation.js";
import { ProjectFormFields } from "../../../components/ProjectFormFields";
import { SectionCard, SectionHeading } from "../../../components/ui/section";
import { Alert } from "../../../components/ui/alert";
import { Heading } from "~/routes/admin/components/ui/heading";

export async function loader({ params, context, request }: Route.LoaderArgs) {
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

export async function action({ request, params, context }: Route.ActionArgs) {
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

export default function EditProjectPage({
	loaderData,
	actionData,
	params,
}: Route.ComponentProps) {
	const project = loaderData?.project;
	const errors = actionData?.errors;
	const handleCancel = () => window.location.assign("/admin/projects");

	return (
		<FadeIn>
			<Heading level={4}>Edit Project: {project?.title}</Heading>

			{actionData && !actionData.success && actionData.error && (
				<Alert variant="error" className="mb-4">
					{actionData.error}
				</Alert>
			)}
			<SectionCard className="mt-4">
				<SectionHeading>Project Details</SectionHeading>
				<Form
					method="post"
					encType="multipart/form-data"
					className="flex flex-col gap-6"
				>
					<ProjectFormFields
						initial={project as any} // Cast as any to match existing, consider refining type
						errors={errors}
						isEdit
						onCancel={handleCancel}
					/>
				</Form>
			</SectionCard>
		</FadeIn>
	);
}
