import { asc, desc, eq } from "drizzle-orm";
import type { DrizzleD1Database, D1Result } from "drizzle-orm/d1";
import type { NewContent, NewProject, Project } from "~/database/schema";
import * as schema from "~/database/schema";

// DIAGNOSTIC V3: Simplify getAllContent to focus on hero_title
export async function getAllContent(
	db: DrizzleD1Database<typeof schema>,
): Promise<Record<string, string>> {
	console.log(
		"[Content Retrieval - DIAGNOSTIC V3] Getting hero_title from database at:",
		new Date().toISOString(),
	);

	const heroTitleEntry = await db
		.select({ key: schema.content.key, value: schema.content.value })
		.from(schema.content)
		.where(eq(schema.content.key, "hero_title"))
		.get();

	if (heroTitleEntry) {
		console.log(
			`[Content Retrieval - DIAGNOSTIC V3] Retrieved hero_title: '${heroTitleEntry.value}'`,
		);
		return { hero_title: heroTitleEntry.value };
	}
	
	console.log("[Content Retrieval - DIAGNOSTIC V3] hero_title not found.");
	return {};
}

// DIAGNOSTIC V3: Simplify updateContent to focus on hero_title
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
		`[Content Update - DIAGNOSTIC V3] Attempting to update/insert ONLY '${testKey}' to '${testValue}' at:`,
		new Date().toISOString(),
	);
	
	// Log all incoming updates for context, even though we're ignoring them for the DB op
	console.log(
		"[Content Update - DIAGNOSTIC V3] Received updates object (for context only):",
		JSON.stringify(updates, null, 2),
	);

	const existing = await db
		.select({ value: schema.content.value }) // Only select necessary field
		.from(schema.content)
		.where(eq(schema.content.key, testKey))
		.get();

	let operationPromise: Promise<D1Result<unknown>>;

	if (existing) {
		console.log(`[Content Update - DIAGNOSTIC V3] Updating existing key: '${testKey}' to value: '${testValue}'`);
		operationPromise = db
			.update(schema.content)
			.set({ value: testValue, updatedAt: new Date() }) // Only update value and updatedAt
			.where(eq(schema.content.key, testKey))
			.run();
	} else {
		console.log(`[Content Update - DIAGNOSTIC V3] Inserting new key: '${testKey}' with value: '${testValue}'`);
		// For insert, ensure all non-nullable fields without defaults are provided.
		// Assuming 'page', 'section', 'type', 'mediaId', 'sortOrder' are nullable or have defaults.
		const insertValue: typeof schema.content.$inferInsert = {
			key: testKey,
			value: testValue,
			// page: undefined, // or some default if required and not nullable
			// section: undefined, // or some default
			// type: undefined, // or some default
			// mediaId: undefined, // or null if nullable
			// sortOrder: undefined, // or some default
			updatedAt: new Date(),
			// createdAt will use schema default
		};
		operationPromise = db.insert(schema.content).values(insertValue).run();
	}

	try {
		const result = await operationPromise;
		console.log(
			"[Content Update - DIAGNOSTIC V3] Operation for hero_title completed. Result:",
			JSON.stringify(result, null, 2),
		);
		return [result]; // Return as an array to match original signature
	} catch (error) {
		console.error("[Content Update - DIAGNOSTIC V3] Error during DB operation for hero_title:", error);
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
