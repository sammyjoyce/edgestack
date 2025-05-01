import React from "react";
import type { FetcherWithComponents } from "react-router";

import RichTextField from "~/routes/admin/components/RichTextField";
// Import the specific action type
import type { action as adminIndexAction } from "~/routes/admin/routes/index";

interface ContactSectionEditorProps {
	fetcher: FetcherWithComponents<typeof adminIndexAction>; // Use inferred type
	initialContent: Record<string, string>;
}

const contactFields = [
	{
		key: "contact_headline",
		label: "Contact Headline",
		rows: 2,
		placeholder: "Ready to Start Your Project?",
	},
	{
		key: "contact_intro",
		label: "Contact Intro",
		rows: 3,
		placeholder: "From concept to completion, we're here...",
	},
	{
		key: "contact_address",
		label: "Address",
		rows: 2,
		placeholder: "PO BOX 821\nMarrickville, NSW 2204",
	},
	{
		key: "contact_phone",
		label: "Phone",
		rows: 1,
		placeholder: "0404 289 437",
	},
	{
		key: "contact_email",
		label: "Email",
		rows: 1,
		placeholder: "contact@lushconstructions.com",
	},
	{
		key: "contact_hours",
		label: "Hours",
		rows: 2,
		placeholder: "Monday - Friday: 7am - 5pm\nSaturday: By appointment",
	},
	{ key: "contact_abn", label: "ABN", rows: 1, placeholder: "99 652 947 528" },
	{ key: "contact_acn", label: "ACN", rows: 1, placeholder: "141 565 746" },
	{
		key: "contact_license",
		label: "License Number",
		rows: 1,
		placeholder: "4632530",
	},
	{
		key: "contact_instagram",
		label: "Instagram URL",
		rows: 1,
		placeholder: "https://www.instagram.com/lushconstructions",
	},
];

export function ContactSectionEditor({
	fetcher,
	initialContent,
}: ContactSectionEditorProps): React.ReactElement {
	// Use React.ReactElement
	const handleBlur = React.useCallback(
		(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const { name, value } = e.currentTarget;
			const formData = new FormData();
			formData.append("intent", "updateTextContent"); // Add intent
			formData.append(name, value);
			// Use typed action path
			fetcher.submit(formData, { method: "post", action: "/admin" });
		},
		[fetcher],
	);

	return (
		<section className="bg-white rounded-lg shadow-xs border border-gray-200 p-6">
			{" "}
			{/* Adjusted shadow/border/padding */}
			<h2 className="text-xl font-semibold text-gray-900 mb-6">
				{" "}
				{/* Use semibold, increased margin */}
				Contact Section (Home Page)
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
				{" "}
				{/* Adjusted gap */}
				{contactFields.map(({ key, label, rows, placeholder }) => (
					<div className="flex flex-col gap-y-1" key={key}>
						{" "}
						{/* Adjusted gap */}
						<label
							htmlFor={key}
							className="block text-sm font-medium text-gray-700"
						>
							{" "}
							{/* Standard label */}
							{label}
						</label>
						{rows > 1 && key === "contact_intro" ? (
							// Rich text editor for contact_intro using Lexical
							<RichTextField
								name={key}
								initialJSON={initialContent[key]}
								disabled={fetcher.state === "submitting"}
							/>
						) : rows > 1 ? (
							<textarea
								name={key}
								id={key}
								rows={rows}
								defaultValue={initialContent[key] || ""}
								placeholder={placeholder}
								className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" /* Standard input */
								onBlur={handleBlur}
							/>
						) : (
							<input
								type="text"
								name={key}
								id={key}
								defaultValue={initialContent[key] || ""}
								placeholder={placeholder}
								className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" /* Standard input */
								onBlur={handleBlur}
							/>
						)}
					</div>
				))}
			</div>
		</section>
	);
}
