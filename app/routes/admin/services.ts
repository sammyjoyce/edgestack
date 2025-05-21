import type { AppLoadContext } from "react-router";
import type { CmsClient } from "~/services/cms.client";
import { listStoredImages } from "~/utils/upload.server";

export async function fetchAdminContent(
	cms: CmsClient,
): Promise<Record<string, string>> {
	try {
		return await cms.getAllContent();
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
