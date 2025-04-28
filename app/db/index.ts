import { drizzle } from 'drizzle-orm/d1';
import { eq, desc } from 'drizzle-orm'; // Import desc for ordering
import * as schema from '../../database/schema';
import type { NewProject, Project } from '../../database/schema'; // Import Project types

// See: https://orm.drizzle.team/docs (Drizzle ORM official docs)
// Initialize Drizzle ORM with D1 database (Cloudflare D1 dialect)
// Explicitly type return to include $client property (Drizzle D1)
export function initDrizzle(d1: D1Database): ReturnType<typeof drizzle> {
  return drizzle(d1, { schema });
}

// Utility functions for working with content
// Retrieves all content as an object keyed by 'key'
export async function getAllContent(db: ReturnType<typeof initDrizzle>) {
  const results = await db.select().from(schema.content).all();
  // Transform array of objects to a single object with key-value pairs
  return results.reduce((acc, { key, value }) => {
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
}

// Get a single content item by key
export async function getSingleContent(db: ReturnType<typeof initDrizzle>, key: string) {
  return db.select().from(schema.content).where(eq(schema.content.key, key)).get();
}

// Update or insert content values (upsert)
// Uses Drizzle's inferred type for insert values
export async function updateContent(
  db: ReturnType<typeof initDrizzle>, 
  updates: Record<string, string>
) {
  const batch = Object.entries(updates).map(([key, value]) => {
    const insertValue: typeof schema.content.$inferInsert = { key, value };
    return db
      .insert(schema.content)
      .values(insertValue)
      .onConflictDoUpdate({
        target: schema.content.key,
        set: { value }
      });
  });
  return Promise.all(batch);
}

// Delete content by key
export async function deleteContent(db: ReturnType<typeof initDrizzle>, key: string) {
  return db.delete(schema.content).where(eq(schema.content.key, key)).run();
}

// --- Project CRUD Functions ---

// Get all projects, ordered by creation date descending
export async function getAllProjects(db: ReturnType<typeof initDrizzle>): Promise<Project[]> {
  return db.select().from(schema.projects).orderBy(desc(schema.projects.createdAt)).all();
}

// Get a single project by its ID
export async function getProjectById(db: ReturnType<typeof initDrizzle>, id: number): Promise<Project | null> {
  const result = await db.select().from(schema.projects).where(eq(schema.projects.id, id)).get();
  return result ?? null; // Return null if not found
}

// Create a new project
export async function createProject(db: ReturnType<typeof initDrizzle>, projectData: NewProject): Promise<Project> {
  // Ensure timestamps are set if not provided
  const dataWithTimestamps = {
    ...projectData,
    createdAt: projectData.createdAt ?? new Date(),
    updatedAt: projectData.updatedAt ?? new Date(),
  };
  const result = await db.insert(schema.projects).values(dataWithTimestamps).returning().get();
  return result;
}

// Update an existing project
export async function updateProject(db: ReturnType<typeof initDrizzle>, id: number, projectData: Partial<NewProject>): Promise<Project | null> {
  // Update the 'updatedAt' timestamp
  const dataWithTimestamp = {
    ...projectData,
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
export async function deleteProject(db: ReturnType<typeof initDrizzle>, id: number): Promise<{ success: boolean }> {
  const result = await db.delete(schema.projects).where(eq(schema.projects.id, id)).run();
  // D1 returns changes > 0 on successful deletion
  return { success: result.changes > 0 }; 
}


// For more patterns, see: https://orm.drizzle.team/docs/querying
