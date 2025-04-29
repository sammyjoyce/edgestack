import { asc, desc, eq } from "@common/db/drizzle";
import { drizzle } from "@common/db/drizzle";
import type { NewContent } from "../../database/schema"; // Import asc for ordering
import * as schema from "../../database/schema";
import type { NewProject, Project } from "../../database/schema"; // Import Project types

// See: https://orm.drizzle.team/docs (Drizzle ORM official docs)
// Initialize Drizzle ORM with D1 database (Cloudflare D1 dialect)
// Explicitly type return to include $client property (Drizzle D1)
export function initDrizzle(d1: D1Database): ReturnType<typeof drizzle> {
  return drizzle(d1, { schema });
}

// Utility functions for working with content
// Retrieves all content as an object keyed by 'key'
export async function getAllContent(db: ReturnType<typeof initDrizzle>) {
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

// Get a single content item by key
async function getSingleContent(
  db: ReturnType<typeof initDrizzle>,
  key: string
) {
  return db
    .select()
    .from(schema.content)
    .where(eq(schema.content.key, key))
    .get();
}

// Update or insert content values (upsert)
// Accepts either:
//   { key1: "plain-value" }
//   { key2: { value: "value", page: "home", section: "hero", type: "text", mediaId: 3 } }
// so admin UIs can gradually move to the richer payload.
export async function updateContent(
  db: ReturnType<typeof initDrizzle>,
  updates: Record<
    string,
    string | (Partial<Omit<NewContent, "key">> & { value: string })
  >
) {
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
  return Promise.all(batch);
}

// Delete content by key
async function deleteContent(db: ReturnType<typeof initDrizzle>, key: string) {
  return db.delete(schema.content).where(eq(schema.content.key, key)).run();
}

// --- Project CRUD Functions ---

// Get all projects, ordered by creation date descending
export async function getAllProjects(
  db: ReturnType<typeof initDrizzle>
): Promise<Project[]> {
  // Order by sortOrder ascending, then createdAt descending as a fallback
  return db
    .select()
    .from(schema.projects)
    .orderBy(asc(schema.projects.sortOrder), desc(schema.projects.createdAt))
    .all();
}

// Get only featured projects, ordered by sortOrder
export async function getFeaturedProjects(
  db: ReturnType<typeof initDrizzle>
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
  db: ReturnType<typeof initDrizzle>,
  id: number
): Promise<Project | null> {
  const result = await db
    .select()
    .from(schema.projects)
    .where(eq(schema.projects.id, id))
    .get();
  return result ?? null; // Return null if not found
}

// Create a new project - Ensure isFeatured and sortOrder are handled
export async function createProject(
  db: ReturnType<typeof initDrizzle>,
  projectData: Omit<NewProject, "id" | "createdAt" | "updatedAt">
): Promise<Project> {
  // Ensure timestamps and defaults are set if not provided
  const dataWithDefaults = {
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
  db: ReturnType<typeof initDrizzle>,
  id: number,
  projectData: Partial<Omit<NewProject, "id" | "createdAt">>
): Promise<Project | null> {
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
  return result ?? null; // Return null if update failed or ID not found
}

// Delete a project by its ID
export async function deleteProject(
  db: ReturnType<typeof initDrizzle>,
  id: number
): Promise<{ success: boolean }> {
  const result = await db
    .delete(schema.projects)
    .where(eq(schema.projects.id, id))
    .run();
  // D1 returns results array; success if any rows were affected
  return { success: result.results.length > 0 };
}

// For more patterns, see: https://orm.drizzle.team/docs/querying
