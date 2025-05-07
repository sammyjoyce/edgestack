import { asc, desc, eq } from "drizzle-orm";
import type { DrizzleD1Database, D1Result } from "drizzle-orm/d1";
import type { NewContent, NewProject, Project } from "~/database/schema";
import * as schema from "~/database/schema";

/**
 * DIAGNOSTIC V3.1: Use Drizzle query builder, but explicitly read-then-write for each key.
 * This version fetches all content rows and builds a Record<string, string> map.
 */
export async function getAllContent(
	db: DrizzleD1Database<typeof schema>,
): Promise<Record<string, string>> {
	console.log(
		"[Content Retrieval - DIAGNOSTIC V3.1] Fetching all content rows at:",
		new Date().toISOString(),
	);

	const rows = await db.select().from(schema.content).all();
	console.log(
		`[Content Retrieval - DIAGNOSTIC V3.1] Retrieved ${rows.length} rows from content table.`,
	);

	const contentMap: Record<string, string> = {};
	for (const row of rows) {
		if (typeof row.key === "string" && typeof row.value === "string") {
			contentMap[row.key] = row.value;
		}
	}
	console.log(
		`[Content Retrieval - DIAGNOSTIC V3.1] Mapped ${Object.keys(contentMap).length} keys:`,
		Object.keys(contentMap),
	);
	return contentMap;
}

/**
 * DIAGNOSTIC V3.1: Use Drizzle query builder, but explicitly read-then-write for each key.
 * For each update, check if the key exists; if so, update, else insert.
 * Insert uses explicit field values and schema defaults.
 */
export async function updateContent(
	db: DrizzleD1Database<typeof schema>,
	updates: Record<
		string,
		string | (Partial<Omit<NewContent, "key">> & { value: string })
	>,
): Promise<D1Result<unknown>[]> {
	const results: D1Result<unknown>[] = [];
	for (const [key, valueOrObj] of Object.entries(updates)) {
		const dataToSet =
			typeof valueOrObj === "string"
				? { value: valueOrObj }
				: valueOrObj;

		// Always require value to be a string
		if (typeof dataToSet.value !== "string") {
			console.warn(
				`[Content Update - DIAGNOSTIC V3.1] Skipping key '${key}' because value is not a string.`,
			);
			continue;
		}

		// Check if the key exists
		const existing = await db
			.select()
			.from(schema.content)
			.where(eq(schema.content.key, key))
			.get();

		const now = new Date();
		if (existing) {
			// Update only the provided fields
			const updatePayload: Partial<NewContent> = {
				value: dataToSet.value,
				updatedAt: now,
			};
			if ("type" in dataToSet && typeof dataToSet.type === "string") {
				updatePayload.type = dataToSet.type;
			}
			if ("sortOrder" in dataToSet && typeof dataToSet.sortOrder === "number") {
				updatePayload.sortOrder = dataToSet.sortOrder;
			}
			console.log(
				`[Content Update - DIAGNOSTIC V3.1] Updating existing key '${key}' with:`,
				updatePayload,
			);
			const result = await db
				.update(schema.content)
				.set(updatePayload)
				.where(eq(schema.content.key, key))
				.run();
			console.log(
				`[Content Update - DIAGNOSTIC V3.1] D1 result for UPDATE '${key}':`,
				{ success: result.success, changes: result.changes, rows_written: result.meta?.rows_written },
			);
			results.push(result);
		} else {
			// Insert with all required fields, using schema defaults if not provided
			const insertValue: NewContent = {
				key,
				value: dataToSet.value,
				type: "type" in dataToSet && typeof dataToSet.type === "string" ? dataToSet.type : "text",
				sortOrder: "sortOrder" in dataToSet && typeof dataToSet.sortOrder === "number" ? dataToSet.sortOrder : 0,
				createdAt: now,
				updatedAt: now,
			};
			console.log(
				`[Content Update - DIAGNOSTIC V3.1] Inserting new key '${key}' with:`,
				insertValue,
			);
			const result = await db
				.insert(schema.content)
				.values(insertValue)
				.run();
			console.log(
				`[Content Update - DIAGNOSTIC V3.1] D1 result for INSERT '${key}':`,
				{ success: result.success, changes: result.changes, rows_written: result.meta?.rows_written },
			);
			results.push(result);
		}
	}
	return results;
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
