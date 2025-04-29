import { data, redirect } from "react-router";
import type { Route } from "./+types/delete";
import { deleteProject } from "~/db";
import { getSessionCookie, verify } from "~/modules/common/utils/auth";

// No action defined here - handled by parent route /admin/projects
// The action logic previously here is now in app/modules/admin/pages/projects/index.tsx

// This route is action-only, so it doesn't need to render anything.
// Returning null is standard practice for action-only routes without UI.
export function Component(_props: Route.ComponentProps): null {
  return null;
}

// The action logic is now handled by the parent route /admin/projects
// The code below was part of the original action and should be removed.

// This route is action-only, so it doesn't need to render anything.
// Returning null is standard practice for action-only routes without UI.
// export function Component(_props: Route.ComponentProps): null {
//   return null;
// }
