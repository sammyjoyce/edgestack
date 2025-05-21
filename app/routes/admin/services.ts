import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { AppLoadContext } from "react-router";
import { getAllContent } from "~/routes/common/db";
import { listStoredImages } from "~/utils/upload.server";
import type * as schema from "../../database/schema";

export async function fetchAdminContent(
	db: DrizzleD1Database<typeof schema>,
): Promise<Record<string, string>> {
	try {
		return await getAllContent(db);
	} catch (error) {
		throw new Error(
			`fetchAdminContent failed: ${
				error instanceof Error ? error.message : String(error)
			}`,
		);
	}
}

export async function fetchStoredImages(context: AppLoadContext) {
	try {
		return await listStoredImages(context);
	} catch (error) {
		throw new Error(
			`fetchStoredImages failed: ${
				error instanceof Error ? error.message : String(error)
			}`,
		);
	}
}
