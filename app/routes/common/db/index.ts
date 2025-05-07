import { asc, desc, eq } from "drizzle-orm"; // Use direct import
import type { DrizzleD1Database, D1Result } from "drizzle-orm/d1"; // Import D1Result
import type { NewContent, NewProject, Project } from "~/database/schema"; // Import asc for ordering // Import Project types
import * as schema from "~/database/schema";

// Remove duplicate import: import type { Content, NewContent, Project, NewProject } from "../../database/schema";

// Utility functions for working with content
// Retrieves all content as an object keyed by 'key'
export async function getAllContent(
	db: DrizzleD1Database<typeof schema>,
): Promise<Record<string, string>> {
	// DEBUG: Log when content is being retrieved
	console.log(
		"[Content Retrieval] Getting all content from database at:",
		new Date().toISOString(),
	);

	// Add return type
	const results = await db
		.select()
		.from(schema.content)
		.orderBy(
			asc(schema.content.sortOrder), // honour CMS ordering first
			asc(schema.content.key), // deterministic fallback
		)
		.all();

	// DEBUG: Log the content keys that were retrieved
	console.log(
		"[Content Retrieval] Retrieved",
		results.length,
		"content items with keys:",
		results.map((r) => r.key).join(", "),
	);

	// Transform array of objects to a single object with key-value pairs
	const contentMap = results.reduce(
		(acc, { key, value }) => {
			acc[key] = value;
			return acc;
		},
		{} as Record<string, string>,
	);

	// DEBUG: Log specific content values for debugging
	if (contentMap.hero_title) {
		console.log(
			"[Content Retrieval] Hero title content:",
			contentMap.hero_title,
		);
	}

	return contentMap;
}

/**
 * Update or insert content values (upsert) - DIAGNOSTIC V2.
 * This version does a SELECT first, then UPDATE or INSERT as needed.
 */
export async function updateContent(
	db: DrizzleD1Database<typeof schema>,
	updates: Record<
		string,
		string | (Partial<Omit<NewContent, "key">> & { value: string })
	>,
): Promise<D1Result<unknown>[]> {
	console.log(
		"[Content Update - DIAGNOSTIC V2] Content update requested at:",
		new Date().toISOString(),
	);
	console.log(
		"[Content Update - DIAGNOSTIC V2] Keys to update:",
		Object.keys(updates).join(", "),
	);

	const promises = Object.entries(updates).map(async ([key, raw]) => {
		const dataToSet = typeof raw === "string" ? { value: raw } : raw;
		// Ensure 'value' is always present in dataToSet for the update/insert
		if (typeof dataToSet.value !== 'string') {
			console.error(`[Content Update - DIAGNOSTIC V2] Invalid data for key ${key}: 'value' is missing or not a string.`);
			// Return a D1Result-like object indicating failure for this specific key
			return { success: false, meta: { error: `Invalid data for key ${key}` }, error: `Invalid data for key ${key}` } as unknown as D1Result<unknown>;
		}

		console.log(
			`[Content Update - DIAGNOSTIC V2] Processing key: ${key}, value: "${dataToSet.value}"`,
		);

		const existing = await db
			.select({ value: schema.content.value }) // Only select necessary field
			.from(schema.content)
			.where(eq(schema.content.key, key))
			.get();

		if (existing) {
			console.log(`[Content Update - DIAGNOSTIC V2] Updating existing key: ${key}`);
			return db
				.update(schema.content)
				.set({ ...dataToSet, updatedAt: new Date() })
				.where(eq(schema.content.key, key))
				.run();
		}
		
		console.log(`[Content Update - DIAGNOSTIC V2] Inserting new key: ${key}`);
		// Ensure all required fields for insert are present, or have defaults in schema
		const insertValue: typeof schema.content.$inferInsert = {
			key,
			value: dataToSet.value, // Explicitly use value from dataToSet
			page: dataToSet.page,
			section: dataToSet.section,
			type: dataToSet.type, // Will use schema default if undefined
			mediaId: dataToSet.mediaId,
			sortOrder: dataToSet.sortOrder, // Will use schema default if undefined
			// createdAt is handled by schema default
			updatedAt: new Date(),
		};
		return db.insert(schema.content).values(insertValue).run();
	});

	const results = await Promise.all(promises);

	console.log(
		"[Content Update - DIAGNOSTIC V2] All operations completed. Results:",
		results,
	);
	return results;
}

// --- Project CRUD Functions ---

// Get all projects, ordered by sortOrder and creation date
export async function getAllProjects(
	db: DrizzleD1Database<typeof schema>,
): Promise<Project[]> {
	// Order by sortOrder ascending, then createdAt descending as a fallback
	return db
		.select()
		.from(schema.projects)
		.orderBy(asc(schema.projects.sortOrder), desc(schema.projects.createdAt))
		.all();
}

// Get only featured projects, ordered by sortOrder and creation date
export async function getFeaturedProjects(
	db: DrizzleD1Database<typeof schema>,
): Promise<Project[]> {
	return db
		.select()
		.from(schema.projects)
		.where(eq(schema.projects.isFeatured, true))
		.orderBy(asc(schema.projects.sortOrder), desc(schema.projects.createdAt)) // Order by sortOrder, then creation date
		.all();
}

// Get a single project by its ID
export async function getProjectById(
	db: DrizzleD1Database<typeof schema>,
	id: number,
): Promise<Project | undefined> {
	// D1 .get() returns T | undefined
	const result = await db
		.select()
		.from(schema.projects)
		.where(eq(schema.projects.id, id))
		.get();
	return result; // Return undefined if not found (D1 behavior)
}

// Create a new project - Ensure isFeatured and sortOrder are handled
export async function createProject(
	db: DrizzleD1Database<typeof schema>,
	projectData: Omit<NewProject, "id" | "createdAt" | "updatedAt">, // Use Omit for clarity
): Promise<Project> {
	// Ensure timestamps and defaults are set if not provided
	const dataWithDefaults: NewProject = {
		...projectData,
		isFeatured: projectData.isFeatured ?? false,
		sortOrder: projectData.sortOrder ?? 0, // Default sort order might need adjustment based on desired behavior
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

// Update an existing project - Ensure isFeatured and sortOrder can be updated
export async function updateProject(
	db: DrizzleD1Database<typeof schema>,
	id: number,
	projectData: Partial<Omit<NewProject, "id" | "createdAt">>,
): Promise<Project | undefined> {
	// D1 .get() returns T | undefined
	// Update the 'updatedAt' timestamp
	const dataWithTimestamp = {
		...projectData,
		// Explicitly handle boolean conversion if needed, depending on form data
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
	return result; // Return undefined if update failed or ID not found
}

// Delete a project by its ID
export async function deleteProject(
	db: DrizzleD1Database<typeof schema>,
	id: number,
): Promise<{ success: boolean; meta?: unknown }> {
	// D1 run() returns D1Result
	const result = await db
		.delete(schema.projects)
		.where(eq(schema.projects.id, id))
		.run();
	// D1 run() result includes success and meta
	return { success: result.success, meta: result.meta };
}

// For more patterns, see: https://orm.drizzle.team/docs/querying
