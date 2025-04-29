import React from "react";
import { useOutletContext } from "react-router";
import RecentProjects from "../../components/RecentProjects";

// Define the type for the context passed from the parent route
type ProjectsContext = {
  content: { [key: string]: string } | undefined;
};

export default function ProjectsIndex() {
  // Get the content data from the parent route
  const { content } = useOutletContext<ProjectsContext>();

  return (
    <RecentProjects
      introTitle={content?.projects_intro_title ?? "Featured Projects"}
      introText={
        content?.projects_intro_text ??
        "Take a look at some of our recent work that demonstrates our expertise and dedication to excellence."
      }
    />
  );
}
