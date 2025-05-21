import type { Project } from "~/database/schema";
import type { CmsClient } from "~/services/cms.client";
import type { ServiceItem } from "./components/OurServices";

export async function loadHomeData(
	cms: CmsClient,
): Promise<{ content: Record<string, string>; projects: Project[] }> {
	try {
		const content = await cms.getAllContent();
		const projects = await cms.getFeaturedProjects();
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
