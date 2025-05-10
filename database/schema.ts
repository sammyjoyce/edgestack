import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const content = sqliteTable("content", {
	key: text("key").primaryKey().notNull(), 
	page: text("page").notNull().default("global"), 
	section: text("section").default("default"), 
	type: text("type").notNull().default("text"), 
	theme: text("theme", { enum: ["light", "dark"] }).default("light"), 
	value: text("value", { mode: "json" }).notNull(), 
	mediaId: integer("media_id").references(() => media.id), 
	sortOrder: integer("sort_order").default(0).notNull(), 
	metadata: text("metadata", { mode: "json" }), 
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.default(sql`(strftime('%s', 'now'))`)
		.$onUpdate(() => new Date()), 
});
export type Content = typeof content.$inferSelect;
export type NewContent = typeof content.$inferInsert;
export const media = sqliteTable("media", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	url: text("url").notNull(), 
	alt: text("alt"), 
	width: integer("width"), 
	height: integer("height"), 
	createdAt: integer("created_at", { mode: "timestamp" }).default(
		sql`(strftime('%s', 'now'))`,
	),
});
export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;
export const projects = sqliteTable("projects", {
	id: integer("id").primaryKey({ autoIncrement: true }), 
	title: text("title").notNull(),
	description: text("description", { mode: "json" }), 
	details: text("details", { mode: "json" }), 
	imageUrl: text("image_url"), 
	slug: text("slug").unique(), 
	published: integer("published", { mode: "boolean" }).default(true), 
	isFeatured: integer("is_featured", { mode: "boolean" }).default(false), 
	sortOrder: integer("sort_order").default(0).notNull(), 
	createdAt: integer("created_at", { mode: "timestamp" }).default(
		sql`(strftime('%s', 'now'))`,
	),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.default(sql`(strftime('%s', 'now'))`)
		.$onUpdate(() => new Date()), 
});
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export const schema = {
	content,
	projects,
	media,
};
