import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text, index } from "drizzle-orm/sqlite-core";

export const content = sqliteTable(
	"content",
	{
		key: text("key").primaryKey().notNull(),
		page: text("page").notNull().default("global"),
		section: text("section").default("default"),
		type: text("type").notNull().default("text"),
		theme: text("theme", { enum: ["light", "dark"] }).default("light"),
		value: text("value", { mode: "json" }).notNull(),
		mediaId: integer("media_id").references(() => media.id),
		sortOrder: integer("sort_order").default(0).notNull(),
		metadata: text("metadata", { mode: "json" }),
		createdAt: integer("created_at", { mode: "timestamp" }).default(
			sql`CURRENT_TIMESTAMP`,
		),
		updatedAt: integer("updated_at", { mode: "timestamp" })
			.default(sql`CURRENT_TIMESTAMP`)
			.$onUpdate(() => new Date()),
	},
	(table) => [index("content_media_id_idx").on(table.mediaId)],
);

export type Content = typeof content.$inferSelect;
export type NewContent = typeof content.$inferInsert;

export const media = sqliteTable(
	"media",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		url: text("url").notNull(),
		alt: text("alt"),
		width: integer("width"),
		height: integer("height"),
		createdAt: integer("created_at", { mode: "timestamp" }).default(
			sql`CURRENT_TIMESTAMP`,
		),
		type: text("type", { enum: ["image", "video"] })
			.notNull()
			.default("image"),
		updatedAt: integer("updated_at", { mode: "timestamp" })
			.default(sql`CURRENT_TIMESTAMP`)
			.$onUpdate(() => new Date()),
	},
	(table) => [index("media_updated_at_idx").on(table.updatedAt)],
);

export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;

export const projects = sqliteTable(
	"projects",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		title: text("title").notNull(),
		description: text("description", { mode: "json" }).notNull(),
		details: text("details", { mode: "json" }),
		imageId: integer("image_id").references(() => media.id),
		slug: text("slug").unique(),
		published: integer("published", { mode: "boolean" }).default(true),
		isFeatured: integer("is_featured", { mode: "boolean" }).default(false),
		sortOrder: integer("sort_order").default(0).notNull(),
		createdAt: integer("created_at", { mode: "timestamp" }).default(
			sql`CURRENT_TIMESTAMP`,
		),
		updatedAt: integer("updated_at", { mode: "timestamp" })
			.default(sql`CURRENT_TIMESTAMP`)
			.$onUpdate(() => new Date()),
	},
	(table) => [index("projects_image_id_idx").on(table.imageId)],
);

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

// Define relationships
export const contentRelations = relations(content, ({ one }) => ({
	media: one(media, {
		fields: [content.mediaId],
		references: [media.id],
	}),
}));

export const mediaRelations = relations(media, ({ many }) => ({
	contents: many(content),
	projectsAsImage: many(projects, { relationName: "projectImage" }),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
	image: one(media, {
		fields: [projects.imageId],
		references: [media.id],
		relationName: "projectImage",
	}),
}));

export const schema = {
	content,
	projects,
	media,
	contentRelations,
	mediaRelations,
	projectsRelations,
};
