import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("projects", "routes/projects.tsx", [
    index("routes/projects/index.tsx"),
    route(":projectId", "routes/projects/detail.tsx"),
  ]),
  route("admin", "routes/admin.tsx", [
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
