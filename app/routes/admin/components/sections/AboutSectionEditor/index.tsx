import React, { useEffect, useState } from "react";
import type { useFetcher } from "react-router";
import { Textarea } from "~/routes/admin/components/ui/textarea";
import { ImageSelector } from "~/routes/admin/components/ImageSelector";
import RichTextField from "~/routes/admin/components/RichTextField";
import { FieldLabel, SectionCard, SectionHeading } from "../../ui/section";
import { Text } from "~/routes/admin/components/ui/text";
import { Alert } from "~/routes/admin/components/ui/alert";

interface AboutSectionEditorProps {
	fetcher: ReturnType<typeof useFetcher>;
	initialContent: Record<string, string>;
	onImageUpload: (file: File) => void;
	imageUploading: boolean;
	aboutImageUrl?: string;
}

export function AboutSectionEditor({
	fetcher,
	initialContent,
	onImageUpload,
	imageUploading: isUploading,
	aboutImageUrl,
}: AboutSectionEditorProps): React.JSX.Element {
	const [uploadStatus, setUploadStatus] = useState<string | null>(null);
	const actionData = fetcher.data as
		| { error?: string; errors?: Record<string, string> }
		| undefined;

	const handleBlur = React.useCallback(
		(e: React.FocusEvent<HTMLTextAreaElement>) => {
			const { name, value } = e.currentTarget;
			const formData = new FormData();
			formData.append("intent", "updateTextContent");
			formData.append(name, value);
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

	useEffect(() => {
		if (!isUploading && uploadStatus === "Uploading About Image...") {
			setUploadStatus("About Image uploaded successfully!");
		}
	}, [isUploading, uploadStatus]);

	return (
		<SectionCard>
			{actionData?.error && (
				<Alert variant="error" title="Save failed" className="mb-4">
					{actionData.error}
				</Alert>
			)}
			<SectionHeading>About Section</SectionHeading>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-3 sm:gap-x-6">
				<div className="flex flex-col gap-1 min-w-0">
					<FieldLabel htmlFor="about_title">About Title</FieldLabel>
					<Textarea
						name="about_title"
						id="about_title"
						rows={2}
						defaultValue={initialContent.about_title || ""}
						onBlur={handleBlur}
						className="w-full min-w-0"
					/>
					{actionData?.errors?.about_title && (
						<Text className="text-sm text-red-600 mt-1">
							{actionData.errors.about_title}
						</Text>
					)}
					<FieldLabel htmlFor="about_text" className="mt-3">
						About Text
					</FieldLabel>
					<RichTextField
						name="about_text"
						initialJSON={initialContent.about_text}
						disabled={fetcher.state === "submitting"}
						onBlur={(val) => {
							if (val === initialContent.about_text) return;
							const formData = new FormData();
							formData.append("intent", "updateTextContent");
							formData.append("page", "home");
							formData.append("section", "about");
							formData.append("about_text", val);
							fetcher.submit(formData, { method: "post", action: "/admin" });
						}}
						className="w-full min-w-0 mt-1"
					/>
					{actionData?.errors?.about_text && (
						<Text className="text-sm text-red-600 mt-1">
							{actionData.errors.about_text}
						</Text>
					)}
					{/* Placeholder for error/help text */}
				</div>
				<div className="flex flex-col gap-4 pt-1 min-w-0">
					<FieldLabel htmlFor="about-image-upload" className="self-start">
						About Image
					</FieldLabel>
					<Text className="text-xs text-gray-500 mb-2 self-start">
						Upload or drag and drop an image for the about section.
					</Text>

					<ImageSelector
						onDrop={handleDrop}
						disabled={isUploading}
						uploading={isUploading}
						imageUrl={aboutImageUrl}
						label="About Image"
						className="mt-1 w-full min-w-0"
						fieldKey="about_image_url"
					/>
				</div>
			</div>
		</SectionCard>
	);
}
