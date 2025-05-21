import React from "react";
import { redirect, useNavigate } from "react-router";
import { FadeIn } from "~/routes/common/components/ui/FadeIn";
import { createProject } from "~/services/db.server";
import { assert } from "~/utils/assert";
import type { NewProject } from "../../../../../database/schema";
import { validateProjectInsert } from "../../../../../database/valibot-validation.js";
import { ProjectForm } from "../components/ProjectForm";
import { PageHeader } from "../components/ui/PageHeader";
import { Alert } from "../components/ui/alert";
import { SectionCard, SectionHeading } from "../components/ui/section";
import type { Route } from "./+types/new";

export async function action({ request, context, params }: Route.ActionArgs) {
	const formData = await request.formData();
	const title = formData.get("title")?.toString() ?? "";
	const description = formData.get("description")?.toString() ?? "";
	const details = formData.get("details")?.toString() ?? "";
	const imageUrl = formData.get("imageUrl")?.toString() || null;
	const isFeatured = formData.has("isFeatured");
	const sortOrderString = formData.get("sortOrder")?.toString();
	const sortOrder =
		sortOrderString && !Number.isNaN(Number.parseInt(sortOrderString, 10))
			? Number.parseInt(sortOrderString, 10)
			: 0;
	const projectData = {
		title,
		description,
		details,
		imageUrl,
		isFeatured,
		sortOrder,
	};
	try {
		validateProjectInsert(projectData);
		await createProject(
			context.db,
			projectData as Omit<NewProject, "id" | "createdAt" | "updatedAt">,
		);
		return redirect("/admin/projects");
	} catch (error: unknown) {
		console.error("Error creating project:", error);
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
			error: error.message || "Failed to create project",
		};
	}
}

export default function NewProjectPage({ actionData }: Route.ComponentProps) {
	const navigate = useNavigate();
	const errors = actionData?.errors;
	const initial = {};
	const handleCancel = () => navigate("/admin/projects");

	assert(
		typeof navigate === "function",
		"NewProjectRoute: navigate must be a function",
	);
	assert(
		typeof actionData === "undefined" || typeof actionData === "object",
		"NewProjectRoute: actionData must be object or undefined",
	);

	return (
		<FadeIn>
			<PageHeader title="Add New Project" />

			{actionData && !actionData.success && actionData.error && !errors && (
				<Alert variant="error" className="mb-4">
					{actionData.error}
				</Alert>
			)}
			<SectionCard>
				<SectionHeading>New Project Details</SectionHeading>
				<ProjectForm
					initial={initial}
					errors={errors}
					onCancel={handleCancel}
					formClassName="space-y-6"
				/>
			</SectionCard>
		</FadeIn>
	);
}
