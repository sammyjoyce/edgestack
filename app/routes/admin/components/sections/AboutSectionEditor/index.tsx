import React, { type JSX, useState, useEffect, useCallback } from "react"; // Added useCallback
import type { FetcherWithComponents } from "react-router";

import { ImageSelector } from "~/routes/admin/components/ImageSelector";
import RichTextField from "~/routes/admin/components/RichTextField";
import {
	FieldLabel,
	FieldRow,
	SectionCard,
	SectionHeading,
} from "~/routes/admin/components/ui/section";
// Import the specific action types
import type { action as adminIndexAction } from "~/routes/admin/views/index";
import type { action as adminUploadAction } from "~/routes/admin/views/upload";

interface AboutSectionEditorProps {
	// Use a union type with inferred action types
	fetcher: FetcherWithComponents<
		typeof adminIndexAction | typeof adminUploadAction
	>;
	initialContent: Record<string, string>;
	onImageUpload: (file: File) => void;
	imageUploading: boolean;
	aboutImageUrl?: string;
}

export function AboutSectionEditor({
	fetcher,
	initialContent,
	onImageUpload,
	imageUploading: isUploading, // Renamed destructured prop
	aboutImageUrl,
}: AboutSectionEditorProps): React.JSX.Element {
	// Changed to React.JSX.Element
	const [uploadStatus, setUploadStatus] = useState<string | null>(null);

	const handleBlur = React.useCallback(
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

	const handleDrop = React.useCallback(
		(files: File[]) => {
			const [file] = files;
			if (!file) return;
			onImageUpload(file);
			setUploadStatus("Uploading About Image...");
		},
		[onImageUpload],
	);

	// Update status message when upload completes
	useEffect(() => {
		if (!isUploading && uploadStatus === "Uploading About Image...") {
			// Use renamed prop
			setUploadStatus("About Image uploaded successfully!");
		}
	}, [isUploading, uploadStatus]); // Use renamed prop in dependency array

	return (
		<SectionCard>
			<SectionHeading>About Section</SectionHeading>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<FieldRow>
					<FieldLabel htmlFor="about_title">About Title</FieldLabel>
					<textarea
						name="about_title"
						id="about_title"
						rows={2}
						defaultValue={initialContent.about_title || ""}
						className="block w-full rounded-md border-gray-300 bg-white shadow-(--shadow-input-default) focus:border-primary focus:ring-primary text-sm"
						onBlur={handleBlur}
					/>
					<FieldLabel htmlFor="about_text" className="mt-3">
						About Text
					</FieldLabel>
					<RichTextField
						name="about_text"
						initialJSON={initialContent.about_text}
						disabled={fetcher.state === "submitting"}
					/>
				</FieldRow>
				<div className="flex flex-col items-center justify-start pt-1">
					<FieldLabel htmlFor="about-image-upload" className="self-start">
						About Image
					</FieldLabel>
					<p className="text-xs text-gray-500 mb-2 self-start">
						Upload or drag and drop an image for the about section.
					</p>
					<output
						id="about-image-upload-status"
						aria-live="polite"
						className="text-sm text-gray-600 mb-2 h-5 self-start"
					>
						{uploadStatus}
					</output>
					<ImageSelector
						onDrop={handleDrop}
						disabled={isUploading}
						uploading={isUploading}
						imageUrl={aboutImageUrl}
						label="About Image"
						className="mt-1"
						fieldKey="about_image_url"
					/>
				</div>
			</div>
		</SectionCard>
	);
}
