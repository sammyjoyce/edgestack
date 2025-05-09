import React from "react";
import invariant from "tiny-invariant";
import { Form, Link, useLoaderData, redirect } from "react-router";
import type { Project } from "~/database/schema";
import { Button } from "../../components/ui/Button";
import { deleteProject, getAllProjects } from "~/routes/common/db";
import { Heading, Text } from "~/routes/common/components/ui/text";
import { Fieldset, Legend } from "~/routes/common/components/ui/fieldset";
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
	const { getSessionCookie, verify } =
		await import("~/routes/common/utils/auth");
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
			const message = error instanceof Error ? error.message : "Failed to delete project";
			throw new Response(message, { status: 500 });
		}
	}

	// Handle unknown intent
	throw new Response("Unknown intent", { status: 400 });
}

export function ProjectsIndexRoute() {
	const { projects } = useLoaderData<typeof loader>();

	// TigerStyle runtime assertions
	invariant(Array.isArray(projects), "ProjectsIndexRoute: loader must return an array of projects");
	invariant(typeof projects.length === "number", "ProjectsIndexRoute: projects must have a length property");

	return (
		<>
			<Fieldset className="mb-8">
				<Legend>
					<Heading level={1}>Manage Projects</Heading>
				</Legend>
				<Button as={Link} to="/admin/projects/new" className="ml-auto">
					Add New Project
				</Button>
			</Fieldset>

			{projects.length === 0 ? (
				<Text>No projects found. Add your first project!</Text>
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
										<Heading level={2} as="span" className="text-base font-semibold text-primary truncate hover:underline">
											<Link to={`/admin/projects/${project.id}/edit`}>
												{project.title}
											</Link>
										</Heading>
										<Text className="text-sm text-gray-600 truncate mt-1">
											{project.description || "No description"}
										</Text>
									</div>
									<div className="ml-4 shrink-0 flex items-center gap-3">
										<Button
											as={Link}
											to={`/admin/projects/${project.id}/edit`}
											className="text-xs"
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
												variant="danger"
												className="text-xs"
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
		</>
	);
}

// Default export for backwards compatibility
export default ProjectsIndexRoute;
