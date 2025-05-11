import clsx from "clsx";
import React from "react";
import { data, Link, useOutletContext } from "react-router";
import { ConditionalRichTextRenderer } from "~/routes/common/components/ConditionalRichTextRenderer";
import { FadeIn } from "~/routes/common/components/ui/FadeIn";
import { getProjectById } from "~/routes/common/db";
import { assert } from "~/routes/common/utils/assert";
// Removed type { Route } from "./+types/projectId"; as it's moved and renamed by another change
import type { Route } from "./+types/[projectId]";
import type { loader as parentLayoutLoader } from "~/routes/projects/views/_layout";

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
		const project = await getProjectById(context.db, projectId);
		assert(
			project && typeof project === "object" && project.id != null,
			"loader must return a project",
		);
		return { project };
	} catch (error: any) {
		throw data(
			{ message: error.message || "Failed to load project details" },
			{ status: 500 },
		);
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
						<img
							src={project.imageUrl ?? "/assets/placeholder.png"}
							alt={project.title}
							className="w-full h-64 md:h-96 object-cover rounded-md mb-6 bg-gray-200 dark:bg-gray-700"
						/>
						<h2 className="text-3xl font-serif font-bold text-black dark:text-white mb-4">
							{project.title}
						</h2>
						<ConditionalRichTextRenderer
							text={project.description}
							fallbackClassName="text-gray-700 dark:text-gray-300 text-lg mb-4"
							richTextClassName={clsx(
								projectDetailTheme === "dark" && "dark:prose-invert",
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
									fallbackClassName="text-gray-600 dark:text-gray-400"
									richTextClassName={clsx(
										projectDetailTheme === "dark" && "dark:prose-invert",
									)}
									fallbackTag="div"
								/>
							</div>
						)}
						<p className="text-gray-500 dark:text-gray-400 italic mb-6">
							Contact us for more information about similar projects.
						</p>
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
