import React from "react";
import { Outlet, data } from "react-router";
import { FadeIn } from "~/modules/common/components/ui/FadeIn";
import { AdminErrorBoundary } from "../../components/AdminErrorBoundary";
import { getAllProjects } from "app/modules/common/db";
import { getSessionCookie, verify } from "~/modules/common/utils/auth";
import type { Project } from "~/database/schema";
import type { Route } from "../../+types/route";

export async function loader({ request, context }: Route.LoaderArgs) {
  const unauthorized = () =>
    data({ projects: [], error: "Unauthorized" }, { status: 401 });

  const sessionValue = getSessionCookie(request);
  const jwtSecret = context.cloudflare?.env?.JWT_SECRET;
  if (!sessionValue || !jwtSecret || !(await verify(sessionValue, jwtSecret))) {
    return unauthorized();
  }

  try {
    const projects = await getAllProjects(context.db);
    return data({ projects, error: undefined });
  } catch (error) {
    return data(
      { projects: [], error: "Failed to load projects" },
      { status: 500 }
    );
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
