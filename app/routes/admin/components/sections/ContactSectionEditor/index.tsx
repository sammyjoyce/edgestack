import type React from "react";
import type { FetcherWithComponents } from "react-router";
import { Input } from "../ui/input"; // Import React
import { Textarea } from "../ui/textarea";

import RichTextField from "~/routes/admin/components/RichTextField";
import {
	FieldLabel,
	FieldRow,
	SectionCard,
	SectionHeading,
} from "~/routes/admin/components/ui/section";
// Import the specific action type
import type { action as adminIndexAction } from "~/routes/admin/views/index";

interface ContactSectionEditorProps {
	fetcher: FetcherWithComponents<typeof adminIndexAction>; // Use inferred type
	initialContent: Record<string, string>;
}

const contactFields = [
	{
		key: "contact_headline",
		label: "Contact Headline",
		isRichText: false,
		rows: 2,
		placeholder: "Ready to Start Your Project?",
	},
	{
		key: "contact_intro",
		label: "Contact Intro",
		isRichText: true,
		rows: 3,
		placeholder: "From concept to completion, we're here...",
	},
	{
		key: "contact_address",
		label: "Address",
		isRichText: true,
		rows: 2,
		placeholder: "PO BOX 821\nMarrickville, NSW 2204",
	},
	{
		key: "contact_phone",
		label: "Phone",
		isRichText: true,
		rows: 1,
		placeholder: "0404 289 437",
	},
	{
		key: "contact_email",
		label: "Email",
		isRichText: true,
		rows: 1,
		placeholder: "contact@lushconstructions.com",
	},
	{
		key: "contact_hours",
		label: "Hours",
		isRichText: true,
		rows: 2,
		placeholder: "Monday - Friday: 7am - 5pm\nSaturday: By appointment",
	},
	{
		key: "contact_abn",
		label: "ABN",
		isRichText: true,
		rows: 1,
		placeholder: "99 652 947 528",
	},
	{
		key: "contact_acn",
		label: "ACN",
		isRichText: true,
		rows: 1,
		placeholder: "141 565 746",
	},
	{
		key: "contact_license",
		label: "License Number",
		isRichText: true,
		rows: 1,
		placeholder: "4632530",
	},
	{
		key: "contact_instagram",
		label: "Instagram URL",
		isRichText: true,
		rows: 1,
		placeholder: "https://www.instagram.com/lushconstructions",
	},
];

export function ContactSectionEditor({
	fetcher,
	initialContent,
}: ContactSectionEditorProps): React.ReactElement {
	// Use React.ReactElement
	// Remove handleBlur as RichTextField handles its updates internally
	// const handleBlur = React.useCallback(
	// 	(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
	// 		const { name, value } = e.currentTarget;
	// 		const formData = new FormData();
	// 		formData.append("intent", "updateTextContent"); // Add intent
	// 		formData.append(name, value);
	// 		// Use typed action path
	// 		fetcher.submit(formData, { method: "post", action: "/admin" });
	// 	},
	// 	[fetcher],
	// );

	return (
		<SectionCard>
			<SectionHeading>Contact Section (Home Page)</SectionHeading>
			{/* Adjusted shadow/border/padding */}
			<h2 className="text-xl font-semibold text-gray-900 mb-6">
				{/* Use semibold, increased margin */}
				Contact Section (Home Page)
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
				{/* Adjusted gap */}
				{contactFields.map(({ key, label, rows, placeholder, isRichText }) => (
					<FieldRow key={key}>
						<FieldLabel htmlFor={key}>{label}</FieldLabel>
						{isRichText ? (
							<RichTextField
								name={key}
								initialJSON={initialContent[key]}
								disabled={fetcher.state === "submitting"}
							/>
						) : rows > 1 ? (
							<Textarea
								name={key}
								id={key}
								rows={rows}
								defaultValue={initialContent[key] || ""}
								placeholder={placeholder}
								disabled={fetcher.state === "submitting"}
							/>
						) : (
							<Input
								type="text"
								name={key}
								id={key}
								defaultValue={initialContent[key] || ""}
								placeholder={placeholder}
								disabled={fetcher.state === "submitting"}
							/>
						)}
					</FieldRow>
				))}
			</div>
		</SectionCard>
	);
}
