import React from "react";
import { Form, redirect, useActionData, useNavigate, data } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import invariant from "tiny-invariant";
import { createProject } from "~/routes/common/db";
import type { NewProject } from "../../../../../database/schema";
import { validateProjectInsert } from "../../../../../database/valibot-validation.js";

import type { Route } from "./+types/new";

import { FadeIn } from "~/routes/common/components/ui/FadeIn";
import { Button } from "../../components/ui/button";
import { Fieldset, Label, Legend } from "../../components/ui/fieldset";
import { Heading } from "../../components/ui/heading";
import { Input } from "../../components/ui/input";
import { Text } from "../../components/ui/text";
import { Textarea } from "../../components/ui/textarea";

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
	const sortOrder =
		sortOrderString && !Number.isNaN(Number.parseInt(sortOrderString, 10))
			? Number.parseInt(sortOrderString, 10)
			: 0;

	const projectData = {
		title,
		description, // Pass as is, schema defines it as nullable text
		details, // Pass as is, schema defines it as nullable text
		imageUrl, // Already null if empty
		isFeatured,
		sortOrder,
		// createdAt and updatedAt are handled by Drizzle/DB defaults or application logic in createProject
	};

	try {
		validateProjectInsert(projectData);

		await createProject(
			context.db,
			projectData as Omit<NewProject, "id" | "createdAt" | "updatedAt">,
		);

		// Redirect to projects list after successful creation
		return redirect("/admin/projects");
	} catch (error: any) {
		console.error("Error creating project:", error);
		// Check for Valibot validation error structure
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
			return data({ success: false, errors }, { status: 400 });
		}
		return data({ success: false, error: error.message || "Failed to create project" }, { status: 500 });
	}
}

export function NewProjectRoute() {
	const navigate = useNavigate();
	const actionData = useActionData<typeof action>();
	const errors = actionData?.errors as Record<string, string> | undefined;

	// TigerStyle runtime assertions
	invariant(
		typeof navigate === "function",
		"NewProjectRoute: navigate must be a function",
	);
	invariant(
		typeof actionData === "undefined" || typeof actionData === "object",
		"NewProjectRoute: actionData must be object or undefined",
	);

	return (
		<FadeIn>
			<Fieldset className="mb-8">
				<Legend>
					<Heading level={1}>Add New Project</Heading>
				</Legend>
			</Fieldset>

			{actionData?.error && !errors && (
				<Text
					className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg border border-red-200"
					role="alert"
				>
					{actionData.error}
				</Text>
			)}

			<Form method="post" className="space-y-6">
				<Fieldset>
					<Label htmlFor="title">Project Title</Label>
					<Input
						id="title"
						name="title"
						required
						placeholder="Enter project title"
						aria-invalid={!!errors?.title}
						aria-describedby={errors?.title ? "title-error" : undefined}
					/>
					{errors?.title && <Text id="title-error" className="text-sm text-red-600">{errors.title}</Text>}
				</Fieldset>

				<Fieldset>
					<Label htmlFor="description">Description</Label>
					<Textarea
						name="description"
						id="description"
						rows={4}
						placeholder="Enter a short description"
					/>
				</Fieldset>

				<Fieldset>
					<Label htmlFor="details">Project Details</Label>
					<Textarea
						name="details"
						id="details"
						rows={4}
						placeholder="Enter project details"
					/>
				</Fieldset>

				<Fieldset>
					<Label htmlFor="imageUrl">Image URL</Label>
					<Input
						id="imageUrl"
						name="imageUrl"
						placeholder="URL to project image (optional)"
					/>
					<a
						href="https://vercel.com/import/project?template=https://github.com/sammyjoyce/lush"
						target="_blank"
						rel="noopener noreferrer"
						className="w-full flex items-center justify-center gap-2"
					>
						<span>Deploy to Vercel</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							fill="none"
							viewBox="0 0 20 20"
							className="inline-block"
						>
							<title>Vercel Logo</title>
							<path fill="currentColor" d="M10 2l7.071 12.25H2.929z" />
						</svg>
					</a>
					<Button type="submit">Create Project</Button>
				</Fieldset>

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
		</FadeIn>
	);
}

// Default export for backwards compatibility
export default NewProjectRoute;
