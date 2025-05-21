import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { Project } from "~/database/schema";
import { getAllProjects, getProjectById } from "~/services/db.server";
import type * as schema from "../../../../database/schema";

export async function fetchAdminProjectsList(
	db: DrizzleD1Database<typeof schema>,
): Promise<Project[]> {
	try {
		return await getAllProjects(db);
	} catch (error) {
		throw new Error(
			`fetchAdminProjectsList failed: ${
				error instanceof Error ? error.message : String(error)
			}`,
		);
	}
}

export async function fetchAdminProject(
	db: DrizzleD1Database<typeof schema>,
	id: number,
): Promise<Project> {
	try {
		const project = await getProjectById(db, id);
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
