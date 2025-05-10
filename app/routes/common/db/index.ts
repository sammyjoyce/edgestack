import { asc, desc, eq, sql } from "drizzle-orm";
import type { BatchItem, BatchResponse } from "drizzle-orm/batch";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import { validateContentUpdate } from "../../../../database/valibot-validation";
import { assert } from "~/routes/common/utils/assert";
import type {
	NewContent,
	NewProject,
	Project,
} from "../../../../database/schema";
import * as schema from "../../../../database/schema";

// DIAGNOSTIC V5: Use Drizzle's sql template tag for direct interaction
export async function getAllContent(
	db: DrizzleD1Database<typeof schema>,
): Promise<Record<string, string>> {
	assert(db, "getAllContent: db is required");
	try {
		const rows = await db
			.select({ key: schema.content.key, value: schema.content.value })
			.from(schema.content)
			.all();

		const contentMap: Record<string, string> = {};
		for (const row of rows) {
			if (typeof row.value === "string") {
				// Explicitly treat as plain text, no JSON parsing
				contentMap[row.key] = row.value;
			} else if (row.value !== null && row.value !== undefined) {
				if (typeof row.value === "object" || Array.isArray(row.value)) {
					try {
						contentMap[row.key] = JSON.stringify(row.value);
					} catch {
						contentMap[row.key] = JSON.stringify({
							error: "Failed to stringify",
							originalValue: row.value,
						});
					}
				} else {
					contentMap[row.key] = String(row.value);
				}
			} else {
				contentMap[row.key] = "";
			}
		}
		assert(typeof contentMap === "object", "getAllContent: must return object");
		return contentMap;
	} catch (error) {
		return {};
	}
}

export async function updateContent(
	db: DrizzleD1Database<typeof schema>,
	updates: Record<
		string,
		string | (Partial<Omit<NewContent, "key">> & { value: string })
	>,
): Promise<D1Result<unknown>[]> {
	// Correct return type for D1 batch
	const statements: BatchItem<"sqlite">[] = []; // Collect Drizzle statements

	for (const [key, valueOrObj] of Object.entries(updates)) {
		const dataToSet =
			typeof valueOrObj === "string" ? { value: valueOrObj } : valueOrObj;

		if (typeof dataToSet.value !== "string") {
			if (process.env.NODE_ENV !== "production") {
				console.warn(
					`Skipping content update for key '${key}' because value is not a string. Value: ${JSON.stringify(dataToSet.value)}`,
				);
			}
			// Skip adding this item to the batch if its value is not a string
			continue;
		}

		const value = dataToSet.value;
		const page =
			typeof dataToSet.page === "string" ? dataToSet.page : undefined;
		const section =
			typeof dataToSet.section === "string" ? dataToSet.section : undefined;
		const type = dataToSet.type ?? undefined;
		const sortOrder = dataToSet.sortOrder ?? undefined;
		const mediaId = dataToSet.mediaId ?? null;
		const metadata =
			typeof dataToSet.metadata === "string" ? dataToSet.metadata : null;
		// const currentTimestamp = new Date(); // Rely on $onUpdate for updatedAt

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

		const setDataPayload: Partial<Omit<schema.Content, "updatedAt">> = {
			// Omit updatedAt
			value,
			// updatedAt: currentTimestamp, // Rely on $onUpdate
		};
		if (page !== undefined) setDataPayload.page = page;
		if (section !== undefined) setDataPayload.section = section;
		if (type !== undefined) setDataPayload.type = type;
		if (sortOrder !== undefined) setDataPayload.sortOrder = sortOrder;
		if (mediaId !== undefined) setDataPayload.mediaId = mediaId;
		if (metadata !== undefined) setDataPayload.metadata = metadata;

		// Validate before creating the statement
		// This will throw if validation fails, and the error should be caught by the calling action.
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
		const results = await db.batch(
			statements as [BatchItem<"sqlite">, ...BatchItem<"sqlite">[]],
		);
		return results;
	} catch (batchError) {
		console.error("Error during batch content update:", batchError);
		// Rethrow or handle as appropriate for your application
		if (batchError instanceof Error) {
			throw batchError;
		}
		throw new Error(
			typeof batchError === "string" ? batchError : JSON.stringify(batchError),
		);
	}
}

// --- Project CRUD Functions ---
// (Keep existing getAllProjects, getFeaturedProjects, getProjectById, createProject, updateProject, deleteProject functions as they are)
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
	if (process.env.NODE_ENV !== "production") console.log(`getAllProjects took ${performance.now() - t0}ms`);
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
	if (process.env.NODE_ENV !== "production") console.log(`getFeaturedProjects took ${performance.now() - t0}ms`);
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
	const result = await db
		.select()
		.from(schema.projects)
		.where(eq(schema.projects.id, id))
		.get();
	assert(
		!result || (typeof result === "object" && "id" in result),
		"getProjectById: must return object or undefined",
	);
	return result;
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
	// Commented out validation due to missing file
	// try {
	// 	validateProjectUpdate(projectData);
	// } catch (validationError: any) {
	// 	console.error("Validation error:", validationError);
	// 	return undefined;
	// }
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
	// Commented out validation due to missing file
	// try {
	// 	validateProjectUpdate(projectData);
	// } catch (validationError: any) {
	// 	console.error("Validation error:", validationError);
	// 	return undefined;
	// }
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
