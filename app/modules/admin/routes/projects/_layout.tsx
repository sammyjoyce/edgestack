import React from "react";
import { Outlet, data } from "react-router";
import { FadeIn } from "~/modules/common/components/ui/FadeIn";
import { AdminErrorBoundary } from "../../components/AdminErrorBoundary";
import { getAllProjects } from "app/modules/common/db";
import { getSessionCookie, verify } from "~/modules/common/utils/auth";
import type { Project } from "~/database/schema";
// Import generated types
import type {
  Route, // Use generated Route type
  LoaderData,
} from "../../../../.react-router/types/app/modules/admin/routes/projects/_layout";
import { type TypedResponse } from "react-router"; // Import TypedResponse

export async function loader({
  request,
  context,
}: Route.LoaderArgs): Promise<TypedResponse<LoaderData>> { // Use generated Route.LoaderArgs and TypedResponse
  const unauthorized = () =>
    // Ensure shape matches LoaderData
    data({ projects: [], error: "Unauthorized" } satisfies LoaderData, {
      status: 401,
    });

  const sessionValue = getSessionCookie(request);
  const jwtSecret = context.cloudflare?.env?.JWT_SECRET;
  if (!sessionValue || !jwtSecret || !(await verify(sessionValue, jwtSecret))) {
    return unauthorized();
  }

    const projects = await getAllProjects(context.db);
    // Ensure shape matches LoaderData
    return data({ projects, error: undefined } satisfies LoaderData);
  } catch (error) {
    // Ensure shape matches LoaderData
    return data(
      { projects: [], error: "Failed to load projects" } satisfies LoaderData,
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
