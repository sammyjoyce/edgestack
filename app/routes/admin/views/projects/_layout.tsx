import React from "react";
import { Outlet, useLoaderData } from "react-router";
import type { Project } from "~/database/schema";
import { getAllProjects } from "~/routes/common/db";
import type { Route } from "./+types/_layout";
import { getSessionCookie, verify } from "~/routes/common/utils/auth";
import { AdminErrorBoundary } from "../../components/AdminErrorBoundary";
import { FadeIn } from "../../components/ui/FadeIn";
// Define the loader data type
type ProjectsLoaderData = {
	projects: Project[];
	error?: string;
};

// Return plain objects for type safety
export async function loader({
	request,
	context,
}: Route.LoaderArgs): Promise<ProjectsLoaderData> {
	const unauthorized = () => {
		return { projects: [], error: "Unauthorized" };
	};

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
		return { projects: [], error: "Failed to load projects" };
	}
}

export function ProjectsLayout() {
	const loaderData = useLoaderData<typeof loader>();
	return (
		<FadeIn>
			<Outlet context={loaderData} />
		</FadeIn>
	);
}

export function ErrorBoundary() {
	return <AdminErrorBoundary />;
}

// Default export for React Router 7 conventions
export default ProjectsLayout;
