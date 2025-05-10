import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { ImageSelector } from "~/routes/admin/components/ImageSelector";

import { GrayscaleTransitionImage } from "~/routes/common/components/ui/GrayscaleTransitionImage";
import { SectionIntro } from "~/routes/common/components/ui/SectionIntro";

const imageFields = [
	{ key: "hero_image_url", label: "Hero Image" },
	{ key: "about_image_url", label: "About Image" },
	{ key: "service_1_image", label: "Service 1 Image" },
	{ key: "service_2_image", label: "Service 2 Image" },
	{ key: "service_3_image", label: "Service 3 Image" },
	{ key: "service_4_image", label: "Service 4 Image" },
];

type UploadActionData = {
	success?: boolean;
	url?: string;
	key?: string;
	error?: string;
	action?: "upload" | "select" | "delete";
};

function isUploadResponse(data: unknown): data is UploadActionData {
	return (
		typeof data === "object" &&
		data !== null &&
		("success" in data || "error" in data)
	);
}

interface ImageUploadSectionProps {
	initialContent: Record<string, string>;
	sectionRef?: React.RefObject<HTMLDivElement>;
}

function SingleImageUpload({
	keyName,
	label,
	initialValue,
	fetcher,
	fileInputRef,
	statusText,
	setStatusText,
}: {
	keyName: string;
	label: string;
	initialValue: string;
	fetcher: ReturnType<typeof useFetcher<UploadActionData>>;
	fileInputRef: React.RefObject<HTMLInputElement>;
	statusText: string;
	setStatusText: (v: string) => void;
}) {
	const makeDropHandler = useCallback(
		(files: File[]) => {
			const [file] = files;
			if (!file) return;

			const formData = new FormData();
			formData.append("intent", "uploadImage");
			formData.append("image", file);
			formData.append("key", keyName);

			fetcher.submit(formData, {
				method: "post",
				action: "/admin/upload",
				encType: "multipart/form-data",
			});

			setStatusText(`Uploading ${label}…`);
		},
		[fetcher, keyName, label, setStatusText],
	);

	useEffect(() => {
		if (fetcher.state === "idle" && isUploadResponse(fetcher.data)) {
			if (fetcher.data.success && fetcher.data.action === "upload") {
				if (fileInputRef.current) fileInputRef.current.value = "";
				setStatusText(`${label} upload successful!`);
			} else if (fetcher.data.error) {
				setStatusText(fetcher.data.error);
			}
		}
	}, [fetcher, label, setStatusText, fileInputRef]);

	return (
		<fetcher.Form
			method="post"
			action="/admin/upload"
			encType="multipart/form-data"
			className="flex flex-col items-center gap-2 pt-4"
			aria-describedby={`help-${keyName}`}
		>
			<label
				htmlFor={`${keyName}_input`}
				className="block text-sm font-medium text-gray-700 mb-1 self-start"
			>
				{label}
				<span
					id={`help-${keyName}`}
					className="ml-1 text-xs text-gray-500"
					role="tooltip"
				>
					Upload or drag and drop an image for the {label.toLowerCase()}.
				</span>
			</label>
			<ImageSelector
				fileInputRef={fileInputRef}
				onDrop={makeDropHandler}
				disabled={fetcher.state === "submitting"}
				uploading={fetcher.state === "submitting"}
				imageUrl={
					(isUploadResponse(fetcher.data) &&
						fetcher.data.success &&
						fetcher.data.url) ||
					initialValue ||
					""
				}
				label={label}
				className="w-full"
				fieldKey={keyName}
			/>
			<input type="hidden" name="key" value={keyName} />
			<div
				className="text-sm text-gray-600 h-5 mt-2"
				role="status"
				aria-live="polite"
			>
				{statusText}
			</div>
			<GrayscaleTransitionImage
				id={`${keyName}_preview`}
				src={
					(isUploadResponse(fetcher.data) &&
						fetcher.data.success &&
						fetcher.data.url) ||
					initialValue ||
					""
				}
				alt={`${label} Preview`}
				className="rounded border border-gray-200 mt-2 max-w-full w-48 h-auto object-cover bg-gray-100"
			/>
			{isUploadResponse(fetcher.data) && fetcher.data.error && (
				<div className="text-red-600 mt-2 text-xs" role="alert">
					{fetcher.data.error}
				</div>
			)}
		</fetcher.Form>
	);
}

export function ImageUploadSection({
	initialContent,
	sectionRef,
}: ImageUploadSectionProps) {
	const localRef = useRef<HTMLDivElement>(null);
	const ref = sectionRef || localRef;

	const [statusTexts, setStatusTexts] = useState<string[]>(
		Array(imageFields.length).fill(""),
	);

	const fetchers = imageFields.map(() => useFetcher<UploadActionData>());
	const fileInputRefs = imageFields.map(() => useRef<HTMLInputElement>(null));

	return (
		<section
			id="image-uploads"
			ref={ref}
			className="bg-gray-50 border border-gray-200 rounded-lg shadow-(--shadow-input-default) p-6 mt-8"
			aria-labelledby="image-uploads-heading"
		>
			<SectionIntro title="Image Uploads" className="mb-4" />
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{imageFields.map(({ key, label }, idx) => (
					<SingleImageUpload
						key={key}
						keyName={key}
						label={label}
						initialValue={initialContent[key] || ""}
						fetcher={fetchers[idx]}
						fileInputRef={fileInputRefs[idx]}
						statusText={statusTexts[idx]}
						setStatusText={(v) =>
							setStatusTexts((prev) => {
								const next = [...prev];
								next[idx] = v;
								return next;
							})
						}
					/>
				))}
			</div>
		</section>
	);
}
