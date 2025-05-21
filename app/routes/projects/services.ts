import type { Project } from "~/database/schema";
import type { CmsClient } from "~/services/cms.client";

export async function fetchProjectsList(
	cms: CmsClient,
): Promise<{ content: Record<string, string>; projects: Project[] }> {
	try {
		const content = await cms.getAllContent();
		const projects = await cms.getAllProjects();
		return { content, projects };
	} catch (error) {
		throw new Error(
			`fetchProjectsList failed: ${
				error instanceof Error ? error.message : String(error)
			}`,
		);
	}
}

export async function fetchProjectDetails(
	cms: CmsClient,
	id: number,
): Promise<Project> {
	try {
		const project = await cms.getProjectById(id);
		if (!project) throw new Error("Project not found");
		return project;
	} catch (error) {
		throw new Error(
			`fetchProjectDetails failed: ${
				error instanceof Error ? error.message : String(error)
			}`,
		);
	}
}
