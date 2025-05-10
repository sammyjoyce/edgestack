// app/routes/admin/actions/seed-content.tsx
import { data, redirect } from "react-router";
import { getAllContent, updateContent } from "~/routes/common/db";
import { getSessionCookie, verify } from "~/routes/common/utils/auth";
import type { Route } from "./+types/seed-content"; // Ensure this path is correct

const DEBUG = process.env.NODE_ENV !== "production"; // Define DEBUG if used

const DEFAULT_CONTENT = {
	hero_title: "Building Dreams, Creating Spaces",
	hero_subtitle: "Your trusted partner in construction and renovation.",
	home_sections_order: "hero,services,projects,about,contact",
} as const;

export async function action({ request, context }: Route.ActionArgs): Promise<Route.ActionData> { // Use generated type
	// Authentication Check
	const token = getSessionCookie(request);
	const secret = context.cloudflare?.env?.JWT_SECRET;
	if (!token || !secret || !(await verify(token, secret))) {
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

		// Optionally, redirect back to admin dashboard or return success
		// For now, returning a success message. A redirect might be better UX.
		// throw redirect("/admin");
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

// You might want a simple component or loader here if this route is directly accessible via GET
// For an action-only route, this is often sufficient.
// export default function SeedContentRoute() {
//   return (
//     <div>
//       <p>This route is for seeding content. Use a POST request to trigger the action.</p>
//       <Form method="post">
//         <button type="submit">Seed Default Content</button>
//       </Form>
//     </div>
//   );
// }
