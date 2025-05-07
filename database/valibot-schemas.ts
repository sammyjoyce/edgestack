import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-valibot";
import { content, media, projects } from "./schema";

// Error response schema for validation
import { number, object, string } from "valibot";
export const errorResponseSchema = object({
	error: string(),
	status: number(),
});

// Valibot schemas for runtime validation
export const contentInsertSchema = createInsertSchema(content);
const contentSelectSchema = createSelectSchema(content);
export const contentUpdateSchema = createUpdateSchema(content);

export const projectInsertSchema = createInsertSchema(projects);
const projectSelectSchema = createSelectSchema(projects);
export const projectUpdateSchema = createUpdateSchema(projects);

export const mediaInsertSchema = createInsertSchema(media);
const mediaSelectSchema = createSelectSchema(media);
export const mediaUpdateSchema = createUpdateSchema(media);
