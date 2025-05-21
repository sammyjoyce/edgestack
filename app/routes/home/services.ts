import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { Project } from "~/database/schema";
import type * as schema from "~/database/schema";
import { getAllContent, getFeaturedProjects } from "~/routes/common/db";
import type { ServiceItem } from "./components/OurServices";

export async function loadHomeData(
	db: DrizzleD1Database<typeof schema>,
): Promise<{ content: Record<string, string>; projects: Project[] }> {
	try {
		const content = await getAllContent(db);
		const projects = await getFeaturedProjects(db);
		return { content, projects };
	} catch (error) {
		throw new Error(
			`loadHomeData failed: ${
				error instanceof Error ? error.message : String(error)
			}`,
		);
	}
}

export function extractServicesData(
	content: Record<string, string>,
): ServiceItem[] {
	const services: ServiceItem[] = [];
	for (let i = 1; i <= 4; i++) {
		const title = content[`service_${i}_title`];
		const image = content[`service_${i}_image`];
		if (title || image) {
			services.push({
				title: title ?? "",
				image: image ?? "",
				link: "#contact",
			});
		}
	}
	return services;
}
