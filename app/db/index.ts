import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import * as schema from '../../database/schema';

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

// For more patterns, see: https://orm.drizzle.team/docs/querying