import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Define the schema for the content table
export const content = sqliteTable("content", {
	key: text("key").primaryKey().notNull(), // Text primary key
	page: text("page").notNull().default("global"), // Logical page this content belongs to
	section: text("section").default("default"), // Finer-grained grouping
	type: text("type").notNull().default("text"), // Content type (text, image, markdown, etc.)
	value: text("value", { mode: "json" }).notNull(), // Content value
	mediaId: integer("media_id").references(() => media.id), // Optional FK to media
	sortOrder: integer("sort_order").default(0).notNull(), // For ordered blocks
	metadata: text("metadata", { mode: "json" }), // JSON blob for extras
	updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).$onUpdate(() => new Date()), // Last update timestamp
});

// Type for content entry
export type Content = typeof content.$inferSelect;
export type NewContent = typeof content.$inferInsert;

// Define the schema for the media table
export const media = sqliteTable("media", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	url: text("url").notNull(), // Public URL (e.g. R2 or CDN)
	alt: text("alt"), // Accessible alt-text
	width: integer("width"), // px (optional)
	height: integer("height"), // px (optional)
	// Use sql('CURRENT_TIMESTAMP') for default insertion time in SQLite
	createdAt: integer("created_at", { mode: "timestamp" }).default(
		sql`(strftime('%s', 'now'))`
	),
});

export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;

// Define the schema for the projects table
export const projects = sqliteTable("projects", {
	id: integer("id").primaryKey({ autoIncrement: true }), // Auto-incrementing integer ID
	title: text("title").notNull(),
	description: text("description", { mode: "json" }), // Can be plain text or JSON string for rich text
	details: text("details", { mode: "json" }), // Optional field for location, duration, budget etc.
	imageUrl: text("image_url"), // Optional image URL
	slug: text("slug").unique(), // Pretty URL
	published: integer("published", { mode: "boolean" }).default(true), // 0 = false, 1 = true
	isFeatured: integer("is_featured", { mode: "boolean" }).default(false), // Flag for home page display. 0 = false, 1 = true
	sortOrder: integer("sort_order").default(0).notNull(), // Order on home page
	// Use sql('CURRENT_TIMESTAMP') for default insertion time in SQLite
	createdAt: integer("created_at", { mode: "timestamp" }).default(
		sql`(strftime('%s', 'now'))`
	),
	// $onUpdate is a Drizzle runtime feature, does not set DB trigger
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.default(sql`(strftime('%s', 'now'))`)
		.$onUpdate(() => new Date()), // Timestamp for last update
});

// Type for project entry
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

// Export the tables for use in migrations and queries
export const schema = {
	content,
	projects,
	media,
};
