import { asc, desc, eq, sql } from "drizzle-orm";
import type { DrizzleD1Database, D1Result } from "drizzle-orm/d1";
import type { NewContent, NewProject, Project } from "~/database/schema";
import * as schema from "~/database/schema";

// DIAGNOSTIC V4: Use Drizzle's sql template tag for direct interaction
export async function getAllContent(
	db: DrizzleD1Database<typeof schema>,
): Promise<Record<string, string>> {
	const functionTimestamp = new Date().toISOString();
	console.log(
		`[Content Retrieval - DIAGNOSTIC V4] Fetching all content rows via db.all(sql\`...\`) at: ${functionTimestamp}`,
	);

	try {
		const rows: Array<{ key: string; value: string | null }> = await db.all(sql`SELECT key, value FROM content`);
		
		console.log(
			`[Content Retrieval - DIAGNOSTIC V4] Retrieved ${rows.length} rows from content table at ${new Date().toISOString()}.`,
		);
		if (rows.length > 0) {
			console.log("[Content Retrieval - DIAGNOSTIC V4] First row:", JSON.stringify(rows[0]));
		}

		const contentMap: Record<string, string> = {};
		for (const row of rows) {
			if (row && typeof row.key === "string") {
				contentMap[row.key] = row.value === null ? "" : row.value; // Handle null values explicitly
			}
		}
		console.log(
			`[Content Retrieval - DIAGNOSTIC V4] Mapped ${Object.keys(contentMap).length} keys at ${new Date().toISOString()}:`,
			Object.keys(contentMap),
		);
		return contentMap;

	} catch (error) {
		console.error(`[Content Retrieval - DIAGNOSTIC V4] Error fetching content at ${new Date().toISOString()}:`, error);
		return {};
	}
}

// DIAGNOSTIC V4: Use Drizzle's sql template tag for direct interaction
export async function updateContent(
	db: DrizzleD1Database<typeof schema>,
	updates: Record<
		string,
		string | (Partial<Omit<NewContent, "key">> & { value: string })
	>,
): Promise<D1Result<unknown>[]> {
	const functionTimestamp = new Date().toISOString();
	console.log(
		`[Content Update - DIAGNOSTIC V4] Content update requested at: ${functionTimestamp}`,
	);
	console.log(
		`[Content Update - DIAGNOSTIC V4] Received updates (for context only): ${Object.keys(updates).join(", ")}`,
	);

	const promises: Promise<D1Result<unknown>>[] = [];

	for (const [key, valueOrObj] of Object.entries(updates)) {
		const dataToSet =
			typeof valueOrObj === "string"
				? { value: valueOrObj }
				: valueOrObj;

		if (typeof dataToSet.value !== "string") {
			console.warn(
				`[Content Update - DIAGNOSTIC V4] Skipping key '${key}' because value is not a string. Value: ${JSON.stringify(dataToSet.value)}`,
			);
			const skippedResult: D1Result<unknown> = { success: false, meta: { error: `Value for key ${key} not a string` } as any, error: `Value for key ${key} not a string` };
			promises.push(Promise.resolve(skippedResult));
			continue;
		}

		const value = dataToSet.value;
		const page = dataToSet.page ?? null;
		const section = dataToSet.section ?? null;
		const type = dataToSet.type ?? "text";
		const sortOrder = dataToSet.sortOrder ?? 0;
		const mediaId = dataToSet.mediaId ?? null;
		const updatedAt = new Date().toISOString();

		const existingRowPromise = db.get(sql`SELECT key FROM content WHERE key = ${key}`);

		const operationExecutionPromise = existingRowPromise.then(async (existingRow) => {
			let operationPromise: Promise<D1Result<unknown>>;
			if (existingRow) {
				console.log(
					`[Content Update - DIAGNOSTIC V4] Updating existing key '${key}' to value: '${value}' at ${new Date().toISOString()}`,
				);
				operationPromise = db.run(
					sql`UPDATE content SET value = ${value}, page = ${page}, section = ${section}, type = ${type}, sortOrder = ${sortOrder}, mediaId = ${mediaId}, updatedAt = ${updatedAt} WHERE key = ${key}`
				);
			} else {
				console.log(
					`[Content Update - DIAGNOSTIC V4] Inserting new key '${key}' with value: '${value}' at ${new Date().toISOString()}`,
				);
				const createdAt = updatedAt; 
				operationPromise = db.run(
					sql`INSERT INTO content (key, value, page, section, type, sortOrder, mediaId, createdAt, updatedAt) VALUES (${key}, ${value}, ${page}, ${section}, ${type}, ${sortOrder}, ${mediaId}, ${createdAt}, ${updatedAt})`
				);
			}
			return operationPromise.then(result => {
				console.log(
					`[Content Update - DIAGNOSTIC V4] D1 result for '${existingRow ? "UPDATE" : "INSERT"}' on key '${key}':`,
					{ success: result.success, changes: result.meta?.changes, rows_written: result.meta?.rows_written },
				);
				return result;
			});
		}).catch(error => {
			console.error(`[Content Update - DIAGNOSTIC V4] Error during DB operation for key '${key}':`, error);
			return { success: false, error: String(error), meta: { error: String(error) } } as unknown as D1Result<unknown>;
		});
		promises.push(operationExecutionPromise);
	}

	const results = await Promise.all(promises);
	console.log(
		`[Content Update - DIAGNOSTIC V4] All operations completed at ${new Date().toISOString()}. Results:`,
		results.map(r => ({ success: r.success, error: r.error, changes: r.meta?.changes, written: r.meta?.rows_written })),
	);
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
