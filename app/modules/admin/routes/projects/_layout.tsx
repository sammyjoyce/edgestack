import React from "react";
import { Outlet } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { FadeIn } from "~/modules/common/components/ui/FadeIn";
import { AdminErrorBoundary } from "../../components/AdminErrorBoundary";
import { getAllProjects } from "app/modules/common/db";
import { getSessionCookie, verify } from "~/modules/common/utils/auth";
import type { Project } from "~/database/schema";
// Define the loader data type
type ProjectsLoaderData = {
  projects: Project[];
  error?: string;
};

// Return plain objects for type safety
export async function loader({ request, context }: LoaderFunctionArgs): Promise<ProjectsLoaderData> {
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
  return (
    <FadeIn>
      <Outlet />
    </FadeIn>
  );
}

export function ErrorBoundary() {
  return <AdminErrorBoundary />;
}

// Default export for backwards compatibility
export default ProjectsLayout;
