import { parse, ValiError } from "valibot";
import {
	contentInsertSchema,
	contentUpdateSchema,
	errorResponseSchema,
	mediaInsertSchema,
	mediaUpdateSchema,
	projectInsertSchema,
	projectUpdateSchema,
} from "./valibot-schemas";

/**
 * Validates content insertion data.
 * @throws Error with validation message on failure
 */
export function validateContentInsert(data: unknown) {
	try {
		return parse(contentInsertSchema, data);
	} catch (error) {
		if (error instanceof ValiError) {
			throw new Error(`Content insert validation failed: ${error.message}`);
		}
		throw error;
	}
}

/**
 * Validates error response data.
 * @throws Error with validation message on failure
 */
export function validateErrorResponse(data: unknown) {
	try {
		return parse(errorResponseSchema, data);
	} catch (error) {
		if (error instanceof ValiError) {
			throw new Error(`ErrorResponse validation failed: ${error.message}`);
		}
		throw error;
	}
}

/**
 * Validates project insertion data.
 * @throws Error with validation message on failure
 */
export function validateProjectInsert(data: unknown) {
	try {
		return parse(projectInsertSchema, data);
	} catch (error) {
		if (error instanceof ValiError) {
			throw new Error(`Project insert validation failed: ${error.message}`);
		}
		throw error;
	}
}

/**
 * Validates media insertion data.
 * @throws Error with validation message on failure
 */
export function validateMediaInsert(data: unknown) {
	try {
		return parse(mediaInsertSchema, data);
	} catch (error) {
		if (error instanceof ValiError) {
			throw new Error(`Media insert validation failed: ${error.message}`);
		}
		throw error;
	}
}

/**
 * Validates content update data.
 * @throws Error with validation message on failure
 */
export function validateContentUpdate(data: unknown) {
	try {
		return parse(contentUpdateSchema, data);
	} catch (error) {
		if (error instanceof ValiError) {
			throw new Error(`Content update validation failed: ${error.message}`);
		}
		throw error;
	}
}

/**
 * Validates project update data.
 * @throws Error with validation message on failure
 */
export function validateProjectUpdate(data: unknown) {
	try {
		return parse(projectUpdateSchema, data);
	} catch (error) {
		if (error instanceof ValiError) {
			throw new Error(`Project update validation failed: ${error.message}`);
		}
		throw error;
	}
}

/**
 * Validates media update data.
 * @throws Error with validation message on failure
 */
export function validateMediaUpdate(data: unknown) {
	try {
		return parse(mediaUpdateSchema, data);
	} catch (error) {
		if (error instanceof ValiError) {
			throw new Error(`Media update validation failed: ${error.message}`);
		}
		throw error;
	}
}
