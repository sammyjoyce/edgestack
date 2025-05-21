import type { SectionSchema } from "~/section-schema";
import { projectsSectionSchema } from "../common/components/RecentProjects/schema";
import { aboutSectionSchema } from "../home/components/AboutUs/schema";
import { contactSectionSchema } from "../home/components/ContactUs/schema";
import { heroSectionSchema } from "../home/components/Hero/schema";
import { servicesSectionSchema } from "../home/components/OurServices/schema";

export const sectionsSchema: Record<string, SectionSchema> = {
	hero: heroSectionSchema,
	services: servicesSectionSchema,
	projects: projectsSectionSchema,
	about: aboutSectionSchema,
	contact: contactSectionSchema,
};

export type SectionId = keyof typeof sectionsSchema;
