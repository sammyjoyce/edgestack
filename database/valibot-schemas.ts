import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-valibot";
import { content, media, projects } from "./schema";
import { number, object, string, enum_ as enumType, optional,picklist } from "valibot";
const ThemeEnum = { Light: "light", Dark: "dark" } as const;
type Theme = (typeof ThemeEnum)[keyof typeof ThemeEnum];
export const errorResponseSchema = object({
	error: string(),
	status: number(),
});
export const contentInsertSchema = createInsertSchema(content);
const contentSelectSchema = createSelectSchema(content, {
	theme: optional(picklist(Object.values(ThemeEnum))),
});
export const contentUpdateSchema = createUpdateSchema(content, {
	theme: optional(picklist(Object.values(ThemeEnum))),
});
export const projectInsertSchema = createInsertSchema(projects);
const projectSelectSchema = createSelectSchema(projects);
export const projectUpdateSchema = createUpdateSchema(projects);
export const mediaInsertSchema = createInsertSchema(media);
const mediaSelectSchema = createSelectSchema(media);
export const mediaUpdateSchema = createUpdateSchema(media);
