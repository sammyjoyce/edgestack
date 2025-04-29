import { asc, desc, eq } from "@common/db/drizzle"; // Assuming drizzle export is handled here
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { NewContent, NewProject, Project } from "../../database/schema"; // Import asc for ordering // Import Project types
import * as schema from "../../database/schema";

import type { Content, NewContent, Project, NewProject } from "../../database/schema"; // Import types

// Utility functions for working with content
// Retrieves all content as an object keyed by 'key'
export async function getAllContent(
  db: DrizzleD1Database<typeof schema>
): Promise<Record<string, string>> { // Add return type
  const results = await db
    .select()
    .from(schema.content)
    .orderBy(
      asc(schema.content.sortOrder), // honour CMS ordering first
      asc(schema.content.key) // deterministic fallback
    )
    .all();
  // Transform array of objects to a single object with key-value pairs
  return results.reduce((acc, { key, value }) => {
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
}

// Update or insert content values (upsert)
// Accepts either:
//   { key1: "plain-value" }
//   { key2: { value: "value", page: "home", section: "hero", type: "text", mediaId: 3 } }
// so admin UIs can gradually move to the richer payload.
export async function updateContent(
  db: DrizzleD1Database<typeof schema>,
  updates: Record<
    string,
    string | (Partial<Omit<NewContent, "key">> & { value: string }) // Keep this complex type or simplify if possible
  >
): Promise<any> { // Consider a more specific return type if D1 batch provides one
  const batch = Object.entries(updates).map(([key, raw]) => {
    const data = typeof raw === "string" ? ({ value: raw } as const) : raw;

    const insertValue: typeof schema.content.$inferInsert = { key, ...data };
    return db
      .insert(schema.content)
      .values(insertValue)
      .onConflictDoUpdate({
        target: schema.content.key,
        set: { ...data, updatedAt: new Date() },
      });
  });
  // Use db.batch() for potentially better performance with D1
  return db.batch(batch);
}

// --- Project CRUD Functions ---

// Get all projects, ordered by sortOrder and creation date
export async function getAllProjects(
  db: DrizzleD1Database<typeof schema>
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
  db: DrizzleD1Database<typeof schema>
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
  id: number
): Promise<Project | undefined> { // D1 .get() returns T | undefined
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
  projectData: Omit<NewProject, "id" | "createdAt" | "updatedAt"> // Use Omit for clarity
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
  projectData: Partial<Omit<NewProject, "id" | "createdAt">>
): Promise<Project | undefined> { // D1 .get() returns T | undefined
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
  id: number
): Promise<{ success: boolean; meta?: unknown }> { // D1 run() returns D1Result
  const result = await db
    .delete(schema.projects)
    .where(eq(schema.projects.id, id))
    .run();
  // D1 run() result includes success and meta
  return { success: result.success, meta: result.meta };
}

// For more patterns, see: https://orm.drizzle.team/docs/querying
