import {
	ArrowPathIcon,
	CheckCircleIcon,
	ExclamationTriangleIcon,
	InformationCircleIcon,
	XCircleIcon,
} from "@heroicons/react/20/solid";
import type React from "react"; // Keep only useRef
import { useRef } from "react";
import type { FetcherWithComponents } from "react-router";
import { Pill, PillStatus } from "~/components/ui/Pill"; // Adjust path if needed
import { useTextContentForm } from "~/routes/admin/hooks/useTextContentForm"; // Import the hook
import { Button } from "~/routes/common/components/ui/Button";

// Define the expected shape of action response data to match the hook
type ActionResponseData = {
	success?: boolean;
	error?: string;
	message?: string;
};

// Config array for text fields with help text
const textFields = [
	{
		key: "hero_title",
		label: "Hero Title",
		rows: 2,
		help: "Main heading for the hero section.",
	},
	{
		key: "hero_subtitle",
		label: "Hero Subtitle",
		rows: 3,
		help: "Subtitle or tagline for the hero.",
	},
	{
		key: "about_title",
		label: "About Title",
		rows: 2,
		help: "Heading for the about section.",
	},
	{
		key: "about_text",
		label: "About Text",
		rows: 5,
		help: "Description for the about section.",
	},
	{
		key: "services_intro_title",
		label: "Services Intro Title",
		rows: 2,
		help: "Heading for the services intro.",
	},
	{
		key: "services_intro_text",
		label: "Services Intro Text",
		rows: 4,
		help: "Description for the services intro.",
	},
	{
		key: "service_1_title",
		label: "Service 1 Title",
		rows: 2,
		help: "Title for the first service.",
	},
	{
		key: "service_1_text",
		label: "Service 1 Text",
		rows: 3,
		help: "Description for the first service.",
	},
	{
		key: "service_2_title",
		label: "Service 2 Title",
		rows: 2,
		help: "Title for the second service.",
	},
	{
		key: "service_2_text",
		label: "Service 2 Text",
		rows: 3,
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
}: TextContentFormProps): React.ReactElement {
	// Use React.ReactElement
	const localFormRef = useRef<HTMLFormElement>(null);
	const ref = formRef || localFormRef;

	// Use the custom hook to manage form state and logic
	const {
		autoSave,
		setAutoSave,
		fields, // Use the fields from the hook (either saved or pending)
		errors,
		feedback,
		handleBlur,
		handleChange,
		handleSave,
		handleUndo,
		isSubmitting, // Use submitting state from hook
	} = useTextContentForm({
		initialContent,
		fetcher,
		textFieldsConfig: textFields,
	}); // Pass config to hook

	return (
		<form
			id="text-content-form"
			ref={ref}
			method="post"
			aria-label="Text Content Editor"
			className="flex flex-col gap-6 bg-white border border-gray-200 rounded-lg shadow-xs p-6"
			onSubmit={handleSave}
		>
			<div className="flex items-center gap-4 mb-2">
				<h2 className="text-xl font-semibold text-gray-900">Text Content</h2>
				<div className="flex items-center gap-2 ml-auto">
					<label
						htmlFor="auto-save-toggle"
						className="text-sm font-medium text-gray-700 flex items-center"
					>
						Auto-save
						<input
							id="auto-save-toggle"
							type="checkbox"
							checked={autoSave}
							onChange={(e) => setAutoSave(e.target.checked)}
							className="ml-2 accent-blue-600"
							aria-checked={autoSave}
							aria-label="Toggle auto-save on or off"
						/>
					</label>
				</div>
			</div>
			<div
				aria-live="polite"
				className="min-h-[2.25rem] mb-2 text-sm flex items-center"
				role="status"
			>
				{isSubmitting ? (
					<Pill variant="secondary">
						<PillStatus>
							<ArrowPathIcon className="size-3 animate-spin" />
							Saving...
						</PillStatus>
					</Pill>
				) : fetcher.data?.success ? (
					<Pill
						variant="outline"
						className="border-emerald-200 bg-emerald-50 text-emerald-700"
					>
						<PillStatus>
							<CheckCircleIcon className="size-3 text-emerald-500" />
							Saved
						</PillStatus>
						{fetcher.data.message || "Changes saved successfully."}
					</Pill>
				) : fetcher.data?.error ? (
					<Pill
						variant="outline"
						className="border-red-200 bg-red-50 text-red-700"
					>
						<PillStatus>
							<XCircleIcon className="size-3 text-red-500" />
							Error
						</PillStatus>
						{fetcher.data.error || "An error occurred."}
					</Pill>
				) : feedback && feedback.toLowerCase().includes("validation") ? (
					<Pill
						variant="outline"
						className="border-amber-200 bg-amber-50 text-amber-700"
					>
						<PillStatus>
							<ExclamationTriangleIcon className="size-3 text-amber-500" />
							Validation Error
						</PillStatus>
						{feedback}
					</Pill>
				) : feedback && feedback === "Changes reverted." ? (
					<Pill
						variant="outline"
						className="border-blue-200 bg-blue-50 text-blue-700"
					>
						<PillStatus>
							<InformationCircleIcon className="size-3 text-blue-500" />
							Info
						</PillStatus>
						{feedback}
					</Pill>
				) : null}
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{textFields.map(({ key, label, rows, help }) => (
					<div className="flex flex-col gap-1" key={key}>
						<label
							htmlFor={key}
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							{label}
							<Tooltip id={`help-${key}`}>{help}</Tooltip>
						</label>
						<textarea
							name={key}
							id={key}
							data-key={key}
							rows={rows}
							aria-label={label}
							aria-describedby={`help-${key}`}
							value={fields[key] ?? ""} // Use fields directly from hook
							onBlur={handleBlur}
							onChange={handleChange}
							tabIndex={0}
							className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm ${
								errors[key] ? "border-red-500" : "border-gray-300"
							}`}
						/>
						{errors[key] && (
							<span className="text-xs text-red-600 mt-1" role="alert">
								{errors[key]}
							</span>
						)}
					</div>
				))}
			</div>
			{!autoSave && (
				<div className="flex gap-2 mt-4">
					<Button
						type="submit"
						className="bg-blue-600 text-white hover:bg-blue-700"
						aria-label="Save changes"
					>
						Save
					</Button>
					<Button
						type="button"
						onClick={handleUndo}
						variant="secondary"
						aria-label="Undo changes"
					>
						Undo
					</Button>
				</div>
			)}
		</form>
	);
}
