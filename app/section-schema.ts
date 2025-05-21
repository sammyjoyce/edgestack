export type ContentInputType = "text" | "richtext" | "image";

export interface ContentFieldSchema {
	label: string;
	inputType: ContentInputType;
}

export interface SectionSchema {
	id: string;
	label: string;
	themeKey: string;
	fields: Record<string, ContentFieldSchema>;
}
