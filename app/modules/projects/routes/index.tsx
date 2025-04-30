import React from "react";
// Import useRouteLoaderData and the specific loader type from the layout route
import { useRouteLoaderData } from "react-router";
// Import the specific loader type from the layout route
import type { loader as projectsLayoutLoader } from "~/modules/projects/routes/_layout";
import RecentProjects from "~/modules/common/components/RecentProjects";
import type { Project } from "~/database/schema";

export function ProjectsIndexRoute() {
  // Get the content and projects data from the layout loader using useRouteLoaderData
  const layoutData = useRouteLoaderData<typeof projectsLayoutLoader>("routes/_layout");
  const content = layoutData?.content;
  const projects = layoutData?.projects ?? []; // Provide default empty array

  return (
    <RecentProjects
      introTitle={content?.projects_intro_title ?? "Featured Projects"}
      introText={
        content?.projects_intro_text ??
        "Take a look at some of our recent work that demonstrates our expertise and dedication to excellence."
      }
      projects={projects}
    />
  );
}

// Default export for backwards compatibility
export default ProjectsIndexRoute;
