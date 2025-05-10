import {} from "@heroicons/react/20/solid";
import type React from "react"; // Import React and JSX type
import { type JSX, useRef } from "react";
import type { FetcherWithComponents } from "react-router";
import RichTextField from "~/routes/admin/components/RichTextField";
import { Button } from "~/routes/admin/components/ui/button";
// Pull Label from the shared fieldset, Textarea from the admin ui folder
import { Label } from "~/routes/admin/components/ui/fieldset";
import { Textarea } from "~/routes/admin/components/ui/textarea";
import { useTextContentForm } from "~/routes/admin/hooks/useTextContentForm";
import { Pill, PillStatusComponent } from "~/routes/common/components/ui/Pill";

type ActionResponseData = {
	success?: boolean;
	error?: string;
	message?: string;
};

const textFields = [
	{
		key: "hero_title",
		label: "Hero Title",
		rows: 2,
		isRichText: false,
		help: "Main heading for the hero section.",
	},
	{
		key: "hero_subtitle",
		label: "Hero Subtitle",
		rows: 3,
		isRichText: false,
		help: "Subtitle or tagline for the hero.",
	},
	{
		key: "about_title",
		label: "About Title",
		rows: 2,
		isRichText: false,
		help: "Heading for the about section.",
	},
	{
		key: "about_text",
		label: "About Text",
		rows: 5,
		isRichText: true,
		help: "Description for the about section.",
	},
	{
		key: "services_intro_title",
		label: "Services Intro Title",
		rows: 2,
		isRichText: false,
		help: "Heading for the services intro.",
	},
	{
		key: "services_intro_text",
		label: "Services Intro Text",
		rows: 4,
		isRichText: true,
		help: "Description for the services intro.",
	},
	{
		key: "service_1_title",
		label: "Service 1 Title",
		rows: 2,
		isRichText: false,
		help: "Title for the first service.",
	},
	{
		key: "service_1_text",
		label: "Service 1 Text",
		rows: 3,
		isRichText: true,
		help: "Description for the first service.",
	},
	{
		key: "service_2_title",
		label: "Service 2 Title",
		rows: 2,
		isRichText: false,
		help: "Title for the second service.",
	},
	{
		key: "service_2_text",
		label: "Service 2 Text",
		rows: 3,
		isRichText: true,
		help: "Description for the second service.",
	},
];

interface TextContentFormProps {
	fetcher: FetcherWithComponents<ActionResponseData>; // Match the type in useTextContentForm hook
	initialContent: Record<string, string>;
	formRef?: React.RefObject<HTMLFormElement>;
}

// Simple accessible tooltip component
function Tooltip({ id, children }: { id: string; children: React.ReactNode }) {
	return (
		<span
			id={id}
			role="tooltip"
			className="ml-1 text-xs text-gray-500 bg-gray-100 rounded px-1 py-0.5 border border-gray-200"
		>
			{children}
		</span>
	);
}

export function TextContentForm({
	fetcher,
	initialContent,
	formRef,
}: TextContentFormProps): JSX.Element {
	// Use JSX.Element
	const localFormRef = useRef<HTMLFormElement>(null);
	const ref = formRef || localFormRef;

	const {
		autoSave,
		setAutoSave,
		fields,
		errors,
		feedback,
		handleBlur,
		handleChange,
		handleSave,
		handleUndo,
		isSubmitting,
	} = useTextContentForm({
		initialContent,
		fetcher,
		textFieldsConfig: textFields,
	});

	return (
		<form
			id="text-content-form"
			ref={ref}
			method="post"
			aria-label="Text Content Editor"
			className="flex flex-col gap-6 bg-white border border-neutral-200 rounded-lg shadow-block p-6"
			onSubmit={handleSave}
		>
			<div className="flex flex-wrap items-center justify-between gap-4 mb-2">
				<h3 className="text-lg font-semibold text-foreground">Text Content</h3>
				<div className="flex items-center gap-2 ml-auto">
					<label
						htmlFor="auto-save-toggle"
						className="text-sm font-medium text-foreground flex items-center"
					>
						Auto-save
						<input
							id="auto-save-toggle"
							type="checkbox"
							checked={autoSave}
							onChange={(e) => setAutoSave(e.target.checked)}
							className="ml-2 h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
							aria-checked={autoSave}
							aria-label="Toggle auto-save on or off"
						/>
					</label>
				</div>
			</div>
			<div
				aria-live="polite"
				className="min-h-[2.5rem] mb-2 text-sm flex items-center"
				role="status"
			>
				{isSubmitting ? (
					<Pill variant="neutral" className="bg-gray-100 text-gray-700">
						<PillStatusComponent>
							<ArrowPathIcon className="size-3 animate-spin" />
							Saving...
						</PillStatusComponent>
					</Pill>
				) : fetcher.data?.success ? (
					<Pill
						variant="outline"
						className="border-green-300 bg-green-50 text-green-700"
					>
						<PillStatusComponent>
							<CheckCircleIcon className="size-4 text-green-500" />
							Saved
						</PillStatusComponent>
						{fetcher.data.message || "Changes saved successfully."}
					</Pill>
				) : fetcher.data?.error ? (
					<Pill
						variant="outline"
						className="border-red-300 bg-red-50 text-red-700"
					>
						<PillStatusComponent>
							<XCircleIcon className="size-4 text-red-500" />
							Error
						</PillStatusComponent>
						{fetcher.data.error || "An error occurred."}
					</Pill>
				) : feedback?.toLowerCase().includes("validation") ? (
					<Pill
						variant="outline"
						className="border-yellow-300 bg-yellow-50 text-yellow-700"
					>
						<PillStatusComponent>
							<ExclamationTriangleIcon className="size-4 text-yellow-500" />
							Validation Error
						</PillStatusComponent>
						{feedback}
					</Pill>
				) : feedback && feedback === "Changes reverted." ? (
					<Pill
						variant="outline"
						className="border-blue-300 bg-blue-50 text-blue-700"
					>
						<PillStatusComponent>
							<InformationCircleIcon className="size-4 text-blue-500" />
							Info
						</PillStatusComponent>
						{feedback}
					</Pill>
				) : null}
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
				{textFields.map(({ key, label, rows, help, isRichText }) => (
					<div className="flex flex-col gap-1" key={key}>
						<Label htmlFor={key}>
							{label}
							{help && (
								<span className="ml-1 text-xs text-neutral-500">({help})</span>
							)}
						</Label>
						{isRichText ? (
							<RichTextField
								name={key}
								initialJSON={fields[key] ?? ""}
								disabled={isSubmitting}
							/>
						) : (
							<Textarea
								name={key}
								id={key}
								rows={rows}
								aria-label={label}
								aria-describedby={help ? `help-${key}` : undefined}
								value={fields[key] ?? ""}
								onBlur={handleBlur}
								onChange={handleChange}
								className={errors[key] ? "border-red-500" : undefined}
							/>
						)}
						{errors[key] && (
							<span className="text-xs text-red-500 mt-1" role="alert">
								{errors[key]}
							</span>
						)}
					</div>
				))}
			</div>
			{!autoSave && (
				<div className="flex gap-3 mt-6 pt-6 border-t border-neutral-200">
					<Button type="submit" variant="primary">
						Save
					</Button>
					<Button type="button" variant="neutral" onClick={handleUndo}>
						Undo
					</Button>
				</div>
			)}
		</form>
	);
}
