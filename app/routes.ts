import {
  index,
  route,
  type RouteConfig,
  type RouteConfigEntry,
} from "@react-router/dev/routes";

const projectChildRoutes = [
  index("~/modules/projects/pages/index.tsx"),
  route(":projectId", "~/modules/projects/pages/detail.tsx"),
];

const adminProjectRoutes = [
  // Project CRUD
  route("new", "~/modules/admin/pages/projects/new.tsx"),
  route(":projectId/edit", "~/modules/admin/pages/projects/edit.tsx"),
  route(":projectId/delete", "~/modules/admin/pages/projects/delete.tsx"),
];

const adminRoutes = [
  index("~/modules/admin/pages/index.tsx"), // Dashboard
  route("upload", "~/modules/admin/pages/upload.tsx"), // Image upload
  route(
    "projects",
    "~/modules/admin/pages/projects/index.tsx",
    adminProjectRoutes
  ),
];

export default [
  index("~/modules/home/route.tsx"),
  route("projects", "~/modules/projects/route.tsx", projectChildRoutes),
  route("admin", "~/modules/admin/route.tsx", adminRoutes),

  // Auth routes kept flat for clarity
  route("admin/login", "~/modules/admin/pages/login.tsx"),
  route("admin/logout", "~/modules/admin/pages/logout.tsx"),
] satisfies RouteConfig;
