import React from "react";
import type { FetcherWithComponents } from "react-router";
import type { action as adminIndexAction } from "~/routes/admin/views/index";
import type { action as adminUploadAction } from "~/routes/admin/views/upload";

import { ImageSelector } from "~/routes/admin/components/ImageSelector";

interface HeroSectionEditorProps {
	// Use a union type with inferred action types
	fetcher: FetcherWithComponents<
		typeof adminIndexAction | typeof adminUploadAction
	>;
	initialContent: Record<string, string>;
	onImageUpload: (file: File) => void;
	imageUploading: boolean;
	heroImageUrl?: string;
}

export function HeroSectionEditor({
	fetcher,
	initialContent,
	onImageUpload,
	imageUploading,
	heroImageUrl,
}: HeroSectionEditorProps): React.ReactElement {
	// Use React.ReactElement
	const [uploadStatus, setUploadStatus] = React.useState<string | null>(null);

	const handleBlur = React.useCallback(
		(e: React.FocusEvent<HTMLTextAreaElement>) => {
			const { name, value } = e.currentTarget;

			// Debug log
			console.log(
				`[HeroSectionEditor] handleBlur triggered for ${name} with value: "${value}"`,
			);

			// Create and populate form data
			const formData = new FormData();
			formData.append("intent", "updateTextContent");
			formData.append(name, value);

			console.log(
				`[HeroSectionEditor] Submitting form with intent: updateTextContent, ${name}: "${value}"`,
			);

			// Submit form with explicit method and action
			try {
				fetcher.submit(formData, {
					method: "post",
					action: "/admin",
				});
				console.log("[HeroSectionEditor] Form submitted successfully");
			} catch (error) {
				console.error("[HeroSectionEditor] Error submitting form:", error);
			}
		},
		[fetcher],
	);

	const handleDrop = React.useCallback(
		(files: File[]) => {
			const [file] = files;
			if (!file) return;
			onImageUpload(file);
			setUploadStatus("Uploading Hero Image…");
		},
		[onImageUpload],
	);

	React.useEffect(() => {
		if (!imageUploading && uploadStatus === "Uploading Hero Image…") {
			setUploadStatus("Hero Image uploaded successfully!");
		}
	}, [imageUploading, uploadStatus]);

	return (
		<div className="bg-white p-6 rounded-lg shadow-block border border-neutral-200">
			<h3 className="text-lg font-semibold text-foreground mb-6">
				Hero Section
			</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="flex flex-col gap-y-4">
					<label
						htmlFor="hero_title"
						className="block text-sm font-medium text-foreground mb-1"
					>
						Hero Title
					</label>
					<textarea
						name="hero_title"
						id="hero_title"
						rows={2}
						defaultValue={initialContent.hero_title || ""}
						className="block w-full rounded-md border-neutral-300 bg-white shadow-input-default focus:border-primary focus:ring-1 focus:ring-primary text-sm p-2.5"
						onBlur={handleBlur}
					/>
					<label
						htmlFor="hero_subtitle"
						className="block text-sm font-medium text-foreground mb-1 mt-2"
					>
						Hero Subtitle
					</label>
					<textarea
						name="hero_subtitle"
						id="hero_subtitle"
						rows={3}
						defaultValue={initialContent.hero_subtitle || ""}
						className="block w-full rounded-md border-neutral-300 bg-white shadow-input-default focus:border-primary focus:ring-1 focus:ring-primary text-sm p-2.5"
						onBlur={handleBlur}
					/>
				</div>
				<div className="flex flex-col items-start justify-start pt-1">
					<label
						className="block text-sm font-medium text-foreground mb-1"
						htmlFor="hero-image-upload"
					>
						Hero Image
					</label>
					<p className="text-xs text-neutral-500 mb-2">
						Upload or drag and drop an image for the hero section.
					</p>
					<output
						id="hero-image-upload-status"
						aria-live="polite"
						className="text-sm text-neutral-600 mb-2 h-5 min-h-[1.25rem]"
					>
						{uploadStatus}
					</output>
					<ImageSelector
						onDrop={handleDrop}
						disabled={imageUploading}
						uploading={imageUploading}
						imageUrl={heroImageUrl}
						label="Hero Image"
						className="mt-1 w-full"
						fieldKey="hero_image_url"
					/>
				</div>
			</div>
		</div>
	);
}
