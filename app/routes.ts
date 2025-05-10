import {
	type RouteConfig,
	index, // Keep index helper
	layout,
	prefix, // Keep prefix helper
	route,
} from "@react-router/dev/routes";

export default [
	// Home routes
	// Assuming routes/home/route.tsx is the component for "/"
	// If it's a layout with an index child, it would be:
	// route("", "routes/home/route.tsx", { children: [index("routes/home/views/index.tsx")] }),
	route("", "routes/home/route.tsx"), // If it's just the page component for "/"

	// Projects routes
	// Assuming routes/projects/route.tsx is a layout for /projects/*
	route("projects", "./routes/projects/route.tsx", {
		children: [
			index("./routes/projects/views/index.tsx"), // Component for /projects
			route(":projectId", "./routes/projects/views/[projectId].tsx"), // Component for /projects/:projectId
		],
	}),

	// Admin section
	...prefix("admin", [
		// Login route is a direct child of /admin prefix
		route("login", "./routes/admin/views/login.tsx"),

		// Layout for all other admin routes, itself effectively at /admin
		layout("./routes/admin/views/_layout.tsx", [
			// For the path /admin (dashboard)
			index("./routes/admin/views/index.tsx"), // This will match /admin

			// For the path /admin/logout
			route("logout", "./routes/admin/views/logout.tsx"),

			// For the path /admin/upload
			route("upload", "./routes/admin/views/upload.tsx"),

			// Projects sub-section, paths relative to /admin
			route("projects", "./routes/admin/views/projects/index.tsx", { index: true }), // Matches /admin/projects
			route("projects/new", "./routes/admin/views/projects/new.tsx"), // Matches /admin/projects/new
			route(
				"projects/:projectId/edit",
				"./routes/admin/views/projects/[projectId]/edit.tsx",
			),
			route(
				"projects/:projectId/delete",
				"./routes/admin/views/projects/[projectId]/delete.tsx",
			),
		]),
	]),
] satisfies RouteConfig;
