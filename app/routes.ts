import {
	type RouteConfig,
	type RouteConfigEntry,
	index,
	route,
} from "@react-router/dev/routes";

// Define routes using the new architecture with module-by-route pattern
export default [
	// Home routes
	route("", "routes/home/routes/_layout.tsx", [
		index("routes/home/routes/index.tsx"),
	]),

	// Projects routes
	route("projects", "routes/projects/routes/_layout.tsx", [
		index("routes/projects/routes/index.tsx"),
		route(":projectId", "routes/projects/routes/[projectId].tsx"),
	]),

	// Admin login route (outside the admin layout with sidebar)
	route("admin/login", "routes/admin/routes/login.tsx"),

	// Admin routes with sidebar layout (excludes login)
	route("admin", "routes/admin/routes/_layout.tsx", [
		index("routes/admin/routes/index.tsx"),
		route("logout", "routes/admin/routes/logout.tsx"),
		route("upload", "routes/admin/routes/upload.tsx"),
		route("projects", "routes/admin/routes/projects/_layout.tsx", [
			index("routes/admin/routes/projects/index.tsx"),
			route("new", "routes/admin/routes/projects/new.tsx"),
			route(
				":projectId/edit",
				"routes/admin/routes/projects/[projectId]/edit.tsx",
			),
			route(
				":projectId/delete",
				"routes/admin/routes/projects/[projectId]/delete.tsx",
			),
		]),
	]),
] satisfies RouteConfig;
