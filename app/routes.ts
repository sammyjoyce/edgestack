import { type RouteConfig, index, route, layout, prefix } from "@react-router/dev/routes";

// Define routes using the new architecture with module-by-route pattern
export default [
  
	// Home routes
	route("", "routes/home/route.tsx", [
		// index("routes/home/views/index.tsx"), // Assuming route.tsx handles the index view or Outlet
	]),

	// Projects routes
	route("projects", "./routes/projects/route.tsx", [
		index("./routes/projects/views/index.tsx"), // This can remain if route.tsx uses Outlet for index
		route(":projectId", "./routes/projects/views/[projectId].tsx"),
	]),

	// All admin routes under the "/admin" URL
	prefix("admin", [
		// First mount the login page before the sidebar
		route("login", "./routes/admin/views/login.tsx"),

		// Everything else lives in the sidebar‐layout
		layout("./routes/admin/route.tsx", [
			index("./routes/admin/views/index.tsx"),
			route("logout", "./routes/admin/views/logout.tsx"),
			route("upload", "./routes/admin/views/upload.tsx"),

			// Projects section with its own nested layout
			layout("./routes/admin/views/projects/_layout.tsx", [
				index("./routes/admin/views/projects/index.tsx"),
				route("new", "./routes/admin/views/projects/new.tsx"),
				route(":projectId/edit", "./routes/admin/views/projects/[projectId]/edit.tsx"),
				route(":projectId/delete", "./routes/admin/views/projects/[projectId]/delete.tsx"),
			]),
		]),
	]),
] satisfies RouteConfig;
