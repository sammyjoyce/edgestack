import type React from "react"; // Keep only useRef
import { useRef } from "react";
import type { FetcherWithComponents } from "react-router";
import { useTextContentForm } from "~/routes/admin/hooks/useTextContentForm"; // Import the hook

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
			className="flex flex-col gap-6 bg-gray-50 rounded-lg shadow-xs p-6"
			onSubmit={handleSave}
		>
			<div className="flex items-center gap-4 mb-2">
				<h2 className="text-xl font-semibold text-gray-800">Text Content</h2>
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
				className="min-h-[1.5em] mb-2 text-sm"
				role="status"
			>
				{feedback && (
					<span className="inline-block px-2 py-1 rounded bg-blue-50 text-blue-700">
						{feedback}
					</span>
				)}
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{textFields.map(({ key, label, rows, help }) => (
					<div className="flex flex-col gap-1" key={key}>
						<label
							htmlFor={key}
							className="font-bold text-gray-700 flex items-center"
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
							className={`border rounded p-2 focus:outline-hidden focus:ring-2 focus:ring-blue-400 bg-white ${
								errors[key] ? "border-red-500" : ""
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
					<button
						type="submit"
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-400"
						aria-label="Save changes"
					>
						Save
					</button>
					<button
						type="button"
						onClick={handleUndo}
						className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-400"
						aria-label="Undo changes"
					>
						Undo
					</button>
				</div>
			)}
		</form>
	);
}
