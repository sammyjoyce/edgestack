import { asc, desc, eq, sql } from "drizzle-orm";
import type { DrizzleD1Database, D1Result } from "drizzle-orm/d1";
import type { NewContent, NewProject, Project } from "~/database/schema";
import * as schema from "~/database/schema";
import { validateProjectUpdate, validateContentUpdate } from "~/database/valibot-validation";

// DIAGNOSTIC V4: Use Drizzle's sql template tag for direct interaction
export async function getAllContent(
	db: DrizzleD1Database<typeof schema>,
): Promise<Record<string, string>> {
	const functionTimestamp = new Date().toISOString();
	console.log(
		`[Content Retrieval - DIAGNOSTIC V4] Fetching all content rows via Drizzle query builder at: ${functionTimestamp}`,
	);

	try {
		const rows = await db
			.select({ key: schema.content.key, value: schema.content.value })
			.from(schema.content)
			.all();
		
		console.log(
			`[Content Retrieval - DIAGNOSTIC V4] Retrieved ${rows.length} rows from content table at ${new Date().toISOString()}.`,
		);
		if (rows.length > 0) {
			console.log("[Content Retrieval - DIAGNOSTIC V4] First row:", JSON.stringify(rows[0]));
		}

		const contentMap: Record<string, string> = {};
		for (const row of rows) {
			// schema.content.value is NOT NULL, so row.value should not be null.
			// If it were nullable, `row.value === null ? "" : row.value` would be appropriate.
			contentMap[row.key] = row.value; 
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
		const page = typeof dataToSet.page === "string" ? dataToSet.page : undefined; // Let Drizzle handle schema default
		const section = typeof dataToSet.section === "string" ? dataToSet.section : undefined; // Let Drizzle handle schema default
		const type = dataToSet.type ?? undefined; // Let Drizzle handle schema default
		const sortOrder = dataToSet.sortOrder ?? undefined; // Let Drizzle handle schema default
		const mediaId = dataToSet.mediaId ?? null; // Explicitly null if not provided
		const metadata = typeof dataToSet.metadata === "string" ? dataToSet.metadata : null;
		const currentTimestamp = new Date();

		// Data for the VALUES clause of INSERT (needs to satisfy NewContent)
		const valuesPayload: schema.NewContent = {
			key,
			value,
			page,
			section,
			type,
			sortOrder,
			mediaId,
			metadata,
			// Drizzle's runtime default/hook handles updatedAt on insert if not provided
			// For explicit control or if DB defaults are preferred, set it here.
			// schema.content.updatedAt has a runtime default(new Date())
		};

		// Data for the SET clause of ON CONFLICT DO UPDATE
		const setDataPayload: Partial<schema.Content> = {
			value,
			updatedAt: currentTimestamp, // Drizzle's $onUpdate will also set this
		};
		if (page !== undefined) setDataPayload.page = page;
		if (section !== undefined) setDataPayload.section = section;
		if (type !== undefined) setDataPayload.type = type;
		if (sortOrder !== undefined) setDataPayload.sortOrder = sortOrder;
		if (mediaId !== undefined) setDataPayload.mediaId = mediaId; // handles null
		if (metadata !== undefined) setDataPayload.metadata = metadata;


		// Validate payloads (optional here if confident in data structure, but good for robustness)
		// validateContentInsert(valuesPayload); // May need adjustment if Drizzle defaults are not part of schema
		validateContentUpdate(setDataPayload);


		const upsertStatement = db
			.insert(schema.content)
			.values(valuesPayload)
			.onConflictDoUpdate({
				target: schema.content.key,
				set: setDataPayload,
			});
		promises.push(upsertStatement); // Add the statement itself, not its execution result
	}

	// Execute all upsert statements in a single batch
	try {
		// D1Result type for batch is D1Result<unknown>[]
		const results: D1Result<unknown>[] = await db.batch(promises);
		console.log(
			`[Content Update - DIAGNOSTIC V4] Batch operations completed at ${new Date().toISOString()}. Results:`,
			results.map(r => ({ success: r.success, error: r.error, changes: r.meta?.changes, written: r.meta?.rows_written })),
		);
		return results;
	} catch (batchError) {
		console.error(`[Content Update - DIAGNOSTIC V4] Error during batch operation:`, batchError);
		// Construct a D1Result-like array for consistent return type
		return updates.map(() => ({ success: false, error: String(batchError), meta: { error: String(batchError) } as any } as D1Result<unknown>));
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
	// Validate project data before updating
	validateProjectUpdate(projectData);

	const dataWithTimestamp = {
		...projectData,
		isFeatured: projectData.isFeatured, // Ensure boolean values are handled if undefined
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
