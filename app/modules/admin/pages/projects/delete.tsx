import { data, redirect } from "react-router";
import type { Route } from "./+types/delete";
import { deleteProject } from "~/db";
import { getSessionCookie, verify } from "~/modules/common/utils/auth";

// No action defined here - handled by parent route /admin/projects
// export async function action({ request, params, context }: Route.ActionArgs) { ... }

// This route is action-only, so it doesn't need to render anything.
// Returning null is standard practice for action-only routes without UI.
export function Component(_props: Route.ComponentProps): null {
  return null;
}

  if (request.method !== "POST" && request.method !== "DELETE") {
    return badRequest("Invalid method");
  }

  const sessionValue = getSessionCookie(request);
  const jwtSecret = context.cloudflare?.env?.JWT_SECRET;
  if (!sessionValue || !jwtSecret || !(await verify(sessionValue, jwtSecret))) {
    return unauthorized();
  }

  const projectId = params.projectId
    ? Number.parseInt(params.projectId, 10)
    : Number.NaN;
  if (isNaN(projectId)) {
    return badRequest("Invalid Project ID");
  }

  try {
    const result = await deleteProject(context.db, projectId);

    if (!result.success) {
      // Redirecting anyway for now, but ideally show feedback.
    }

    // Redirect back to the project list after attempting deletion
    return redirect("/admin/projects");
  } catch (error: any) {
    // For now, redirect back. Consider flash messages or returning error data later.
    return redirect("/admin/projects");
  }
}

// This route is action-only, so it doesn't need to render anything.
// Returning null is standard practice for action-only routes without UI.
export function Component(_props: Route.ComponentProps): null {
  return null;
}
