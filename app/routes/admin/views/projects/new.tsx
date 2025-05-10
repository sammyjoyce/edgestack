import React from "react";
import { Form, redirect, useActionData, useNavigate } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { FadeIn } from "~/routes/common/components/ui/FadeIn";
import { createProject } from "~/routes/common/db";
import { assert } from "~/routes/common/utils/assert";
import type { NewProject } from "../../../../../database/schema";
import { validateProjectInsert } from "../../../../../database/valibot-validation.js";
import { ProjectFormFields } from "../../components/ProjectFormFields";
import { FormCard } from "../../components/ui/FormCard";
import { PageHeader } from "../../components/ui/PageHeader";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/fieldset";
import { Input } from "../../components/ui/input";
import { Text } from "../../components/ui/text";
import { Textarea } from "../../components/ui/textarea";
// Removed unused Route type import.
export async function action({
	request,
	context,
}: { request: Request; context: any }): Promise<
	| Response
	| { success: boolean; errors?: Record<string, string>; error?: string }
> {
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
	} catch (error: any) {
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
export default function NewProjectPage() {
	const navigate = useNavigate();
	const actionData = useActionData() as
		| { success?: boolean; errors?: Record<string, string>; error?: string }
		| undefined;
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
			<FormCard as="form" method="post" className="space-y-6">
				<ProjectFormFields
					initial={initial}
					errors={errors}
					onCancel={handleCancel}
				/>
			</FormCard>
		</FadeIn>
	);
}
