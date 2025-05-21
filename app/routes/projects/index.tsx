import React from "react";
import { useOutletContext } from "react-router";
import RecentProjects from "~/routes/common/components/RecentProjects";
import type { loader as parentLoader } from "~/routes/projects/layout";

export default function ProjectsIndexRoute() {
	const { content, projects = [] } =
		useOutletContext<Awaited<ReturnType<typeof parentLoader>>>();
	return (
		<RecentProjects
			introTitle={content?.projects_intro_title}
			introText={content?.projects_intro_text}
			projects={projects}
		/>
	);
}
