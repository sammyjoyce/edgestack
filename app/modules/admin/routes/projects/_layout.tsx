import React from "react";
import { Outlet, data, type TypedResponse } from "react-router";
import { FadeIn } from "~/modules/common/components/ui/FadeIn";
import { AdminErrorBoundary } from "../../components/AdminErrorBoundary";
import { getAllProjects } from "app/modules/common/db";
import { getSessionCookie, verify } from "~/modules/common/utils/auth";
import type { Project } from "~/database/schema";
// Import generated types
import type { Route } from "../../../../.react-router/types/app/modules/admin/routes/projects/_layout";

// Use inferred return type
export async function loader({ request, context }: Route.LoaderArgs) {
  const unauthorized = () =>
    // Use data helper
    data({ projects: [], error: "Unauthorized" }, { status: 401 });

  const sessionValue = getSessionCookie(request);
  const jwtSecret = context.cloudflare?.env?.JWT_SECRET;
  if (!sessionValue || !jwtSecret || !(await verify(sessionValue, jwtSecret))) {
    return unauthorized();
  }

  try {
    const projects = await getAllProjects(context.db);
    // Use data helper
    return data({ projects });
  } catch (error) {
    console.error("Failed to load projects:", error);
    // Use data helper for error
    return data({ projects: [], error: "Failed to load projects" }, { status: 500 });
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
