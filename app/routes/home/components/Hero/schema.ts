import type { SectionSchema } from "~/section-schema";

export const heroSectionSchema: SectionSchema = {
	id: "hero",
	label: "Hero",
	themeKey: "hero_title_theme",
	fields: {
		hero_title: { label: "Hero Title", inputType: "text" },
		hero_subtitle: { label: "Hero Subtitle", inputType: "richtext" },
		hero_image_url: { label: "Hero Image", inputType: "image" },
	},
};
