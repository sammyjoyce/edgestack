import React from "react";
import { Form, Link, useLoaderData } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import type { Project } from "~/database/schema";
import { Button } from "../../components/ui/Button";
import type { Project } from "~/database/schema";
import { deleteProject, getAllProjects } from "~/routes/common/db";
import { Button } from "../../components/ui/Button";
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
export async function loader({ request, context }: LoaderFunctionArgs) {
	// Auth check (redundant with layout loader but good practice)
	// Auth check (redundant with layout loader but good practice)
	const unauthorized = () => {
		return { projects: [], error: "Unauthorized" } as const;
	};

	const { getSessionCookie, verify } =
		await import("~/routes/common/utils/auth");
	const sessionValue = getSessionCookie(request);
	const jwtSecret = context.cloudflare?.env?.JWT_SECRET;
	if (!sessionValue || !jwtSecret || !(await verify(sessionValue, jwtSecret))) {
		return unauthorized();
	}

	try {
		const projects = await getAllProjects(context.db);
		return { projects } as const;
	} catch (error) {
		console.error("Failed to load projects:", error);
		return { projects: [], error: "Failed to load projects" } as const;
	}
}

// Action to handle project management - Return plain objects for type safety
export async function action({ request, context }: ActionFunctionArgs) {
	const formData = await request.formData();
	const intent = formData.get("intent")?.toString();

	// Auth check
	// Auth check
	const unauthorized = () => {
		return { success: false, error: "Unauthorized" } as const;
	};
	const { getSessionCookie, verify } =
		await import("~/routes/common/utils/auth");
	const sessionValue = getSessionCookie(request);
	const jwtSecret = context.cloudflare?.env?.JWT_SECRET;
	if (!sessionValue || !jwtSecret || !(await verify(sessionValue, jwtSecret))) {
		return unauthorized();
	}

	// Handle delete project intent
	if (intent === "deleteProject") {
		const projectIdStr = formData.get("projectId")?.toString();
		if (!projectIdStr) {
			return { success: false, error: "Missing project ID" } as const;
		}
		const projectId = Number(projectIdStr);
		if (Number.isNaN(projectId)) {
			return { success: false, error: "Invalid project ID" } as const;
		}

		try {
			await deleteProject(context.db, projectId);
			return { success: true, projectId } as const;
		} catch (error: unknown) {
			console.error("Failed to delete project:", error);
			return {
				success: false,
				error:
					(error instanceof Error
						? error.message
						: "Failed to delete project") || "Failed to delete project",
			} as const;
		}
	}

	// Handle unknown intent
	return { success: false, error: "Unknown intent" } as const;
}

export function ProjectsIndexRoute() {
	// Use type inference with explicit error handling
	const loaderData = useLoaderData<typeof loader>();
	const projects = loaderData.projects;
	const error = "error" in loaderData ? loaderData.error : undefined;

	return (
		<div>
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-2xl font-semibold text-gray-900">
					Manage Projects
				</h1>
				<Button as={Link} to="/admin/projects/new" className="text-sm">
					Add New Project
				</Button>
			</div>

			{error && (
				<div
					className="p-4 mb-6 text-sm text-red-700 rounded-lg bg-red-100 border border-red-200"
					role="alert"
				>
					{error}
				</div>
			)}

			{projects.length === 0 && !error ? (
				<p className="text-base text-gray-600">
					No projects found. Add your first project!
				</p>
			) : (
				<div className="bg-gray-50 shadow-[var(--shadow-input-default)] border border-gray-200 overflow-hidden rounded-lg">
					<ul className="divide-y divide-gray-200">
						{projects.map((project) => (
							<li
								key={project.id}
								className="px-6 py-5 hover:bg-gray-50 transition-colors duration-150"
							>
								<div className="flex items-center justify-between gap-4">
									<div className="flex-1 min-w-0">
										<Link
											to={`/admin/projects/${project.id}/edit`}
											className="text-base font-semibold text-primary truncate hover:underline"
										>
											{project.title}
										</Link>
										<p className="text-sm text-gray-600 truncate mt-1">
											{project.description || "No description"}
										</p>
									</div>
									<div className="ml-4 shrink-0 flex items-center gap-3">
										<Button
											as={Link}
											to={`/admin/projects/${project.id}/edit`}
											className="text-xs px-3 py-1"
										>
											Edit
										</Button>
										<Form method="post" replace>
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
											<Button
												type="submit"
												className="text-xs px-3 py-1 bg-red-600 text-white hover:bg-red-700"
											>
												Delete
											</Button>
										</Form>
									</div>
								</div>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

// Default export for backwards compatibility
export default ProjectsIndexRoute;
