import React from "react";
import type { useFetcher } from "react-router";
import { ImageSelector } from "~/routes/admin/components/ImageSelector";
import RichTextField from "~/routes/admin/components/RichTextField";
import {
	FieldLabel,
	SectionCard,
	SectionHeading,
} from "~/routes/admin/components/ui/section";
import { Textarea } from "~/routes/admin/components/ui/textarea";
import { Text } from "~/routes/admin/components/ui/text";
import { Alert } from "~/routes/admin/components/ui/alert";
import clsx from "clsx";

const DEBUG = process.env.NODE_ENV !== "production";

interface HeroSectionEditorProps {
	fetcher: ReturnType<typeof useFetcher>;
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
	const actionData = fetcher.data as
		| { error?: string; errors?: Record<string, string> }
		| undefined;
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
			{actionData?.error && (
				<Alert variant="error" title="Save failed" className="mb-4">
					{actionData.error}
				</Alert>
			)}
			<SectionHeading>Hero Section</SectionHeading>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-3 sm:gap-x-6">
				<div className="flex flex-col gap-1 min-w-0">
					<FieldLabel htmlFor="hero_title">Hero Title</FieldLabel>
					<Textarea
						name="hero_title"
						id="hero_title"
						rows={2}
						defaultValue={initialContent.hero_title || ""}
						onBlur={handleBlur}
						className="w-full min-w-0"
					/>
					{actionData?.errors?.hero_title && (
						<Text className="text-sm text-red-600 mt-1">
							{actionData.errors.hero_title}
						</Text>
					)}
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
						onBlur={(val) => {
							if (val === initialContent.hero_subtitle) return;
							const formData = new FormData();
							formData.append("intent", "updateTextContent");
							formData.append("page", "home");
							formData.append("section", "hero");
							formData.append("hero_subtitle", val);
							fetcher.submit(formData, { method: "post", action: "/admin" });
						}}
						className="w-full min-w-0 mt-1"
					/>
					{actionData?.errors?.hero_subtitle && (
						<Text className="text-sm text-red-600 mt-1">
							{actionData.errors.hero_subtitle}
						</Text>
					)}
					{/* Placeholder for error/help text */}
				</div>
				<div className="flex flex-col gap-2 min-w-0">
					<label
						className="block text-sm font-medium text-foreground mb-1"
						htmlFor="hero-image-upload" // This ID might need to be on the input inside ImageSelector for proper association
					>
						Hero Image
					</label>
					<Text className="text-xs text-neutral-500">
						{heroImageUrl
							? "Replace the current hero image or upload a new one."
							: "Upload or drag and drop an image for the hero section."}
					</Text>
					<div className="flex flex-col md:flex-row items-start gap-4 w-full">
						{heroImageUrl && (
							<img
								src={heroImageUrl}
								alt="Current Hero Image"
								className="rounded border border-gray-200 max-w-[150px] h-auto object-cover bg-gray-100"
							/>
						)}
						<ImageSelector
							onDrop={handleDrop}
							disabled={imageUploading}
							uploading={imageUploading}
							// imageUrl is handled by the img tag above now
							label="Hero Image"
							className={clsx(
								"mt-1",
								heroImageUrl ? "flex-1" : "w-full",
								"min-w-0",
							)}
							fieldKey="hero_image_url"
							hasExistingImage={!!heroImageUrl}
						/>
					</div>
				</div>
			</div>
		</SectionCard>
	);
}
