import { projectsSectionSchema } from "~/routes/common/components/RecentProjects/schema";
import { aboutSectionSchema } from "~/routes/home/components/AboutUs/schema";
import { contactSectionSchema } from "~/routes/home/components/ContactUs/schema";
import { heroSectionSchema } from "~/routes/home/components/Hero/schema";
import { servicesSectionSchema } from "~/routes/home/components/OurServices/schema";
import type { SectionSchema } from "~/section-schema";

export const sectionsSchema: Record<string, SectionSchema> = {
	hero: heroSectionSchema,
	services: servicesSectionSchema,
	projects: projectsSectionSchema,
	about: aboutSectionSchema,
	contact: contactSectionSchema,
};

export type SectionId = keyof typeof sectionsSchema;
