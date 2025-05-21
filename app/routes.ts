import {
	type RouteConfig,
	index,
	layout,
	prefix,
	route,
} from "@react-router/dev/routes";

export default [
	route("", "routes/home.tsx"),
	route("projects", "routes/projects.tsx", [
		index("./routes/projects/index.tsx"),
		route(":projectId", "./routes/projects/[projectId].tsx"),
	]),
	...prefix("admin", [
		route("login", "./routes/admin/login.tsx"),
		layout("routes/admin.tsx", [
			index("./routes/admin/index.tsx"),
			route("logout", "./routes/admin/logout.tsx"),
			route("upload", "./routes/admin/upload.tsx"),
			route("projects", "routes/admin/projects/index.tsx", [
				route("new", "./routes/admin/projects/new.tsx"),
				route(":projectId/edit", "routes/admin/projects/[projectId]/edit.tsx"),
				route(
					":projectId/delete",
					"routes/admin/projects/[projectId]/delete.tsx",
				),
			]),
		]),
	]),
] satisfies RouteConfig;
