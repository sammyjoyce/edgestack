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
				value: schema.content.value,
				theme: schema.content.theme,
			})
			.from(schema.content)
			.all();

		const contentMap: Record<string, string> = {};
		for (const row of rows) {
			if (row.value == null) {
				contentMap[row.key] = "";
			} else if (typeof row.value === "string") {
				contentMap[row.key] = row.value;
			} else {
				contentMap[row.key] = JSON.stringify(row.value);
			}
			contentMap[`${row.key}_theme`] = row.theme ?? "light";
		}

		console.info(
			`[DB getAllContent] Retrieved ${Object.keys(contentMap).length} entries`,
		);
		return contentMap;
	} catch (error) {
		console.error("[DB getAllContent] Error fetching content:", error);
		throw new Error(
			`Failed to fetch content: ${
				error instanceof Error ? error.message : "Unknown error"
			}`,
		);
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
		| (Partial<Omit<NewContent, "key">> & { value: unknown })
	>,
): Promise<D1Result<unknown>[]> {
	console.info(
		`[DB updateContent] Invoked with ${Object.keys(updates).length} updates at ${new Date().toISOString()}`,
	);
	assert(db, "updateContent: db is required");

	const statements: BatchItem<"sqlite">[] = [];
	for (const [key, raw] of Object.entries(updates)) {
		if (key.endsWith("_theme")) {
			const base = key.replace(/_theme$/, "");
			const theme =
				typeof raw === "string" && (raw === "light" || raw === "dark")
					? raw
					: "light";
			statements.push(
				db
					.update(schema.content)
					.set({ theme })
					.where(eq(schema.content.key, base)),
			);
			continue;
		}

		const payload: Omit<schema.NewContent, "key"> & { key: string } = {
			key,
		} as unknown as Omit<schema.NewContent, "key"> & { key: string };
		if (typeof raw === "object" && raw !== null && "value" in raw) {
			Object.assign(payload, raw as object);
		} else {
			payload.value = raw as unknown as string;
		}
		validateContentUpdate(payload);
		statements.push(
			db
				.insert(schema.content)
				.values(payload)
				.onConflictDoUpdate({ target: schema.content.key, set: payload }),
		);
	}

	if (statements.length === 0) {
		console.info("[DB updateContent] No updates to apply");
		return [];
	}

	try {
		console.info(
			`[DB updateContent] Executing ${statements.length} statements`,
		);
		const results = await db.batch(
			statements as [BatchItem<"sqlite">, ...BatchItem<"sqlite">[]],
		);
		return results;
	} catch (error) {
		console.error("[DB updateContent] Batch failed:", error);
		throw new Error(
			`Failed to update content: ${
				error instanceof Error ? error.message : "Unknown error"
			}`,
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
