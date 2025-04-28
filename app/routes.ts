import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("projects", "routes/projects.tsx", [
    index("routes/projects/index.tsx"),
    route(":projectId", "routes/projects/detail.tsx")
  ]),
  route("admin", "routes/admin.tsx", [
    index("routes/admin.index.tsx"),
    route("upload", "routes/admin.upload.tsx"),
  ]),
  route("admin/login", "routes/admin.login.tsx"),
  route("admin/logout", "routes/admin.logout.tsx"),
] satisfies RouteConfig;