import type React from "react";
import { useCallback, useEffect, useState } from "react";
import type { FetcherWithComponents } from "react-router";
import { ImageSelector } from "~/routes/admin/components/ImageSelector";
import RichTextField from "~/routes/admin/components/RichTextField"; // Import RichTextField
// Import the specific action types
import type { action as adminIndexAction } from "~/routes/admin/routes/index";
import type { action as adminUploadAction } from "~/routes/admin/routes/upload";

interface ServiceField {
	titleKey: string;
	textKey: string;
	imageKey: string;
	label: string;
}

interface ServicesSectionEditorProps {
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
	const [statusTexts, setStatusTexts] = useState<string[]>(
		Array(serviceFields.length).fill(""),
	);

	const handleBlur = useCallback(
		(e: React.FocusEvent<HTMLTextAreaElement>) => {
			const { name, value } = e.currentTarget;
			const formData = new FormData();
			formData.append("intent", "updateTextContent");
			formData.append(name, value);
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
		<div className="overflow-hidden bg-screen-light sm:rounded-lg shadow-xs border border-neutral-light">
			<div className="px-4 py-5 sm:p-6">
				<h2 className="text-xl font-semibold text-foreground-light mb-6">
					Services Section
				</h2>
				<div className="flex flex-col gap-8">
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="services_intro_title"
							className="block text-sm font-medium text-secondary mb-1"
						>
							Services Intro Title
						</label>
						<textarea
							name="services_intro_title"
							id="services_intro_title"
							rows={2}
							defaultValue={initialContent.services_intro_title || ""}
							className="block w-full rounded-md border-neutral-light shadow-sm focus:border-primary focus:ring-primary text-sm text-foreground-light bg-screen-light"
							onBlur={handleBlur}
						/>
						<label
							htmlFor="services_intro_text"
							className="block text-sm font-medium text-secondary mb-1 pt-3"
						>
							Services Intro Text
						</label>
						<RichTextField
							name="services_intro_text"
							initialJSON={initialContent.services_intro_text || ""}
							disabled={
								fetcher.state === "submitting" || fetcher.state === "loading"
							}
						/>
					</div>
					{serviceFields.map((field, idx) => (
						<div
							key={field.label}
							className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-neutral-light pt-6 mt-6"
						>
							<div className="flex flex-col gap-y-1.5">
								<label
									htmlFor={field.titleKey}
									className="block text-sm font-medium text-secondary mb-1"
								>
									{field.label} Title
								</label>
								<textarea
									name={field.titleKey}
									id={field.titleKey}
									rows={2}
									defaultValue={initialContent[field.titleKey] || ""}
									className="block w-full rounded-md border-neutral-light shadow-sm focus:border-primary focus:ring-primary text-sm text-foreground-light bg-screen-light"
									onBlur={handleBlur}
								/>
								<label
									htmlFor={field.textKey}
									className="block text-sm font-medium text-secondary mb-1 pt-3"
								>
									{field.label} Text
								</label>
								<RichTextField
									name={field.textKey}
									initialJSON={initialContent[field.textKey] || ""}
									disabled={
										fetcher.state === "submitting" ||
										fetcher.state === "loading"
									}
								/>
							</div>
							<div className="flex flex-col items-center justify-start pt-1">
								<label
									className="block text-sm font-medium text-secondary mb-1 self-start"
									htmlFor={`service-image-upload-${idx}`}
								>
									{field.label} Image
								</label>
								<p className="text-xs text-neutral-dark mb-2 self-start">
									Upload or drag and drop an image for the
									{field.label.toLowerCase()}.
								</p>
								<div
									className="text-sm text-tertiary mb-2 h-5 self-start"
									role="status"
									aria-live="polite"
								>
									{statusTexts[idx]}
								</div>
								<ImageSelector
									onDrop={handleDrop(idx)}
									disabled={imageUploading[idx]}
									uploading={imageUploading[idx]}
									imageUrl={serviceImageUrls[idx]}
									label={`${field.label} Image`}
									className="mt-1"
									fieldKey={field.imageKey}
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
