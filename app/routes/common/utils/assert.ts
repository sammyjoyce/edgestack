/**
 * Tiny runtime assertion helper for TigerStyle.
 * Throws an error if the condition is false.
 */
export function assert(
	condition: unknown,
	message?: string,
): asserts condition {
	if (!condition) {
		throw new Error(message || "Assertion failed");
	}
}
