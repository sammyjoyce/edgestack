import type React from "react";
import type { JSX } from "react";
import { useCallback, useEffect, useState } from "react";
import { Textarea } from "../../ui/textarea"; // Add missing Textarea import
import type { useFetcher } from "react-router";
import { Alert } from "~/routes/admin/components/ui/alert";
import { Text as TextComponent } from "~/routes/admin/components/ui/text";
import { ImageSelector } from "~/routes/admin/components/ImageSelector";
import RichTextField from "~/routes/admin/components/RichTextField";
import {
	FieldLabel,
	SectionCard,
	SectionHeading,
} from "~/routes/admin/components/ui/section";

interface ServiceField {
	titleKey: string;
	textKey: string;
	imageKey: string;
	label: string;
}

interface ServicesSectionEditorProps {
	fetcher: ReturnType<typeof useFetcher>;
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

export function ServicesSectionEditor({
	fetcher,
	initialContent,
	onImageUpload,
	imageUploading,
	serviceImageUrls,
}: ServicesSectionEditorProps): JSX.Element {
	const [statusTexts, setStatusTexts] = useState<string[]>(
		Array(serviceFields.length).fill(""),
	);

	const actionData = fetcher.data as
		| { error?: string; errors?: Record<string, string> }
		| undefined;

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
		<>
			{actionData?.error && (
				<Alert variant="error" title="Save failed" className="mb-4">
					{actionData.error}
				</Alert>
			)}

			{/* Services Intro Section */}
			<SectionCard className="mb-6">
				<SectionHeading>Services Section Intro</SectionHeading>
				<div className="px-4 py-5 sm:p-6">
					<div className="flex flex-col gap-3">
						<FieldLabel htmlFor="services_intro_title">
							Services Intro Title
						</FieldLabel>
						<Textarea
							name="services_intro_title"
							id="services_intro_title"
							rows={2}
							defaultValue={initialContent.services_intro_title || ""}
							onBlur={handleBlur}
						/>
						{actionData?.errors?.services_intro_title && (
							<TextComponent className="text-sm text-red-600 mt-1">
								{actionData.errors.services_intro_title}
							</TextComponent>
						)}
					</div>
					<div className="flex flex-col gap-3 mt-4">
						<FieldLabel htmlFor="services_intro_text">
							Services Intro Text
						</FieldLabel>
						<RichTextField
							name="services_intro_text"
							initialJSON={initialContent.services_intro_text || ""}
							disabled={
								fetcher.state === "submitting" || fetcher.state === "loading"
							}
							onBlur={(val) => {
								if (val === initialContent.services_intro_text) return;
								const formData = new FormData();
								formData.append("intent", "updateTextContent");
								formData.append("page", "home");
								formData.append("section", "services");
								formData.append("services_intro_text", val);
								fetcher.submit(formData, { method: "post", action: "/admin" });
							}}
							className="mt-1"
						/>
						{actionData?.errors?.services_intro_text && (
							<TextComponent className="text-sm text-red-600 mt-1">
								{actionData.errors.services_intro_text}
							</TextComponent>
						)}
					</div>
				</div>
			</SectionCard>

			{/* Individual Service Cards */}
			<div className="grid gap-6">
				{serviceFields.map((field, idx) => (
					<SectionCard key={field.label}>
						<SectionHeading>{field.label}</SectionHeading>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 py-5 sm:p-6">
							{/* Left: Title only */}
							<div className="flex flex-col gap-4">
								<div>
									<FieldLabel htmlFor={field.titleKey}>
										{field.label} Title
									</FieldLabel>
									<Textarea
										name={field.titleKey}
										id={field.titleKey}
										rows={2}
										defaultValue={initialContent[field.titleKey] || ""}
										onBlur={handleBlur}
									/>
									{actionData?.errors?.[field.titleKey] && (
										<TextComponent className="text-sm text-red-600 mt-1">
											{actionData.errors[field.titleKey]}
										</TextComponent>
									)}
								</div>
							</div>
							{/* Right: Image upload UI remains */}
							<div className="flex flex-col gap-4">
								<div>
									<FieldLabel
										className="self-start"
										htmlFor={`service-image-upload-${idx}`}
									>
										{field.label} Image
									</FieldLabel>
									<TextComponent className="text-xs text-neutral-dark mb-2 self-start">
										Upload or drag and drop an image for the{" "}
										{field.label.toLowerCase()}.
									</TextComponent>
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
						</div>
					</SectionCard>
				))}
			</div>
		</>
	);
}
