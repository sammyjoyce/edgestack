import React from "react";
import { useOutletContext } from "react-router";
import RecentProjects from "~/modules/common/components/RecentProjects";

export default function ProjectsIndex() {
  // Get the content data from the parent route
  const { content } = useOutletContext();

  return (
    <RecentProjects
      introTitle={content?.projects_intro_title ?? "Featured Projects"}
      introText={
        content?.projects_intro_text ??
        "Take a look at some of our recent work that demonstrates our expertise and dedication to excellence."
      }
      projects={[]}
    />
  );
}
