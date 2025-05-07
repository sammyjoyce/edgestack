import React, { type JSX, useState, useEffect } from "react";
import type { FetcherWithComponents } from "react-router";

import { ImageSelector } from "~/routes/admin/components/ImageSelector";
import RichTextField from "~/routes/admin/components/RichTextField";
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
		<div className="overflow-hidden bg-white sm:rounded-lg shadow-xs border border-gray-200">
			{/* Use white bg, adjusted shadow/border */}
			<div className="px-4 py-5 sm:p-6">
				<h2 className="text-xl font-semibold text-gray-900 mb-6">
					About Section
				</h2>
				{/* Use semibold, increased margin */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="flex flex-col gap-y-1.5">
						{/* Reduced gap */}
						<label
							htmlFor="about_title"
							className="block text-sm font-medium text-gray-700 mb-1" /* Standard label */
						>
							About Title
						</label>
						<textarea
							name="about_title"
							id="about_title"
							rows={2}
							defaultValue={initialContent.about_title || ""}
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm" /* Standard input */
							onBlur={handleBlur}
						/>
						<label
							htmlFor="about_text"
							className="block text-sm font-medium text-gray-700 mb-1 mt-3"
						>
							{/* Standard label, added margin */}
							About Text
						</label>
						{/* Rich text editor for about_text using Lexical */}
						<RichTextField
							name="about_text"
							initialJSON={initialContent.about_text}
							disabled={fetcher.state === "submitting"}
						/>
					</div>
					<div className="flex flex-col items-center justify-start pt-1">
						{/* Align top */}
						<label
							className="block text-sm font-medium text-gray-700 mb-1 self-start" /* Standard label, align left */
							htmlFor="about-image-upload"
						>
							About Image
						</label>
						<p className="text-xs text-gray-500 mb-2 self-start">
							{/* Help text */}
							Upload or drag and drop an image for the about section.
						</p>
						<output
							id="about-image-upload-status"
							aria-live="polite"
							className="text-sm text-gray-600 mb-2 h-5 self-start" /* Align left */
						>
							{uploadStatus}
						</output>
						<ImageSelector
							onDrop={handleDrop}
							disabled={isUploading} // Use renamed prop
							uploading={isUploading} // Use renamed prop
							imageUrl={aboutImageUrl}
							label="About Image"
							className="mt-1" /* Added margin */
							fieldKey="about_image_url" // The field key for this image
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
