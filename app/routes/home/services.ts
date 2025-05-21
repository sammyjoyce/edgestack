import type { ServiceItem } from "./components/OurServices";

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
