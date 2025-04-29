import React from "react";
import type { Route } from "./+types/index";
import { useOutletContext } from "react-router";
import type { Project } from "~/database/schema";

interface ProjectsContext {
  content?: { [key: string]: string };
  projects: Project[];
}
import RecentProjects from "~/modules/common/components/RecentProjects";

export default function ProjectsIndex(_props: Route.ComponentProps) {
  // Get the content data from the parent route
  // Get the content and projects data from the parent route
  const { content, projects } = useOutletContext<ProjectsContext>();

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
