import type { SectionSchema } from "~/section-schema";

export const servicesSectionSchema: SectionSchema = {
	id: "services",
	label: "Services",
	themeKey: "services_intro_title_theme",
	fields: {
		services_intro_title: { label: "Intro Title", inputType: "text" },
		services_intro_text: { label: "Intro Text", inputType: "richtext" },
		service_1_title: { label: "Service 1 Title", inputType: "text" },
		service_1_image: { label: "Service 1 Image", inputType: "image" },
		service_2_title: { label: "Service 2 Title", inputType: "text" },
		service_2_image: { label: "Service 2 Image", inputType: "image" },
		service_3_title: { label: "Service 3 Title", inputType: "text" },
		service_3_image: { label: "Service 3 Image", inputType: "image" },
		service_4_title: { label: "Service 4 Title", inputType: "text" },
		service_4_image: { label: "Service 4 Image", inputType: "image" },
	},
};
