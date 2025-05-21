import type { SectionSchema } from "~/section-schema";

export const projectsSectionSchema: SectionSchema = {
	id: "projects",
	label: "Projects",
	themeKey: "projects_intro_title_theme",
	fields: {
		projects_intro_title: { label: "Intro Title", inputType: "text" },
		projects_intro_text: { label: "Intro Text", inputType: "richtext" },
	},
};
