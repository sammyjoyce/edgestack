import { asc, desc, eq, sql } from "drizzle-orm";
import type { BatchItem, BatchResponse } from "drizzle-orm/batch";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import { validateContentUpdate } from "../../../../database/valibot-validation";
import { assert } from "~/routes/common/utils/assert";
import type {
	NewContent,
	NewProject,
	Project,
	Content // Assuming Content type is needed
} from "../../../../database/schema";
import * as schema from "../../../../database/schema";

// Example: Prepare statement for getProjectById
// This assumes 'db' will be passed in, and the prepared statement will be bound to that instance.
// For true persistence of prepared statements across requests in a serverless worker,
// the Drizzle instance itself would need to be persistent (e.g., global or in a Durable Object).
// However, preparing it here still offers benefits if getProjectById is called multiple times
// within the same request lifecycle with the same db instance.

let getProjectByIdPrepared: ReturnType<DrizzleD1Database<typeof schema>['select']['prepare']> | null = null;

function ensureGetProjectByIdPrepared(db: DrizzleD1Database<typeof schema>) {
	if (!getProjectByIdPrepared || getProjectByIdPrepared.session?.client !== db) { // Re-prepare if db instance changed
		getProjectByIdPrepared = db
			.select()
			.from(schema.projects)
			.where(eq(schema.projects.id, sql.placeholder("id")))
			.prepare();
	}
	return getProjectByIdPrepared;
}
export async function getAllContent(
	db: DrizzleD1Database<typeof schema>,
): Promise<Record<string, string>> {
	assert(db, "getAllContent: db is required");
	try {
		const rows = await db
			.select({ key: schema.content.key, value: schema.content.value, theme: schema.content.theme })
			.from(schema.content)
			.all();
		const contentMap: Record<string, string> = {};
		for (const row of rows) {
			if (typeof row.value === "string") {
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
			contentMap[`${row.key}_theme`] = row.theme ?? 'light';
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
	const statements: BatchItem<"sqlite">[] = []; 
	for (const [key, valueOrObj] of Object.entries(updates)) {
		if (key.endsWith("_theme")) {
			const baseKey = key.replace("_theme", "");
			const themeValue = typeof valueOrObj === 'string' ? valueOrObj as 'light' | 'dark' : 'light';
			if (themeValue === 'light' || themeValue === 'dark') {
				statements.push(db.update(schema.content).set({ theme: themeValue }).where(eq(schema.content.key, baseKey)));
			} else {
				console.warn(`Invalid theme value '${themeValue}' for key '${baseKey}_theme'. Defaulting to 'light'.`);
				statements.push(db.update(schema.content).set({ theme: 'light' }).where(eq(schema.content.key, baseKey)));
			}
			continue; 
		}
		const dataToSet =
			typeof valueOrObj === "string" ? { value: valueOrObj } : valueOrObj;
		const value = dataToSet.value;
		const page =
			typeof dataToSet.page === "string" ? dataToSet.page : undefined;
		const section =
			typeof dataToSet.section === "string" ? dataToSet.section : undefined;
		const type = dataToSet.type ?? undefined;
		const sortOrder = dataToSet.sortOrder ?? undefined;
		const mediaId = dataToSet.mediaId ?? null;
		const metadata = typeof dataToSet.metadata === "string" ? dataToSet.metadata : null;		
		const theme = dataToSet.theme as 'light' | 'dark' | undefined;
		const valuesPayload: schema.NewContent = {
			key,
			value,
			page,
			section,
			type,
			sortOrder,
			mediaId,
			metadata,
			theme: theme,
		};
		const setDataPayload: Partial<Omit<schema.Content, "updatedAt">> = {
			value,
		};
		if (page !== undefined) setDataPayload.page = page;
		if (section !== undefined) setDataPayload.section = section;
		if (type !== undefined) setDataPayload.type = type;
		if (sortOrder !== undefined) setDataPayload.sortOrder = sortOrder;
		if (mediaId !== undefined) setDataPayload.mediaId = mediaId;
		if (metadata !== undefined) setDataPayload.metadata = metadata;
		if (theme && (theme === 'light' || theme === 'dark')) setDataPayload.theme = theme;
		validateContentUpdate(setDataPayload);
		const upsertStatement = db
			.insert(schema.content)
			.values(valuesPayload)
			.onConflictDoUpdate({
				target: schema.content.key,
				set: setDataPayload,
			});
		statements.push(upsertStatement); 
	}
	try {
		if (statements.length === 0) {
			return Promise.resolve([]);
		}
		const results = await db.batch(
			statements as [BatchItem<"sqlite">, ...BatchItem<"sqlite">[]],
		);
		return results;
	} catch (batchError) {
		console.error("Error during batch content update:", batchError);
		if (batchError instanceof Error) {
			throw batchError;
		}
		throw new Error(
			typeof batchError === "string" ? batchError : JSON.stringify(batchError),
		);
	}
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

	const prepared = ensureGetProjectByIdPrepared(db);
	const result = await prepared.execute({ id });

	assert(
		!result || (result.length > 0 && typeof result[0] === "object" && "id" in result[0]) || result.length === 0,
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
