export async function withTiming<T>(
	label: string,
	fn: () => Promise<T>,
): Promise<T> {
	const start = performance.now();
	try {
		return await fn();
	} finally {
		if (process.env.NODE_ENV !== "production") {
			const duration = performance.now() - start;
			console.log(`[timing] ${label} took ${duration.toFixed(2)}ms`);
		}
	}
}
