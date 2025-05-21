import { asc, desc, eq, sql } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import { assert } from "~/utils/assert";
import * as schema from "./schema";
import type { NewProject, Project } from "./schema";

let getProjectByIdPrepared: ReturnType<
	DrizzleD1Database<typeof schema>["select"]["prepare"]
> | null = null;

function ensureGetProjectByIdPrepared(db: DrizzleD1Database<typeof schema>) {
	if (
		!getProjectByIdPrepared ||
		getProjectByIdPrepared.session?.client !== db
	) {
		getProjectByIdPrepared = db
			.select()
			.from(schema.projects)
			.where(eq(schema.projects.id, sql.placeholder("id")))
			.prepare();
	}
	return getProjectByIdPrepared;
}

export async function getAllProjects(
	db: DrizzleD1Database<typeof schema>,
): Promise<Project[]> {
	assert(db, "getAllProjects: db is required");
	const t0 = performance.now();
	const result = await db
		.select()
		.from(schema.projects)
		.orderBy(asc(schema.projects.sortOrder), desc(schema.projects.createdAt))
		.all();
	if (process.env.NODE_ENV !== "production")
		console.log(`getAllProjects took ${performance.now() - t0}ms`);
	assert(Array.isArray(result), "getAllProjects: must return array");
	return result;
}

export async function getFeaturedProjects(
	db: DrizzleD1Database<typeof schema>,
): Promise<Project[]> {
	assert(db, "getFeaturedProjects: db is required");
	const t0 = performance.now();
	const result = await db
		.select()
		.from(schema.projects)
		.where(eq(schema.projects.isFeatured, true))
		.orderBy(asc(schema.projects.sortOrder), desc(schema.projects.createdAt))
		.all();
	if (process.env.NODE_ENV !== "production")
		console.log(`getFeaturedProjects took ${performance.now() - t0}ms`);
	assert(Array.isArray(result), "getFeaturedProjects: must return array");
	return result;
}

export async function getProjectById(
	db: DrizzleD1Database<typeof schema>,
	id: number,
): Promise<Project | undefined> {
	assert(db, "getProjectById: db is required");
	assert(
		typeof id === "number" && !Number.isNaN(id),
		"getProjectById: id must be a number",
	);

	const prepared = ensureGetProjectByIdPrepared(db);
	const result = await prepared.execute({ id });

	assert(
		!result ||
			(result.length > 0 &&
				typeof result[0] === "object" &&
				"id" in result[0]) ||
			result.length === 0,
		"getProjectById: must return object or undefined",
	);
	return result[0];
}

export async function createProject(
	db: DrizzleD1Database<typeof schema>,
	projectData: Omit<NewProject, "id" | "createdAt" | "updatedAt">,
): Promise<Project> {
	assert(db, "createProject: db is required");
	assert(
		typeof projectData === "object",
		"createProject: projectData must be object",
	);
	const dataWithDefaults: Omit<NewProject, "id" | "createdAt" | "updatedAt"> = {
		...projectData,
		isFeatured: projectData.isFeatured ?? false,
		sortOrder: projectData.sortOrder ?? 0,
	};
	const result = await db
		.insert(schema.projects)
		.values(dataWithDefaults)
		.returning()
		.get();
	assert(
		result && typeof result === "object" && "id" in result,
		"createProject: must return project",
	);
	return result;
}

export async function updateProject(
	db: DrizzleD1Database<typeof schema>,
	id: number,
	projectData: Partial<Omit<NewProject, "id" | "createdAt">>,
): Promise<Project | undefined> {
	assert(db, "updateProject: db is required");
	assert(
		typeof id === "number" && !Number.isNaN(id),
		"updateProject: id must be a number",
	);
	const dataToUpdate: Partial<
		Omit<NewProject, "id" | "createdAt" | "updatedAt">
	> = {
		...projectData,
		isFeatured: projectData.isFeatured,
		sortOrder: projectData.sortOrder,
	};
	const result = await db
		.update(schema.projects)
		.set(dataToUpdate)
		.where(eq(schema.projects.id, id))
		.returning()
		.get();
	assert(
		!result || (typeof result === "object" && "id" in result),
		"updateProject: must return object or undefined",
	);
	return result;
}

export async function deleteProject(
	db: DrizzleD1Database<typeof schema>,
	id: number,
): Promise<{ success: boolean; meta?: unknown }> {
	assert(db, "deleteProject: db is required");
	assert(
		typeof id === "number" && !Number.isNaN(id),
		"deleteProject: id must be a number",
	);
	const result = await db
		.delete(schema.projects)
		.where(eq(schema.projects.id, id))
		.run();
	assert(
		typeof result.success === "boolean",
		"deleteProject: must return success boolean",
	);
	return { success: result.success, meta: result.meta };
}
