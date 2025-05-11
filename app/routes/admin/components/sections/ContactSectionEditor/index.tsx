import type React from "react";
import type { FetcherWithComponents } from "react-router";
import RichTextField from "~/routes/admin/components/RichTextField";
import { Input } from "~/routes/admin/components/ui/input";
import {
	FieldLabel,
	FieldRow,
	SectionCard,
	SectionHeading,
} from "~/routes/admin/components/ui/section";
import { Textarea } from "~/routes/admin/components/ui/textarea";
import type { Route as AdminIndexRoute } from "~/routes/admin/views/+types/index";
interface ContactSectionEditorProps {
	fetcher: FetcherWithComponents<AdminIndexRoute.ActionData>;
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
	return (
		<SectionCard>
			<SectionHeading>Contact Section (Home Page)</SectionHeading>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
				{contactFields.map(({ key, label, rows, placeholder, isRichText }) => (
					<div key={key} className="flex flex-col gap-1">
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
						{/* Placeholder for error/help text, e.g.,
        <Alert variant="error" className="mt-1 text-xs" showIcon={false}>...</Alert>
        <span className="text-xs text-neutral-500 mt-1">Help text</span>
    */}
					</div>
				))}
			</div>
		</SectionCard>
	);
}
