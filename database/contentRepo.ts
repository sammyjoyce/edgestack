import { eq } from "drizzle-orm";
import type { BatchItem } from "drizzle-orm/batch";
import { assert } from "~/utils/assert";
import { withTiming } from "~/utils/timing";
import type { AppDatabase } from "./index";
import * as schema from "./schema";
import type { NewContent } from "./schema";
import { validateContentUpdate } from "./valibot-validation";

export async function getAllContent(
	db: AppDatabase,
): Promise<Record<string, string>> {
	console.info(`[DB getAllContent] Invoked at: ${new Date().toISOString()}`);
	assert(db, "getAllContent: db is required");
	try {
		const rows = await withTiming("getAllContent query", () =>
			db
				.select({
					key: schema.content.key,
					value: schema.content.value,
					theme: schema.content.theme,
				})
				.from(schema.content)
				.all(),
		);

		const contentMap: Record<string, string> = {};
		for (const row of rows) {
			if (row.value == null) {
				contentMap[row.key] = "";
			} else if (typeof row.value === "string") {
				contentMap[row.key] = row.value;
			} else {
				contentMap[row.key] = JSON.stringify(row.value);
			}
			contentMap[`${row.key}_theme`] = row.theme ?? "light";
		}

		console.info(
			`[DB getAllContent] Retrieved ${Object.keys(contentMap).length} entries`,
		);
		return contentMap;
	} catch (error) {
		console.error("[DB getAllContent] Error fetching content:", error);
		throw new Error(
			`Failed to fetch content: ${
				error instanceof Error ? error.message : "Unknown error"
			}`,
		);
	}
}

export async function updateContent(
	db: AppDatabase,
	updates: Record<
		string,
		| string
		| number
		| boolean
		| Record<string, unknown>
		| Array<unknown>
		| (Partial<Omit<NewContent, "key">> & { value: unknown })
	>,
): Promise<D1Result<unknown>[]> {
	console.info(
		`[DB updateContent] Invoked with ${Object.keys(updates).length} updates at ${new Date().toISOString()}`,
	);
	assert(db, "updateContent: db is required");

	const statements: BatchItem<"sqlite">[] = [];
	for (const [key, raw] of Object.entries(updates)) {
		if (key.endsWith("_theme")) {
			const base = key.replace(/_theme$/, "");
			const theme =
				typeof raw === "string" && (raw === "light" || raw === "dark")
					? raw
					: "light";
			statements.push(
				db
					.update(schema.content)
					.set({ theme })
					.where(eq(schema.content.key, base)),
			);
			continue;
		}

		const payload: Omit<schema.NewContent, "key"> & { key: string } = {
			key,
		} as unknown as Omit<schema.NewContent, "key"> & { key: string };
		if (typeof raw === "object" && raw !== null && "value" in raw) {
			Object.assign(payload, raw as object);
		} else {
			payload.value = raw as unknown as string;
		}
		validateContentUpdate(payload);
		statements.push(
			db
				.insert(schema.content)
				.values(payload)
				.onConflictDoUpdate({ target: schema.content.key, set: payload }),
		);
	}

	if (statements.length === 0) {
		console.info("[DB updateContent] No updates to apply");
		return [];
	}

	try {
		console.info(
			`[DB updateContent] Executing ${statements.length} statements`,
		);
		const results = await withTiming("updateContent batch", () =>
			db.batch(statements as [BatchItem<"sqlite">, ...BatchItem<"sqlite">[]]),
		);
		return results;
	} catch (error) {
		console.error("[DB updateContent] Batch failed:", error);
		throw new Error(
			`Failed to update content: ${
				error instanceof Error ? error.message : "Unknown error"
			}`,
		);
	}
}
