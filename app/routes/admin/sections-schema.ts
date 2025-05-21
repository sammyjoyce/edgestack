export interface SectionSchema {
	label: string;
	themeKey: string;
}

export const sectionsSchema: Record<string, SectionSchema> = {
	hero: { label: "Hero", themeKey: "hero_title_theme" },
	services: { label: "Services", themeKey: "services_intro_title_theme" },
	projects: { label: "Projects", themeKey: "projects_intro_title_theme" },
	about: { label: "About", themeKey: "about_title_theme" },
	contact: { label: "Contact", themeKey: "contact_title_theme" },
};

export type SectionId = keyof typeof sectionsSchema;
