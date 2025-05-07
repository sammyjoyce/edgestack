import {
  flatRoutes,
} from "@react-router/fs-routes";
import { type RouteConfig, index, route } from "@react-router/dev/routes";

// Define routes using the new architecture with module-by-route pattern
export default [
  ...(await flatRoutes({ appDirectory: "app/non-existent-directory" })),

	// Home routes
	route("", "routes/home/views/_layout.tsx", [
		index("routes/home/views/index.tsx"),
	]),

	// Projects routes
	route("projects", "routes/projects/views/_layout.tsx", [
		index("routes/projects/views/index.tsx"),
		route(":projectId", "routes/projects/views/[projectId].tsx"),
	]),

	// Admin login route (outside the admin layout with sidebar)
	route("admin/login", "routes/admin/views/login.tsx"),

	// Admin routes with sidebar layout (excludes login)
	route("admin", "routes/admin/views/_layout.tsx", [
		index("routes/admin/views/index.tsx"),
		route("logout", "routes/admin/views/logout.tsx"),
		route("upload", "routes/admin/views/upload.tsx"),
		route("projects", "routes/admin/views/projects/_layout.tsx", [
			index("routes/admin/views/projects/index.tsx"),
			route("new", "routes/admin/views/projects/new.tsx"),
			route(
				":projectId/edit",
				"routes/admin/views/projects/[projectId]/edit.tsx",
			),
			route(
				":projectId/delete",
				"routes/admin/views/projects/[projectId]/delete.tsx",
			),
		]),
	]),
] satisfies RouteConfig;
