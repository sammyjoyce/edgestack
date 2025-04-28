import { redirect, data } from "react-router-dom";
import type { ActionFunctionArgs } from "react-router-dom";
import { deleteProject } from "../../../db/index";
import { getSessionCookie, verify } from "../../../utils/auth";

// Define CloudflareEnv type
interface CloudflareEnv {
  JWT_SECRET: string;
  db: any; 
}

// Action to handle deleting a project
export async function action({ request, params, context }: ActionFunctionArgs & { context: CloudflareEnv }) {
  // Ensure this action is triggered by a POST or DELETE request for safety
  // In a real app, use a Form with method="post" or a fetcher with method="delete"
  if (request.method !== "POST" && request.method !== "DELETE") {
     return data({ error: "Invalid method" }, { status: 405 });
  }

  const sessionValue = getSessionCookie(request);
  if (!sessionValue || !context.JWT_SECRET || !(await verify(sessionValue, context.JWT_SECRET))) {
    return data({ error: "Unauthorized" }, { status: 401 });
  }

  const projectId = params.projectId ? parseInt(params.projectId, 10) : NaN;
  if (isNaN(projectId)) {
    // Redirect back with an error message? Or return error data?
    // For now, redirecting back might be confusing without feedback.
    // Let's return an error status, though the list page doesn't handle this yet.
    return data({ error: "Invalid Project ID" }, { status: 400 }); 
  }

  try {
    const result = await deleteProject(context.db, projectId);

    if (!result.success) {
      // Handle case where deletion didn't happen (e.g., project not found)
      // Returning an error might be better, but requires handling in the list component.
      console.warn(`Failed to delete project with ID: ${projectId}`);
      // Redirecting anyway for now, but ideally show feedback.
    }

    // Redirect back to the project list after attempting deletion
    return redirect("/admin/projects");

  } catch (error: any) {
    console.error("Error deleting project:", error);
    // How to show this error? Redirecting might lose the context.
    // For now, redirect back. Consider flash messages or returning error data later.
    return redirect("/admin/projects"); 
  }
}

// This route is action-only, so it doesn't need to render anything.
// Returning null is standard practice for action-only routes without UI.
export default function AdminDeleteProject() {
  return null;
}
