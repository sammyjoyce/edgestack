import React from "react";
import { Form, Link, redirect, useLoaderData } from "react-router";
import invariant from "tiny-invariant";
import { deleteProject, getAllProjects } from "~/routes/common/db";
import type { Project } from "../../../../../database/schema";
import { Button } from "../../components/ui/button";
import { Fieldset, Legend } from "../../components/ui/fieldset";
import { Heading } from "../../components/ui/heading";
import { Text } from "../../components/ui/text";
import type { Route } from "./+types/index";
// Define return types for loader and action
type ProjectsLoaderData = {
	projects: Project[];
	error?: string;
};

type ProjectsActionData = {
	success: boolean;
	error?: string;
	projectId?: number;
};

// Loader to fetch all projects - Return plain objects for type safety
export async function loader({ request, context }: Route.LoaderArgs) {
	// Auth check (redundant with layout loader but good practice)
	const { getSessionCookie, verify } = await import(
		"~/routes/common/utils/auth"
	);
	const sessionValue = getSessionCookie(request);
	const jwtSecret = context.cloudflare?.env?.JWT_SECRET;
	if (!sessionValue || !jwtSecret || !(await verify(sessionValue, jwtSecret))) {
		// Prefer throwing a redirect or a data response for auth failures
		throw redirect("/admin/login"); // Or: throw new Error("Unauthorized");
	}

	try {
		const projects = await getAllProjects(context.db);
		return { projects };
	} catch (error) {
		console.error("Failed to load projects:", error);
		throw new Error("Failed to load projects");
	}
}

// Action to handle project management - Return plain objects for type safety
export async function action({ request, context }: Route.ActionArgs) {
	const formData = await request.formData();
	const intent = formData.get("intent")?.toString();

	// Auth check
	// Auth check
	const unauthorized = () => {
		throw new Response("Unauthorized", { status: 401 });
	};
	const { getSessionCookie, verify } = await import(
		"~/routes/common/utils/auth"
	);
	const sessionValue = getSessionCookie(request);
	const jwtSecret = context.cloudflare?.env?.JWT_SECRET;
	if (!sessionValue || !jwtSecret || !(await verify(sessionValue, jwtSecret))) {
		return unauthorized();
	}

	// Handle delete project intent
	if (intent === "deleteProject") {
		const projectIdStr = formData.get("projectId")?.toString();
		if (!projectIdStr) {
			throw new Response("Missing project ID", { status: 400 });
		}
		const projectId = Number(projectIdStr);
		if (Number.isNaN(projectId)) {
			throw new Response("Invalid project ID", { status: 400 });
		}

		try {
			await deleteProject(context.db, projectId);
			return { success: true, projectId };
		} catch (error: unknown) {
			console.error("Failed to delete project:", error);
			const message =
				error instanceof Error ? error.message : "Failed to delete project";
			throw new Response(message, { status: 500 });
		}
	}

	// Handle unknown intent
	throw new Response("Unknown intent", { status: 400 });
}

export function ProjectsIndexRoute() {
	const { projects } = useLoaderData<typeof loader>();

	// TigerStyle runtime assertions with detailed error messages
	invariant(
		Array.isArray(projects),
		"ProjectsIndexRoute: loader must return an array of projects. Check loader implementation.",
	);
	invariant(
		typeof projects.length === "number",
		"ProjectsIndexRoute: projects must have a length property. Data returned from loader is invalid.",
	);

	return (
		<>
			<Fieldset className="mb-8">
				<Legend>
					<Heading level={1}>Manage Projects</Heading>
				</Legend>
				<Button as={Link} href="/admin/projects/new" className="ml-auto">
					Add New Project
				</Button>
			</Fieldset>

			{projects.length === 0 ? (
				<div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
					{/* <FolderIcon className="mx-auto h-12 w-12 text-gray-400" /> */}
					<Text className="mt-2 text-lg font-medium text-gray-900">
						No projects
					</Text>
					<Text className="mt-1 text-gray-500">
						Get started by creating a new project using the button above.
					</Text>
				</div>
			) : (
				<div className="overflow-hidden rounded-md border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800/50">
					<table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
						<thead className="bg-gray-50 dark:bg-gray-900/30">
							<tr>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
								>
									Name
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
								>
									Description
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
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
						<tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
							{projects.map((project) => (
								<tr
									key={project.id}
									className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
								>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
										{project.title}
									</td>
									<td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
										{project.description || "-"}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
										{project.isFeatured ? (
											<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
												Featured
											</span>
										) : (
											"-"
										)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<Link
											to={`/admin/projects/${project.id}/edit`}
											className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
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
		</>
	);
}

// Default export for backwards compatibility
export default ProjectsIndexRoute;
