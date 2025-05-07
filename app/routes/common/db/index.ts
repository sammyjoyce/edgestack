import { asc, desc, eq } from "drizzle-orm";
import type { DrizzleD1Database, D1Result } from "drizzle-orm/d1";
import type { NewContent, NewProject, Project } from "~/database/schema";
import * as schema from "~/database/schema";

/**
 * DIAGNOSTIC V4: Use raw SQL for D1 to test if Drizzle is the problem.
 * This version uses db.execute() to directly run SQL for hero_title.
 */
export async function getAllContent(
	db: DrizzleD1Database<typeof schema>,
): Promise<Record<string, string>> {
	console.log(
		"[Content Retrieval - DIAGNOSTIC V4] Getting hero_title from database at:",
		new Date().toISOString(),
	);

	// Use raw SQL to bypass Drizzle's query builder
	const sql = `SELECT key, value FROM content WHERE key = ? LIMIT 1;`;
	const result = await db.execute(sql, ["hero_title"]);

	if (result && Array.isArray(result.rows) && result.rows.length > 0) {
		const row = result.rows[0];
		console.log(
			`[Content Retrieval - DIAGNOSTIC V4] Retrieved hero_title: '${row.value}'`,
		);
		return { hero_title: row.value };
	}

	console.log("[Content Retrieval - DIAGNOSTIC V4] hero_title not found.");
	return {};
}

/**
 * DIAGNOSTIC V4: Use raw SQL for D1 to test if Drizzle is the problem.
 * This version uses db.execute() to directly run SQL for hero_title.
 */
export async function updateContent(
	db: DrizzleD1Database<typeof schema>,
	updates: Record<
		string,
		string | (Partial<Omit<NewContent, "key">> & { value: string })
	>,
): Promise<D1Result<unknown>[]> {
	const testKey = "hero_title";
	const testValue = `Test Update @ ${new Date().toLocaleTimeString()}`;

	console.log(
		`[Content Update - DIAGNOSTIC V4] Attempting to update/insert ONLY '${testKey}' to '${testValue}' at:`,
		new Date().toISOString(),
	);

	// Log all incoming updates for context, even though we're ignoring them for the DB op
	console.log(
		"[Content Update - DIAGNOSTIC V4] Received updates object (for context only):",
		JSON.stringify(updates, null, 2),
	);

	// Use raw SQL for upsert (insert or update)
	const sql = `
		INSERT INTO content (key, value, updatedAt)
		VALUES (?, ?, ?)
		ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = excluded.updatedAt;
	`;
	const now = new Date().toISOString();

	try {
		const result = await db.execute(sql, [testKey, testValue, now]);
		console.log(
			"[Content Update - DIAGNOSTIC V4] Operation for hero_title completed. Result:",
			JSON.stringify(result, null, 2),
		);
		return [result]; // Return as an array to match original signature
	} catch (error) {
		console.error("[Content Update - DIAGNOSTIC V4] Error during DB operation for hero_title:", error);
		const errorResult = { success: false, error: String(error), meta: { error: String(error) } } as unknown as D1Result<unknown>;
		return [errorResult];
	}
}

// --- Project CRUD Functions ---
// (Keep existing getAllProjects, getFeaturedProjects, getProjectById, createProject, updateProject, deleteProject functions as they are)
export async function getAllProjects(
	db: DrizzleD1Database<typeof schema>,
): Promise<Project[]> {
	return db
		.select()
		.from(schema.projects)
		.orderBy(asc(schema.projects.sortOrder), desc(schema.projects.createdAt))
		.all();
}

export async function getFeaturedProjects(
	db: DrizzleD1Database<typeof schema>,
): Promise<Project[]> {
	return db
		.select()
		.from(schema.projects)
		.where(eq(schema.projects.isFeatured, true))
		.orderBy(asc(schema.projects.sortOrder), desc(schema.projects.createdAt))
		.all();
}

export async function getProjectById(
	db: DrizzleD1Database<typeof schema>,
	id: number,
): Promise<Project | undefined> {
	const result = await db
		.select()
		.from(schema.projects)
		.where(eq(schema.projects.id, id))
		.get();
	return result;
}

export async function createProject(
	db: DrizzleD1Database<typeof schema>,
	projectData: Omit<NewProject, "id" | "createdAt" | "updatedAt">,
): Promise<Project> {
	const dataWithDefaults: NewProject = {
		...projectData,
		isFeatured: projectData.isFeatured ?? false,
		sortOrder: projectData.sortOrder ?? 0,
		createdAt: new Date(),
		updatedAt: new Date(),
	};
	const result = await db
		.insert(schema.projects)
		.values(dataWithDefaults)
		.returning()
		.get();
	return result;
}

export async function updateProject(
	db: DrizzleD1Database<typeof schema>,
	id: number,
	projectData: Partial<Omit<NewProject, "id" | "createdAt">>,
): Promise<Project | undefined> {
	const dataWithTimestamp = {
		...projectData,
		isFeatured: projectData.isFeatured,
		sortOrder: projectData.sortOrder,
		updatedAt: new Date(),
	};
	const result = await db
		.update(schema.projects)
		.set(dataWithTimestamp)
		.where(eq(schema.projects.id, id))
		.returning()
		.get();
	return result;
}

export async function deleteProject(
	db: DrizzleD1Database<typeof schema>,
	id: number,
): Promise<{ success: boolean; meta?: unknown }> {
	const result = await db
		.delete(schema.projects)
		.where(eq(schema.projects.id, id))
		.run();
	return { success: result.success, meta: result.meta };
}
