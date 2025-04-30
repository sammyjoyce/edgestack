import {
  index,
  route,
  type RouteConfig,
  type RouteConfigEntry,
} from "@react-router/dev/routes";

// Define routes using the new architecture with module-by-route pattern
export default [
  // Home routes
  route("", "modules/home/routes/_layout.tsx", [
    index("modules/home/routes/index.tsx"),
  ]),

  // Projects routes
  route("projects", "modules/projects/routes/_layout.tsx", [
    index("modules/projects/routes/index.tsx"),
    route(":projectId", "modules/projects/routes/[projectId].tsx"),
  ]),

  // Admin routes (all in one hierarchy, no flat routes)
  route("admin", "modules/admin/routes/_layout.tsx", [
    index("modules/admin/routes/index.tsx"),
    route("login", "modules/admin/routes/login.tsx"),
    route("logout", "modules/admin/routes/logout.tsx"),
    route("upload", "modules/admin/routes/upload.tsx"),
    route("projects", "modules/admin/routes/projects/_layout.tsx", [
      index("modules/admin/routes/projects/index.tsx"),
      route("new", "modules/admin/routes/projects/new.tsx"),
      route(
        ":projectId/edit",
        "modules/admin/routes/projects/[projectId]/edit.tsx"
      ),
      route(
        ":projectId/delete",
        "modules/admin/routes/projects/[projectId]/delete.tsx"
      ),
    ]),
  ]),
] satisfies RouteConfig;
