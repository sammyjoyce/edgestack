import type { ProjectListOptions } from "~/database/projectRepo";
import type { Project } from "~/database/schema";
import type { CmsClient } from "~/services/cms.client";

export async function fetchAdminProjectsList(
	cms: CmsClient,
	options: ProjectListOptions = {},
): Promise<Project[]> {
	try {
		return await cms.getProjectsPage(options);
	} catch (error) {
		throw new Error(
			`fetchAdminProjectsList failed: ${
				error instanceof Error ? error.message : String(error)
			}`,
		);
	}
}

export async function fetchAdminProject(
	cms: CmsClient,
	id: number,
): Promise<Project> {
	try {
		const project = await cms.getProjectById(id);
		if (!project) throw new Error("Project not found");
		return project;
	} catch (error) {
		throw new Error(
			`fetchAdminProject failed: ${
				error instanceof Error ? error.message : String(error)
			}`,
		);
	}
}
