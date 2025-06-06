import clsx from "clsx";
import { Outlet, data } from "react-router";
import type { Project } from "~/database/schema";
import Footer from "~/routes/common/components/Footer";
import Header from "~/routes/common/components/Header";
import { ProjectsErrorBoundary } from "../components/ProjectsErrorBoundary";
import { fetchProjectsList } from "../services";
import type { Route } from "./+types/_layout";

type ProjectsLayoutLoaderData = {
	content: Record<string, string>;
	projects: Project[];
	error?: string;
};
export const loader = async ({
	context,
	request,
	params,
}: Route.LoaderArgs) => {
	try {
		const { content, projects } = await fetchProjectsList(context.cms);
		return { content, projects };
	} catch (error: unknown) {
		console.error("Failed to fetch content or projects:", error);
		const message =
			error instanceof Error
				? error.message
				: "Failed to load projects layout data";
		throw data({ message }, { status: 500 });
	}
};

export function ProjectsLayout({ loaderData }: Route.ComponentProps) {
	const projectsPageIntroTheme =
		loaderData.content.projects_page_intro_theme === "dark" ? "dark" : "light";
	return (
		<div className="bg-linear-180/oklch from-0% from-gray-600/0 via-20% via-80% via-gray-600/10 to-100% to-gray-600/0">
			<Header
				hasProjects={loaderData.projects && loaderData.projects.length > 0}
			/>
			<div
				className={clsx(
					"pt-20 pb-10 bg-white text-gray-900 dark:bg-gray-900 dark:text-white",
					projectsPageIntroTheme === "dark" && "dark",
				)}
			>
				<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
					{loaderData.content.projects_page_title && (
						<h1 className="mb-4 text-center font-bold font-serif text-4xl text-black dark:text-white">
							{loaderData.content.projects_page_title}
						</h1>
					)}
					{loaderData.content.projects_page_intro && (
						<p className="mx-auto max-w-3xl text-center text-xl text-gray-700 dark:text-gray-300">
							{loaderData.content.projects_page_intro}
						</p>
					)}
				</div>
			</div>
			<Outlet context={loaderData} />
			<Footer />
		</div>
	);
}

export function ErrorBoundary() {
	return <ProjectsErrorBoundary />;
}

export default ProjectsLayout;
