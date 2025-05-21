import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { Project } from "~/database/schema";
import type * as schema from "~/database/schema";
import {
	getAllContent,
	getAllProjects,
	getProjectById,
} from "~/services/db.server";

export async function fetchProjectsList(
	db: DrizzleD1Database<typeof schema>,
): Promise<{ content: Record<string, string>; projects: Project[] }> {
	try {
		const content = await getAllContent(db);
		const projects = await getAllProjects(db);
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
	db: DrizzleD1Database<typeof schema>,
	id: number,
): Promise<Project> {
	try {
		const project = await getProjectById(db, id);
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
