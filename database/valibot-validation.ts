import { parse } from "valibot";
import {
	contentInsertSchema,
	errorResponseSchema,
	mediaInsertSchema,
	projectInsertSchema,
} from "./valibot-schemas";

// Example validation functions for each table
export function validateContentInsert(data: unknown) {
	return parse(contentInsertSchema, data);
}

export function validateErrorResponse(data: unknown) {
	return parse(errorResponseSchema, data);
}

export function validateProjectInsert(data: unknown) {
	return parse(projectInsertSchema, data);
}

export function validateMediaInsert(data: unknown) {
	return parse(mediaInsertSchema, data);
}
