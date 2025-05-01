import type React from "react";
import { useCallback, useEffect, useState } from "react";
import type { FetcherWithComponents } from "react-router";
import ImageUploadZone from "~/routes/admin/components/ImageUploadZone";
// Import the specific action types
import type { action as adminIndexAction } from "~/routes/admin/routes/index";
import type { action as adminUploadAction } from "~/routes/admin/routes/upload";

interface ServiceField {
	titleKey: string;
	textKey: string;
	imageKey: string;
	label: string;
} // Added closing brace

interface ServicesSectionEditorProps {
	// Use a union type with inferred action types
	fetcher: FetcherWithComponents<
		typeof adminIndexAction | typeof adminUploadAction
	>;
	initialContent: Record<string, string>;
	onImageUpload: (idx: number, file: File) => void;
	imageUploading: boolean[];
	serviceImageUrls: (string | undefined)[];
}

const serviceFields: ServiceField[] = [
	{
		titleKey: "service_1_title",
		textKey: "service_1_text",
		imageKey: "service_1_image",
		label: "Service 1",
	},
	{
		titleKey: "service_2_title",
		textKey: "service_2_text",
		imageKey: "service_2_image",
		label: "Service 2",
	},
	{
		titleKey: "service_3_title",
		textKey: "service_3_text",
		imageKey: "service_3_image",
		label: "Service 3",
	},
	{
		titleKey: "service_4_title",
		textKey: "service_4_text",
		imageKey: "service_4_image",
		label: "Service 4",
	},
];

// ------------------------------------------------------------------------
// Component
// ------------------------------------------------------------------------
export function ServicesSectionEditor({
	fetcher,
	initialContent,
	onImageUpload,
	imageUploading,
	serviceImageUrls,
}: ServicesSectionEditorProps): React.ReactElement {
	// Use React.ReactElement
	const [statusTexts, setStatusTexts] = useState<string[]>(
		Array(serviceFields.length).fill(""),
	);

	const handleBlur = useCallback(
		(e: React.FocusEvent<HTMLTextAreaElement>) => {
			const { name, value } = e.currentTarget;
			const formData = new FormData();
			formData.append("intent", "updateTextContent"); // Add intent
			formData.append(name, value);
			// Use typed action path
			fetcher.submit(formData, { method: "post", action: "/admin" });
		},
		[fetcher],
	);

	const handleDrop = useCallback(
		(idx: number) => (files: File[]) => {
			const [file] = files;
			if (!file) return;

			onImageUpload(idx, file);
			setStatusTexts((prev) => {
				const next = [...prev];
				next[idx] = `Uploading ${serviceFields[idx].label} Image…`;
				return next;
			});
		},
		[onImageUpload],
	);

	// Update status once upload completes
	useEffect(() => {
		imageUploading.forEach((uploading, idx) => {
			if (!uploading && statusTexts[idx].startsWith("Uploading")) {
				setStatusTexts((prev) => {
					const next = [...prev];
					next[idx] =
						`${serviceFields[idx].label} Image uploaded successfully!`;
					return next;
				});
			}
		});
	}, [imageUploading, statusTexts]);

	return (
		<div className="overflow-hidden bg-white sm:rounded-lg shadow-xs border border-gray-200">
			{" "}
			{/* Use white bg, adjusted shadow/border */}
			<div className="px-4 py-5 sm:p-6">
				<h2 className="text-xl font-semibold text-gray-900 mb-6">
					{" "}
					{/* Use semibold, increased margin */}
					Services Section
				</h2>
				<div className="flex flex-col gap-8">
					<div className="flex flex-col gap-1.5">
						{" "}
						{/* Use gap for consistent spacing */}
						<label
							htmlFor="services_intro_title"
							className="block text-sm font-medium text-gray-700" /* Standard label */
						>
							Services Intro Title
						</label>
						<textarea
							name="services_intro_title"
							id="services_intro_title"
							rows={2}
							defaultValue={initialContent.services_intro_title || ""}
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" /* Standard input */
							onBlur={handleBlur}
						/>
						<label
							htmlFor="services_intro_text"
							className="block text-sm font-medium text-gray-700 pt-3" /* Standard label, added padding */
						>
							Services Intro Text
						</label>
						<textarea
							name="services_intro_text"
							id="services_intro_text"
							rows={4}
							defaultValue={initialContent.services_intro_text || ""}
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" /* Standard input */
							onBlur={handleBlur}
						/>
					</div>
					{serviceFields.map((field, idx) => (
						<div
							key={field.label}
							className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-6 mt-6" /* Adjusted border/padding/margin */
						>
							<div className="flex flex-col gap-y-1.5">
								{" "}
								{/* Reduced gap */}
								<label
									htmlFor={field.titleKey}
									className="block text-sm font-medium text-gray-700" /* Standard label */
								>
									{field.label} Title
								</label>
								<textarea
									name={field.titleKey}
									id={field.titleKey}
									rows={2}
									defaultValue={initialContent[field.titleKey] || ""}
									className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" /* Standard input */
									onBlur={handleBlur}
								/>
								<label
									htmlFor={field.textKey}
									className="block text-sm font-medium text-gray-700 pt-3" /* Standard label, added padding */
								>
									{field.label} Text
								</label>
								<textarea
									name={field.textKey}
									id={field.textKey}
									rows={3}
									defaultValue={initialContent[field.textKey] || ""}
									className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" /* Standard input */
									onBlur={handleBlur}
								/>
							</div>
							<div className="flex flex-col items-center justify-start pt-1">
								{" "}
								{/* Align top */}
								<label
									className="block text-sm font-medium text-gray-700 mb-1 self-start" /* Standard label, align left */
									htmlFor={`service-image-upload-${idx}`}
								>
									{field.label} Image
								</label>
								<p className="text-xs text-gray-500 mb-2 self-start">
									{" "}
									{/* Help text */}
									Upload or drag and drop an image for the{" "}
									{field.label.toLowerCase()}.
								</p>
								<div
									className="text-sm text-gray-600 mb-2 h-5 self-start" /* Align left */
									role="status"
									aria-live="polite"
								>
									{statusTexts[idx]}
								</div>
								<ImageUploadZone
									onDrop={handleDrop(idx)}
									disabled={imageUploading[idx]}
									uploading={imageUploading[idx]}
									imageUrl={serviceImageUrls[idx]}
									label={`${field.label} Image`}
									className="mt-1" /* Added margin */
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
