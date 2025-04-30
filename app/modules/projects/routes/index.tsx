import React from "react";
// Import useLoaderData and the specific LoaderData type from the layout route
import { useLoaderData } from "react-router";
import type { LoaderData } from "../../../.react-router/types/app/modules/projects/routes/_layout";
import RecentProjects from "~/modules/common/components/RecentProjects";
import type { Project } from "~/database/schema";

export function ProjectsIndexRoute() {
  // Get the content and projects data from the layout loader
  const { content, projects } = useLoaderData() as LoaderData;

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
