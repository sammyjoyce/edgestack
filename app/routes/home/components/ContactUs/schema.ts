import type { SectionSchema } from "~/section-schema";

export const contactSectionSchema: SectionSchema = {
	id: "contact",
	label: "Contact",
	themeKey: "contact_title_theme",
	fields: {
		contact_headline: { label: "Headline", inputType: "text" },
		contact_intro: { label: "Intro Text", inputType: "richtext" },
		contact_address: { label: "Address", inputType: "text" },
		contact_phone: { label: "Phone", inputType: "text" },
		contact_email: { label: "Email", inputType: "text" },
		contact_hours: { label: "Hours", inputType: "text" },
		contact_abn: { label: "ABN", inputType: "text" },
		contact_acn: { label: "ACN", inputType: "text" },
		contact_license: { label: "License", inputType: "text" },
		contact_instagram: { label: "Instagram", inputType: "text" },
	},
};
