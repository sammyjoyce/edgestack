import React from "react";
import type { FetcherWithComponents } from "react-router";
import { ImageSelector } from "~/routes/admin/components/ImageSelector";
import RichTextField from "~/routes/admin/components/RichTextField";
import {
	FieldLabel,
	FieldRow,
	SectionCard,
	SectionHeading,
} from "~/routes/admin/components/ui/section";
import { Textarea } from "~/routes/admin/components/ui/textarea";
import type { Route as AdminIndexRoute } from "~/routes/admin/views/+types/index";
import type { Route as AdminUploadRoute } from "~/routes/admin/views/+types/upload";
import { Input } from "../../ui/input";
const DEBUG = process.env.NODE_ENV !== "production";
interface HeroSectionEditorProps {
	fetcher: FetcherWithComponents<
		AdminIndexRoute.ActionData | AdminUploadRoute.ActionData
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
	const [uploadStatus, setUploadStatus] = React.useState<string | null>(null);
	const handleBlur = React.useCallback(
		(e: React.FocusEvent<HTMLTextAreaElement>) => {
			const { name, value } = e.currentTarget;
			if (DEBUG) {
				console.log(
					`[HeroSectionEditor] handleBlur triggered for ${name} with value: "${value}"`,
				);
			}
			const formData = new FormData();
			formData.append("intent", "updateTextContent");
			formData.append(name, value);
			console.log(
				`[HeroSectionEditor] Submitting form with intent: updateTextContent, ${name}: "${value}"`,
			);
			try {
				fetcher.submit(formData, {
					method: "post",
					action: "/admin",
				});
				if (DEBUG)
					console.log("[HeroSectionEditor] Form submitted successfully");
			} catch (error) {
				if (DEBUG)
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
		<SectionCard>
			<SectionHeading>Hero Section</SectionHeading>
			<h3 className="text-lg font-semibold text-foreground mb-6">
				Hero Section
			</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="flex flex-col gap-1">
					<FieldLabel htmlFor="hero_title">Hero Title</FieldLabel>
					<Textarea
						name="hero_title"
						id="hero_title"
						rows={2}
						defaultValue={initialContent.hero_title || ""}
						onBlur={handleBlur}
					/>
					{/* Placeholder for error/help text */}
					<FieldLabel htmlFor="hero_subtitle" className="mt-3">
						Hero Subtitle
					</FieldLabel>
					<RichTextField
						name="hero_subtitle"
						initialJSON={initialContent.hero_subtitle || ""}
						disabled={
							fetcher.state === "submitting" || fetcher.state === "loading"
						}
					/>
					{/* Placeholder for error/help text */}
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
						className="text-sm text-neutral-600 mb-2 h-5 min-h-5"
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
		</SectionCard>
	);
}
