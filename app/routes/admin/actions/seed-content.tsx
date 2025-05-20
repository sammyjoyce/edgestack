import type { Route } from "./+types/seed-content";
import { data } from "react-router";
import { getAllContent, updateContent } from "~/routes/common/db";
import { checkSession } from "~/routes/common/utils/auth";

const DEBUG = process.env.NODE_ENV !== "production";
const DEFAULT_CONTENT = {
       hero_title: "Big Impact for Modern Brands",
       hero_subtitle: "Delivering high-quality solutions since 2010.",
       home_sections_order: "hero,services,projects,about,contact",
} as const;

export async function action({ request, context, params }: Route.ActionArgs) {
        const env = context.cloudflare?.env;
        if (!env || !(await checkSession(request, env))) {
                return data({ success: false, error: "Unauthorized" }, { status: 401 });
        }
	if (request.method !== "POST") {
		return data({ error: "Invalid method. Please use POST." }, { status: 405 });
	}
	try {
		const existingContent = await getAllContent(context.db);
		const missingKeys = Object.keys(DEFAULT_CONTENT).filter(
			(key) => !existingContent[key],
		);
		if (missingKeys.length === 0) {
			return data({
				success: true,
				message: "Default content already exists. No action taken.",
			});
		}
		const updatesToSeed = missingKeys.reduce(
			(acc, key) => {
				acc[key] = DEFAULT_CONTENT[key as keyof typeof DEFAULT_CONTENT];
				return acc;
			},
			{} as Record<string, string>,
		);
		await updateContent(context.db, updatesToSeed);
		return data({
			success: true,
			message: `Successfully seeded ${missingKeys.length} missing content items.`,
		});
	} catch (error: any) {
		if (DEBUG) console.error("[Seed Content Action Error]:", error);
		return data(
			{ success: false, error: "Failed to seed default content." },
			{ status: 500 },
		);
	}
}
