import { clsx } from "clsx";
import type React from "react";
import { type JSX, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useSearchParams } from "react-router";
import { ButtonLED } from "../ui/button"; // Assuming ButtonLED is imported from here
import { Text } from "../ui/text";

interface ImageUploadZoneProps {
	onDrop: (files: File[]) => void;
	disabled?: boolean;
	uploading?: boolean;
	imageUrl?: string;
	label?: string;
	className?: string;
	fileInputRef?: React.RefObject<HTMLInputElement | null>;
	inputName?: string;
	hasExistingImage?: boolean;
	browseButtonTrigger?: React.ReactNode;
	browseDrawerPortal?: React.ReactNode;
}

export default function ImageUploadZone({
	onDrop,
	disabled = false,
	uploading = false,
	imageUrl,
	label = "Upload Image",
	className = "",
	fileInputRef,
	inputName,
	hasExistingImage,
	browseButtonTrigger,
	browseDrawerPortal,
}: ImageUploadZoneProps): JSX.Element {
	const [searchParams] = useSearchParams();
	const contentUpdated = searchParams.get("contentUpdated") === "true";

	const handleDrop = useCallback(
		(accepted: File[]) => {
			if (!disabled && accepted.length > 0) {
				onDrop(accepted);
			}
		},
		[onDrop, disabled],
	);

	const { getRootProps, getInputProps, isDragActive, isDragReject } =
		useDropzone({
			accept: { "image/*": [] },
			maxFiles: 1,
			onDrop: handleDrop,
			disabled,
		});

	return (
		<section className={clsx(className, "w-full")}>
			<div
				className={clsx(
					hasExistingImage
						? "flex items-start w-full"
						: "flex flex-col items-center w-full",
				)}
			>
				{/* Only show the preview image to the left when NOT in the browse drawer portal (i.e., normal usage) */}
				{!browseDrawerPortal && hasExistingImage && imageUrl && (
					<img
						src={imageUrl}
						alt={label}
						className="w-24 h-24 object-cover rounded-md mr-4"
					/>
				)}
				{/* New wrapper for combined look */}
				<div
					className={clsx(
						"ring-1 rounded-md overflow-hidden",
						"bg-admin-white",
						"ring-admin-border",
						"focus-within:ring-2 focus-within:ring-admin-primary",
						"w-full",
					)}
				>
					<div
						{...getRootProps()}
						className={clsx(
							"flex flex-col items-center justify-center border-2 border-dashed border-b-0 p-6 transition",
							"min-h-32",
							"bg-admin-white hover:bg-admin-screen",
							"cursor-pointer",
							"rounded-t-md",
							isDragReject && "border-red-400 bg-red-50",
							isDragActive && "border-primary bg-primary/10",
							!isDragActive && !isDragReject && "border-admin-border",
							disabled && "opacity-60 pointer-events-none",
						)}
						aria-label="Image upload drop zone"
					>
						<input ref={fileInputRef} {...getInputProps()} name={inputName} />
						<Text className="text-sm text-center text-admin-text-muted">
							{uploading
								? "Uploading..."
								: isDragActive
									? hasExistingImage
										? "Drop to replace image"
										: "Drop image to upload"
									: hasExistingImage
										? "Drag new image here, or click to replace"
										: "Drag image here, or click to select"}
						</Text>
					</div>

					{/* Browse button or LED depending on props and contentUpdated */}
					{browseButtonTrigger ? (
						<div
							className={clsx(
								"w-full flex items-center justify-center",
								"border-t border-admin-border",
								"bg-admin-screen",
								"rounded-t-none",
								"p-0",
							)}
						>
							{browseButtonTrigger}
						</div>
					) : contentUpdated ? (
						<div className="w-full flex items-center justify-center border-t border-admin-border bg-admin-screen rounded-t-none p-2">
							<ButtonLED isActive={!!imageUrl} />
						</div>
					) : null}
				</div>
			</div>
			{browseDrawerPortal}
		</section>
	);
}
