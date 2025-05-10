import { parse } from "valibot";
import {
	contentInsertSchema,
	contentUpdateSchema,
	errorResponseSchema,
	mediaInsertSchema,
	mediaUpdateSchema,
	projectInsertSchema,
	projectUpdateSchema,
} from "./valibot-schemas";
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
export function validateContentUpdate(data: unknown) {
	return parse(contentUpdateSchema, data);
}
export function validateProjectUpdate(data: unknown) {
	return parse(projectUpdateSchema, data);
}
export function validateMediaUpdate(data: unknown) {
	return parse(mediaUpdateSchema, data);
}
