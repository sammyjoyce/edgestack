import React from "react";
import { useOutletContext } from "react-router";
import RecentProjects from "~/routes/common/components/RecentProjects";
import type { loader as parentLoader } from "~/routes/projects/views/_layout";
import type { Route } from "./+types/index";
export default function ProjectsIndexRoute() {
	const { content, projects = [] } =
		useOutletContext<Awaited<ReturnType<typeof parentLoader>>>();
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
