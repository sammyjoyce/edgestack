import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("modules/home/route.tsx"),
  route("projects", "modules/projects/route.tsx", [
    index("modules/projects/pages/index.tsx"),
    route(":projectId", "modules/projects/pages/detail.tsx"),
  ]),
  route("admin", "modules/admin/route.tsx", [
    index("modules/admin/pages/index.tsx"), // Dashboard (Text Content & Image Uploads)
    route("upload", "modules/admin/pages/upload.tsx"), // Image upload action
    route("projects", "modules/admin/pages/projects/index.tsx", [
      // Project List
      route("new", "modules/admin/pages/projects/new.tsx"), // Add New Project Form
      route(":projectId/edit", "modules/admin/pages/projects/edit.tsx"), // Edit Project Form
      route(":projectId/delete", "modules/admin/pages/projects/delete.tsx"), // Delete Project Action
    ]),
  ]),
  route("admin/login", "modules/admin/pages/login.tsx"),
  route("admin/logout", "modules/admin/pages/logout.tsx"),
] satisfies RouteConfig;
