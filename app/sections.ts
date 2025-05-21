import type { SectionSchema } from "~/section-schema";
import { aboutSectionSchema } from "~/section-schemas/about";
import { contactSectionSchema } from "~/section-schemas/contact";
import { heroSectionSchema } from "~/section-schemas/hero";
import { projectsSectionSchema } from "~/section-schemas/projects";
import { servicesSectionSchema } from "~/section-schemas/services";

export const sectionsSchema: Record<string, SectionSchema> = {
	hero: heroSectionSchema,
	services: servicesSectionSchema,
	projects: projectsSectionSchema,
	about: aboutSectionSchema,
	contact: contactSectionSchema,
};

export type SectionId = keyof typeof sectionsSchema;
