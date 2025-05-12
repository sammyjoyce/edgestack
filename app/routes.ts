import {
	index,
	layout,
	prefix,
	route,
	type RouteConfig,
} from "@react-router/dev/routes";

export default [
	route("", "routes/home/route.tsx"),
	route("projects", "routes/projects/route.tsx", [
		index("./routes/projects/views/index.tsx"),
		route(":projectId", "./routes/projects/views/[projectId].tsx"),
	]),
	...prefix("admin", [
		route("login", "./routes/admin/views/login.tsx"), // Login route moved here
		layout("routes/admin/views/_layout.tsx", [
			index("./routes/admin/views/index.tsx"),
			// login route removed from here
			route("logout", "./routes/admin/views/logout.tsx"),
			route("upload", "./routes/admin/views/upload.tsx"),
			route("projects", "routes/admin/views/projects/index.tsx", [
				route("new", "./routes/admin/views/projects/new.tsx"),
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
	]),
] satisfies RouteConfig;
