import React from "react";
import { useLoaderData } from "react-router";
import RecentProjects from "~/modules/common/components/RecentProjects";
import type { Project } from "~/database/schema";

export function ProjectsIndexRoute() {
  // Get the content and projects data from the parent route
  const { content, projects } = useLoaderData<{
    content: Record<string, string>;
    projects: Project[];
  }>();

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
