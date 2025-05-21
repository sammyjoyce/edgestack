import clsx from "clsx";
import React from "react";
import {
	Form,
	Link,
	Outlet,
	data,
	redirect,
	useActionData,
	useLocation,
} from "react-router";
import { ConditionalRichTextRenderer } from "~/routes/common/components/ConditionalRichTextRenderer/index";
import { assert } from "~/utils/assert";
import { checkSession } from "~/utils/auth";
import { Container } from "../../../common/components/ui/Container";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/button";
import { Text } from "../components/ui/text";
import type { Route } from "./+types/index";
import { fetchAdminProjectsList } from "./services";

/**
 * Loader that retrieves the list of projects for the admin UI.
 * Redirects to the login page when the session is missing or invalid.
 */
export async function loader({ request, context }: Route.LoaderArgs) {
	const env = context.cloudflare?.env;
	if (!env || !(await checkSession(request, env))) {
		throw redirect("/admin/login");
	}
	try {
		const projects = await fetchAdminProjectsList(context.cms);
		return { projects };
	} catch (error: unknown) {
		console.error("Failed to load projects:", error);
		const message =
			error instanceof Error ? error.message : "Failed to load projects";
		throw data({ error: message }, { status: 500 });
	}
}

/**
 * Action handler for project list management.
 * Currently supports deleting a project via form submission.
 */
export async function action({ request, context }: Route.ActionArgs) {
	const formData = await request.formData();
	const intent = formData.get("intent")?.toString();
	const env = context.cloudflare?.env;
	if (!env || !(await checkSession(request, env))) {
		return redirect("/admin/login");
	}
	if (intent === "deleteProject") {
		const projectIdStr = formData.get("projectId")?.toString();
		if (!projectIdStr) {
			return data(
				{ success: false, error: "Missing project ID" },
				{ status: 400 },
			);
		}
		const projectId = Number(projectIdStr);
		if (Number.isNaN(projectId)) {
			return data(
				{ success: false, error: "Invalid project ID" },
				{ status: 400 },
			);
		}
		try {
			await context.cms.deleteProject(projectId);
			return data({ success: true, projectId });
		} catch (error: unknown) {
			console.error("Failed to delete project:", error);
			const message =
				error instanceof Error ? error.message : "Failed to delete project";
			return data({ success: false, error: message }, { status: 500 });
		}
	}
	return data({ success: false, error: "Unknown intent" }, { status: 400 });
}

export default function AdminProjectsIndexPage({
	loaderData,
}: Route.ComponentProps) {
	const actionData = useActionData<typeof action>();

	if (!loaderData) {
		// Handle case where loader might have redirected or thrown
		return <div>Loading projects...</div>;
	}
	const { projects } = loaderData;
	const location = useLocation();
	const isChildActive =
		location.pathname !== "/admin/projects" &&
		location.pathname.startsWith("/admin/projects/");
	assert(
		Array.isArray(projects),
		"ProjectsIndexRoute: loader must return an array of projects. Check loader implementation.",
	);
	assert(
		typeof projects.length === "number",
		"ProjectsIndexRoute: projects must have a length property. Data returned from loader is invalid.",
	);
	return (
		<Container className="mt-8">
			<PageHeader
				title="Manage Projects"
				className="mb-4"
				actions={
					<Button as={Link} to="/admin/projects/new" color="primary">
						Add New Project
					</Button>
				}
			/>
			{isChildActive ? (
				<Outlet />
			) : projects.length === 0 ? (
				<div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
					<Text className="mt-2 text-lg font-medium text-gray-900">
						No projects
					</Text>
					<Text className="mt-1 text-gray-500">
						Get started by creating a new project using the button above.
					</Text>
				</div>
			) : (
				<div className="overflow-hidden rounded-md border border-gray-200 shadow-sm">
					<table className="w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>
									Name
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>
									Description
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>
									Featured
								</th>
								<th scope="col" className="relative px-6 py-3">
									<span className="sr-only">Edit</span>
								</th>
								<th scope="col" className="relative px-6 py-3">
									<span className="sr-only">Delete</span>
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{projects.map((project) => (
								<tr key={project.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
										{project.title}
									</td>
									<td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
										{project.description ? (
											<ConditionalRichTextRenderer
												text={project.description}
												fallbackClassName="text-sm text-gray-500"
												richTextClassName={clsx(
													"prose-sm", // Match td text size
													"prose max-w-none", // Apply prose, remove max-width constraint from prose itself
													"prose-p:text-gray-500",
													"prose-headings:text-gray-500",
													"prose-strong:text-gray-500",
													"prose-em:text-gray-500",
													"prose-a:text-gray-500 hover:prose-a:underline",
												)}
											/>
										) : (
											"-"
										)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{project.isFeatured ? (
											<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
												Featured
											</span>
										) : (
											"-"
										)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<Link
											to={`/admin/projects/${project.id}/edit`}
											className="text-indigo-600 hover:text-indigo-900"
										>
											Edit
										</Link>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<Form
											method="post"
											onSubmit={(e) =>
												confirm(
													"Are you sure you want to delete this project?",
												) || e.preventDefault()
											}
										>
											<input
												type="hidden"
												name="intent"
												value="deleteProject"
											/>
											<input
												type="hidden"
												name="projectId"
												value={project.id}
											/>
											<Button type="submit" variant="danger" size="sm">
												Delete
											</Button>
										</Form>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</Container>
	);
}
