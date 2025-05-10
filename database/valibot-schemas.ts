import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-valibot";
import { content, media, projects } from "./schema";
import { number, object, string, picklist, optional, nullable } from "valibot"; // Removed enumType, added nullable
const ThemeEnum = { Light: "light", Dark: "dark" } as const;
type Theme = (typeof ThemeEnum)[keyof typeof ThemeEnum];
export const errorResponseSchema = object({
	error: string(),
	status: number(),
});
export const contentInsertSchema = createInsertSchema(content, {
	mediaId: optional(nullable(number())), // mediaId is optional
});
const contentSelectSchema = createSelectSchema(content, {
	theme: optional(picklist(Object.values(ThemeEnum))),
	mediaId: optional(nullable(number())),
});
export const contentUpdateSchema = createUpdateSchema(content, {
	theme: optional(picklist(Object.values(ThemeEnum))),
	mediaId: optional(nullable(number())),
});
export const projectInsertSchema = createInsertSchema(projects, {
	imageId: optional(nullable(number())), // imageId is optional
	// Ensure other fields like description, details are handled if they can be null/undefined
	description: optional(nullable(string())),
	details: optional(nullable(string())),
});
const projectSelectSchema = createSelectSchema(projects, {
	imageId: optional(nullable(number())),
	description: optional(nullable(string())),
	details: optional(nullable(string())),
});
export const projectUpdateSchema = createUpdateSchema(projects, {
	imageId: optional(nullable(number())),
	description: optional(nullable(string())),
	details: optional(nullable(string())),
});
export const mediaInsertSchema = createInsertSchema(media);
const mediaSelectSchema = createSelectSchema(media);
export const mediaUpdateSchema = createUpdateSchema(media);
