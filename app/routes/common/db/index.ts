import { asc, desc, eq, sql } from "drizzle-orm";
import type { BatchItem } from "drizzle-orm/batch";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import { assert } from "~/routes/common/utils/assert";
import type {
	NewContent,
	NewProject,
	Project,
} from "../../../../database/schema";
import * as schema from "../../../../database/schema";
import { validateContentUpdate } from "../../../../database/valibot-validation";

// Example: Prepare statement for getProjectById
// This assumes 'db' will be passed in, and the prepared statement will be bound to that instance.
// For true persistence of prepared statements across requests in a serverless worker,
// the Drizzle instance itself would need to be persistent (e.g., global or in a Durable Object).
// However, preparing it here still offers benefits if getProjectById is called multiple times
// within the same request lifecycle with the same db instance.

let getProjectByIdPrepared: ReturnType<
	DrizzleD1Database<typeof schema>["select"]["prepare"]
> | null = null;

function ensureGetProjectByIdPrepared(db: DrizzleD1Database<typeof schema>) {
	if (
		!getProjectByIdPrepared ||
		getProjectByIdPrepared.session?.client !== db
	) {
		// Re-prepare if db instance changed
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
	console.info(`[DB getAllContent] Invoked at: ${new Date().toISOString()}`);
	assert(db, "getAllContent: db is required");
	try {
		const rows = await db
			.select({
				key: schema.content.key,
				value: schema.content.value, // Drizzle will parse this from JSON text
				theme: schema.content.theme,
			})
			.from(schema.content)
			.all();

		const contentMap: Record<string, string> = {};
		for (const row of rows) {
			// row.value is now the JS type Drizzle parsed from the JSON in DB
			// (e.g., string, number, boolean, object, array)
			if (row.value === null || row.value === undefined) {
				contentMap[row.key] = "";
			} else if (typeof row.value === 'string') {
				contentMap[row.key] = row.value;
			} else {
				// For non-string JS types (objects, arrays, numbers, booleans),
				// stringify them to fit Record<string, string>.
				contentMap[row.key] = JSON.stringify(row.value);
			}
			contentMap[`${row.key}_theme`] = row.theme ?? "light";
		}
		assert(typeof contentMap === "object", "getAllContent: must return object");
		console.info(`[DB getAllContent] Returning ${Object.keys(contentMap).length} keys. Sample (hero_title): '${contentMap['hero_title']}', (about_text_theme): '${contentMap['about_text_theme']}'`);
		return contentMap;
	} catch (error) {
		console.error("[DB getAllContent] Error fetching content:", error);
		// If parsing fails due to bad data, Drizzle might throw here.
		// After DB cleanup, this should be less likely.
		return {};
	}
}

export async function updateContent(
	db: DrizzleD1Database<typeof schema>,
	updates: Record<
		string,
		| string
		| number
		| boolean
		| Record<string, unknown>
		| Array<unknown>
		| (Partial<Omit<NewContent, "key">> & { 
				value: string | number | boolean | Record<string, unknown> | Array<unknown>; 
		  })
	>,
): Promise<D1Result<unknown>[]> {
	const statements: BatchItem<"sqlite">[] = [];
	for (const [key, rawValueOrObj] of Object.entries(updates)) {
		if (key.endsWith("_theme")) {
			const baseKey = key.replace("_theme", "");
			const themeValue =
				typeof rawValueOrObj === "string"
					? (rawValueOrObj as "light" | "dark")
					: "light";
			// Theme update logic remains the same
			if (themeValue === "light" || themeValue === "dark") {
				statements.push(
					db
						.update(schema.content)
						.set({ theme: themeValue })
						.where(eq(schema.content.key, baseKey)),
				);
			} else {
				statements.push(
					db
						.update(schema.content)
						.set({ theme: "light" })
						.where(eq(schema.content.key, baseKey)),
				);
			}
			continue;
		}

		let valueForDb: string | number | boolean | Record<string, unknown> | Array<unknown>;
		let page: string | undefined;
		let section: string | undefined;
		let type: string | undefined;
		let sortOrder: number | undefined;
		let mediaId: number | null | undefined = undefined;
		let metadata: string | null | undefined; 
		let themeForDb: "light" | "dark" | undefined;

		if (typeof rawValueOrObj === 'object' && rawValueOrObj !== null && 'value' in rawValueOrObj) {
			const objWithValue = rawValueOrObj as (Partial<Omit<NewContent, "key">> & { value: string | number | boolean | Record<string, unknown> | Array<unknown> });
			valueForDb = objWithValue.value; // This is the JS value Drizzle will handle
			page = typeof objWithValue.page === "string" ? objWithValue.page : undefined;
			section = typeof objWithValue.section === "string" ? objWithValue.section : undefined;
			type = objWithValue.type ?? undefined;
			sortOrder = objWithValue.sortOrder ?? undefined;
			mediaId = objWithValue.mediaId ?? null;
			// For metadata, if it's part of this complex object, it should ideally be a JS object/array too,
			// or already a JSON string if schema.content.metadata is also {mode: "json"}
			metadata = typeof objWithValue.metadata === 'string' ? objWithValue.metadata : (objWithValue.metadata as any);
			themeForDb = objWithValue.theme as "light" | "dark" | undefined;
		} else {
			valueForDb = rawValueOrObj as string | number | boolean | Record<string, unknown> | Array<unknown>;
		}

		// With mode: "json", Drizzle handles stringification of objects/arrays for `valueForDb`.
		// Primitives are also stored correctly as JSON.
		const valuesPayload: schema.NewContent = {
			key,
			value: valueForDb as any, // Pass the JS value directly to Drizzle
			page,
			section,
			type,
			sortOrder,
			mediaId,
			metadata: metadata as any, // Pass JS value or JSON string if metadata is also json mode
			theme: themeForDb,
		};

		const setDataPayload: Partial<Omit<schema.Content, "updatedAt" | "key">> = {
			value: valueForDb as any, // Pass the JS value directly to Drizzle
		};

		if (page !== undefined) setDataPayload.page = page;
		if (section !== undefined) setDataPayload.section = section;
		if (type !== undefined) setDataPayload.type = type;
		if (sortOrder !== undefined) setDataPayload.sortOrder = sortOrder;
		if (mediaId !== undefined) setDataPayload.mediaId = mediaId;
		if (metadata !== undefined) setDataPayload.metadata = metadata as any;
		if (themeForDb && (themeForDb === "light" || themeForDb === "dark")) setDataPayload.theme = themeForDb;

		// Re-enable validateContentUpdate if it's compatible with JS values for 'value' and 'metadata'
		// validateContentUpdate(setDataPayload); 

		const upsertStatement = db
			.insert(schema.content)
			.values(valuesPayload)
			.onConflictDoUpdate({
				target: schema.content.key,
				set: setDataPayload,
			});
		statements.push(upsertStatement);
	}

	console.info(`[DB updateContent] Preparing to execute ${statements.length} statements.`);
	if (statements.length === 0) {
		return Promise.resolve([]); // Return empty array if no statements
	}
	// Ensure statements is treated as a non-empty array for db.batch
	return db.batch(statements as [BatchItem<"sqlite">, ...BatchItem<"sqlite">[]]);
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
