import clsx from "clsx";
import React from "react";
import { Link, data, useOutletContext } from "react-router";
import { ConditionalRichTextRenderer } from "~/routes/common/components/ConditionalRichTextRenderer";
import { FadeIn } from "~/routes/common/components/ui/FadeIn";
import type { loader as parentLayoutLoader } from "~/routes/projects/layout";
import { assert } from "~/utils/assert";
import type { Route } from "./+types/[projectId]";
import { fetchProjectDetails } from "./services";

export const loader = async ({
	params,
	context,
	request,
}: Route.LoaderArgs) => {
	assert(
		typeof params.projectId === "string",
		"params.projectId must be a string",
	);
	const projectId = Number(params.projectId);
	assert(!Number.isNaN(projectId), "projectId must be a valid number");
	try {
		const project = await fetchProjectDetails(context.db, projectId);
		assert(
			project && typeof project === "object" && project.id != null,
			"loader must return a project",
		);
		return { project };
	} catch (error: unknown) {
		const message =
			error instanceof Error ? error.message : "Failed to load project details";
		throw data({ message }, { status: 500 });
	}
};

export function ProjectDetailRoute({
	loaderData,
	params: routeParams,
}: Route.ComponentProps) {
	const { project } = loaderData;
	const { content } =
		useOutletContext<Awaited<ReturnType<typeof parentLayoutLoader>>>();
	const projectDetailTheme =
		project && content[`project_${project.id}_theme`] === "dark"
			? "dark"
			: "light";
	return (
		<div
			className={clsx(
				"py-16 bg-white dark:bg-gray-950",
				projectDetailTheme === "dark" && "dark",
			)}
		>
			<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
				<FadeIn>
					<article className="bg-gray-50 p-6 rounded-lg shadow-md dark:bg-gray-800">
						{project.image_url && (
							<img
								src={project.image_url}
								alt={project.title}
								className="w-full h-64 md:h-96 object-cover rounded-md mb-6 bg-gray-200 dark:bg-gray-700"
							/>
						)}
						<h2 className="text-3xl font-serif font-bold text-black dark:text-white mb-4">
							{project.title}
						</h2>
						<ConditionalRichTextRenderer
							text={project.description}
							fallbackClassName="text-lg text-gray-700 dark:text-gray-300 mb-4"
							richTextClassName={clsx(
								"prose-lg mb-4", // Prose size modifier
								"prose-p:text-gray-700 dark:prose-p:text-gray-300",
								"prose-headings:text-gray-700 dark:prose-headings:text-gray-300",
								"prose-strong:text-gray-700 dark:prose-strong:text-gray-300",
								"prose-em:text-gray-700 dark:prose-em:text-gray-300",
								"prose-a:text-gray-700 dark:prose-a:text-gray-300 hover:prose-a:underline",
								"prose max-w-none",
							)}
							fallbackTag="p"
						/>
						{project.details && (
							<div
								className={clsx(
									"prose prose-sm mt-4 mb-6",
									projectDetailTheme === "dark" && "dark:prose-invert",
								)}
							>
								<h3 className="font-semibold text-gray-800 dark:text-gray-200">
									Details:
								</h3>
								<ConditionalRichTextRenderer
									text={project.details}
									fallbackClassName="not-prose text-sm text-gray-600 dark:text-gray-400"
									richTextClassName={clsx(
										"prose-p:text-gray-600 dark:prose-p:text-gray-400",
										"prose-headings:text-gray-600 dark:prose-headings:text-gray-400",
										"prose-strong:text-gray-600 dark:prose-strong:text-gray-400",
										"prose-em:text-gray-600 dark:prose-em:text-gray-400",
										"prose-a:text-gray-600 dark:prose-a:text-gray-400 hover:prose-a:underline",
									)}
									fallbackTag="div"
								/>
							</div>
						)}
						<Link
							to="/projects"
							className="inline-block text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
						>
							← Back to Projects
						</Link>
					</article>
				</FadeIn>
			</div>
		</div>
	);
}

export default ProjectDetailRoute;
