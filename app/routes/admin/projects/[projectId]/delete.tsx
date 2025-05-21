import React from "react";
import { Form, redirect, useNavigate } from "react-router";
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "~/routes/admin/components/ui/alert";
import { Heading } from "~/routes/admin/components/ui/heading";
import { FadeIn } from "~/routes/common/components/ui/FadeIn";
import { FormCard } from "../../components/ui/FormCard";
import { PageHeader } from "../../components/ui/PageHeader";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/fieldset";
import { Input } from "../../components/ui/input";
import { Text } from "../../components/ui/text";
import { fetchAdminProject } from "../services";
import type { Route } from "./+types/delete";

export async function loader({ params, context, request }: Route.LoaderArgs) {
	const projectId = Number(params.projectId);
	if (Number.isNaN(projectId)) {
		throw new Response("Invalid Project ID", { status: 400 });
	}
	try {
		const project = await fetchAdminProject(context.cms, projectId);
		return { project };
	} catch (error: unknown) {
		console.error("Error fetching project:", error);
		const message =
			error instanceof Error ? error.message : "Failed to load project";
		throw new Response(message, { status: 500 });
	}
}

export async function action({ request, params, context }: Route.ActionArgs) {
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
		await context.cms.deleteProject(projectId);
		return redirect("/admin/projects");
	} catch (error: unknown) {
		console.error("Error deleting project:", error);
		const message =
			error instanceof Error ? error.message : "Failed to delete project";
		return { success: false, error: message };
	}
}

export default function DeleteProjectPage({
	loaderData,
	params,
}: Route.ComponentProps) {
	const project = loaderData?.project;
	const navigate = useNavigate();
	return (
		<FadeIn>
			<div className="flex flex-col gap-8">
				<PageHeader
					title="Delete Project"
					actions={
						<Button
							variant="secondary"
							onClick={() => navigate("/admin/projects")}
							size="sm"
						>
							Cancel
						</Button>
					}
				/>
				<FormCard>
					<Alert variant="warning" className="mb-6">
						<AlertTitle>Warning: This action cannot be undone</AlertTitle>
						<AlertDescription>
							You are about to permanently delete the project "
							{project ? project.title : ""}".
						</AlertDescription>
					</Alert>
					<div className="mb-6">
						<Heading level={2} className="mb-2">
							{typeof project?.title === "string" ? project.title : ""}
						</Heading>
						<Text className="text-gray-600">
							{typeof project?.description === "string"
								? project.description
								: ""}
						</Text>
					</div>
					<Form method="post" className="flex flex-col gap-6">
						<div className="flex items-start">
							<div className="flex items-center h-5">
								<Input
									id="confirmDelete"
									name="confirmDelete"
									type="checkbox"
									value="true"
									className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
								/>
							</div>
							<div className="ml-3 text-sm">
								<Label
									htmlFor="confirmDelete"
									className="font-medium text-gray-700"
								>
									<Text>I confirm that I want to delete this project</Text>
								</Label>
							</div>
						</div>
						<div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
							<Button
								type="button"
								variant="secondary"
								size="md"
								onClick={() => navigate("/admin/projects")}
							>
								Cancel
							</Button>
							<Button type="submit" variant="danger" size="md">
								Delete Project
							</Button>
						</div>
					</Form>
				</FormCard>
			</div>
		</FadeIn>
	);
}
