import type { SectionSchema } from "~/section-schema";

export const aboutSectionSchema: SectionSchema = {
	id: "about",
	label: "About",
	themeKey: "about_title_theme",
	fields: {
		about_title: { label: "About Title", inputType: "text" },
		about_text: { label: "About Text", inputType: "richtext" },
		about_image_url: { label: "About Image", inputType: "image" },
	},
};
