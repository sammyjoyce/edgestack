import type React from "react";
import type { useFetcher } from "react-router";
import RichTextField from "~/routes/admin/components/RichTextField";
import { Input } from "~/routes/admin/components/ui/input";
import {
	FieldLabel,
	SectionCard,
	SectionHeading,
} from "~/routes/admin/components/ui/section";
import { Textarea } from "~/routes/admin/components/ui/textarea";
import { Text } from "~/routes/admin/components/ui/text";
import { Alert } from "~/routes/admin/components/ui/alert";

interface ContactSectionEditorProps {
	fetcher: ReturnType<typeof useFetcher>;
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
               placeholder: "000-000-0000",
	},
	{
		key: "contact_email",
		label: "Email",
		isRichText: true,
		rows: 1,
               placeholder: "info@example.com",
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
               placeholder: "00 000 000 000",
	},
	{
		key: "contact_acn",
		label: "ACN",
		isRichText: true,
		rows: 1,
               placeholder: "000 000 000",
	},
	{
		key: "contact_license",
		label: "License Number",
		isRichText: true,
		rows: 1,
               placeholder: "000000",
	},
	{
		key: "contact_instagram",
		label: "Instagram URL",
		isRichText: true,
		rows: 1,
               placeholder: "https://www.instagram.com/example",
	},
];

export function ContactSectionEditor({
	fetcher,
	initialContent,
}: ContactSectionEditorProps): React.ReactElement {
	const actionData = fetcher.data as
		| { error?: string; errors?: Record<string, string> }
		| undefined;

	return (
		<SectionCard>
			{actionData?.error && (
				<Alert variant="error" title="Save failed" className="mb-4">
					{actionData.error}
				</Alert>
			)}
			<SectionHeading>Contact Section</SectionHeading>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 sm:gap-x-6 gap-y-6">
				{contactFields.map(({ key, label, rows, placeholder, isRichText }) => (
					<div key={key} className="flex flex-col gap-1 min-w-0">
						<FieldLabel htmlFor={key}>{label}</FieldLabel>
						{isRichText ? (
							<RichTextField
								name={key}
								initialJSON={initialContent[key]}
								disabled={fetcher.state === "submitting"}
								onBlur={(val) => {
									if (val === initialContent[key]) return;
									const formData = new FormData();
									formData.append("intent", "updateTextContent");
									formData.append("page", "home");
									formData.append("section", "contact");
									formData.append(key, val);
									fetcher.submit(formData, {
										method: "post",
										action: "/admin",
									});
								}}
							/>
						) : rows > 1 ? (
							<Textarea
								name={key}
								id={key}
								rows={rows}
								defaultValue={initialContent[key] || ""}
								placeholder={placeholder}
								disabled={fetcher.state === "submitting"}
								className="w-full min-w-0"
							/>
						) : (
							<Input
								type="text"
								name={key}
								id={key}
								defaultValue={initialContent[key] || ""}
								placeholder={placeholder}
								disabled={fetcher.state === "submitting"}
								className="w-full min-w-0"
							/>
						)}
						{actionData?.errors?.[key] && (
							<Text className="text-sm text-red-600 mt-1">
								{actionData.errors[key]}
							</Text>
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
