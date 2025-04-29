import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("modules/home/route.tsx"),
  route("projects", "modules/projects/route.tsx", [
    index("modules/projects/pages/index.tsx"),
    route(":projectId", "modules/projects/pages/detail.tsx"),
  ]),
  route("admin", "modules/admin/route.tsx", [
    index("routes/admin.index.tsx"), // Dashboard (Text Content & Image Uploads)
    route("upload", "routes/admin.upload.tsx"), // Image upload action
    route("projects", "routes/admin/projects/index.tsx", [
      // Project List
      route("new", "routes/admin/projects/new.tsx"), // Add New Project Form
      route(":projectId/edit", "routes/admin/projects/edit.tsx"), // Edit Project Form
      route(":projectId/delete", "routes/admin/projects/delete.tsx"), // Delete Project Action
    ]),
  ]),
  route("admin/login", "routes/admin.login.tsx"),
  route("admin/logout", "routes/admin.logout.tsx"),
] satisfies RouteConfig;
