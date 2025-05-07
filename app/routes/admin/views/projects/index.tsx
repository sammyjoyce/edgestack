import React from "react";
import { Form, Link, useLoaderData } from "react-router";
import type { Project } from "~/database/schema";
import { Button } from "../../components/ui/Button";
import { deleteProject, getAllProjects } from "~/routes/common/db";
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
		return { projects };
	} catch (error) {
		console.error("Failed to load projects:", error);
		throw data({ message: "Failed to load projects" }, { status: 500 });
	}
}

// Action to handle project management - Return plain objects for type safety
export async function action({ request, context }: Route.ActionArgs) {
	const formData = await request.formData();
	const intent = formData.get("intent")?.toString();

	// Auth check
	// Auth check
	const unauthorized = () => {
		return data({ success: false, error: "Unauthorized" }, { status: 401 });
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
			return data({ success: false, error: "Missing project ID" }, { status: 400 });
		}
		const projectId = Number(projectIdStr);
		if (Number.isNaN(projectId)) {
			return data({ success: false, error: "Invalid project ID" }, { status: 400 });
		}

		try {
			await deleteProject(context.db, projectId);
			return data({ success: true, projectId });
		} catch (error: unknown) {
			console.error("Failed to delete project:", error);
			const message = error instanceof Error ? error.message : "Failed to delete project";
			return data({ success: false, error: message }, { status: 500 });
		}
	}

	// Handle unknown intent
	return data({ success: false, error: "Unknown intent" }, { status: 400 });
}

export function ProjectsIndexRoute() {
	// Use type inference with explicit error handling
	// Error case is now handled by ErrorBoundary if loader throws
	const { projects } = useLoaderData<typeof loader>();

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

			{projects.length === 0 ? (
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
