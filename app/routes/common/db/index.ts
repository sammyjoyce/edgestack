import { asc, desc, eq, sql } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { BatchItem, BatchResponse } from "drizzle-orm/batch";
// D1Result is not directly used for db.batch return type, BatchResponse is.
// D1Result might be relevant for individual .run() calls if needed.
import type { NewContent, NewProject, Project } from "~/database/schema";
import * as schema from "~/database/schema";
import { validateProjectUpdate, validateContentUpdate } from "~/database/valibot-validation";

// DIAGNOSTIC V4: Use Drizzle's sql template tag for direct interaction
export async function getAllContent(
	db: DrizzleD1Database<typeof schema>,
): Promise<Record<string, string>> {
	try {
		const rows = await db
			.select({ key: schema.content.key, value: schema.content.value })
			.from(schema.content)
			.all();
		
		const contentMap: Record<string, string> = {};
		for (const row of rows) {
			// row.value is parsed by Drizzle from the JSON string in DB
			if (typeof row.value === 'string') {
				contentMap[row.key] = row.value;
			} else if (row.value !== null && row.value !== undefined) {
				// For non-string JSON types (numbers, booleans) that are simple, String() is okay.
				// For objects/arrays, this might not be the desired string representation.
				if (typeof row.value === 'object') {
					// This warning helps identify if complex objects are being unexpectedly stringified.
					console.warn(`[db/getAllContent] Content value for key '${row.key}' is an object/array and will be coerced to string. Review if this is intended. Value: ${JSON.stringify(row.value)}`);
				}
				contentMap[row.key] = String(row.value);
			} else {
				// Handle null or undefined parsed JSON value, defaulting to empty string.
				contentMap[row.key] = ""; 
			}
		}
		return contentMap;

	} catch (error) {
		console.error(`Error fetching content:`, error);
		return {};
	}
}

export async function updateContent(
	db: DrizzleD1Database<typeof schema>,
	updates: Record<
		string,
		string | (Partial<Omit<NewContent, "key">> & { value: string })
	>,
): Promise<D1Result<unknown>[]> { // Correct return type for D1 batch
	const statements: BatchItem<"sqlite">[] = []; // Collect Drizzle statements

	for (const [key, valueOrObj] of Object.entries(updates)) {
		const dataToSet =
			typeof valueOrObj === "string"
				? { value: valueOrObj }
				: valueOrObj;

		if (typeof dataToSet.value !== "string") {
			console.warn(
				`Skipping content update for key '${key}' because value is not a string. Value: ${JSON.stringify(dataToSet.value)}`,
			);
			// Skip adding this item to the batch if its value is not a string
			continue;
		}

		const value = dataToSet.value;
		const page = typeof dataToSet.page === "string" ? dataToSet.page : undefined;
		const section = typeof dataToSet.section === "string" ? dataToSet.section : undefined;
		const type = dataToSet.type ?? undefined;
		const sortOrder = dataToSet.sortOrder ?? undefined;
		const mediaId = dataToSet.mediaId ?? null;
		const metadata = typeof dataToSet.metadata === "string" ? dataToSet.metadata : null;
		const currentTimestamp = new Date();

		const valuesPayload: schema.NewContent = {
			key,
			value,
			page,
			section,
			type,
			sortOrder,
			mediaId,
			metadata,
		};

		const setDataPayload: Partial<schema.Content> = {
			value,
			updatedAt: currentTimestamp,
		};
		if (page !== undefined) setDataPayload.page = page;
		if (section !== undefined) setDataPayload.section = section;
		if (type !== undefined) setDataPayload.type = type;
		if (sortOrder !== undefined) setDataPayload.sortOrder = sortOrder;
		if (mediaId !== undefined) setDataPayload.mediaId = mediaId;
		if (metadata !== undefined) setDataPayload.metadata = metadata;
		
		validateContentUpdate(setDataPayload);

		const upsertStatement = db
			.insert(schema.content)
			.values(valuesPayload)
			.onConflictDoUpdate({
				target: schema.content.key,
				set: setDataPayload,
			});
		statements.push(upsertStatement); // Add the Drizzle statement object
	}

	try {
		if (statements.length === 0) {
			// Return an empty array if there are no statements to execute
			return Promise.resolve([]);
		}
		// db.batch expects a non-empty array of Drizzle statement instances
		const results = await db.batch(statements as [BatchItem<"sqlite">, ...BatchItem<"sqlite">[]]);
		return results;
	} catch (batchError) {
		console.error(`Error during batch content update:`, batchError);
		// Rethrow or handle as appropriate for your application
		throw batchError;
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
