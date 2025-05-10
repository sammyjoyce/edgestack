import type React from "react"; // Import React
import { type JSX, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploadZoneProps {
	onDrop: (files: File[]) => void;
	disabled?: boolean;
	uploading?: boolean;
	imageUrl?: string;
	label?: string;
	className?: string;
	fileInputRef?: React.RefObject<HTMLInputElement>;
}

export default function ImageUploadZone({
	onDrop,
	disabled = false,
	uploading = false,
	imageUrl,
	label = "Upload Image",
	className = "",
	fileInputRef,
}: ImageUploadZoneProps): JSX.Element {
	// Use JSX.Element
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
		<section className={`${className} w-full flex flex-col items-center`}>
			{/* Removed margin */}
			<div
				{...getRootProps()}
				className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition w-full max-w-xs min-h-32 bg-gray-50 hover:bg-gray-100 cursor-pointer ${
					/* Reduced min-height, added hover */
					isDragReject
						? "border-red-400 bg-red-50" /* Adjusted colors */
						: isDragActive
							? "border-primary bg-primary/10" /* Adjusted colors */
							: "border-gray-300"
				} ${disabled ? "opacity-50 pointer-events-none" : ""}`}
				aria-label="Image upload drop zone"
			>
				<input ref={fileInputRef} {...getInputProps()} />
				<p className="text-sm text-center text-gray-600">
					{/* Adjusted color */}
					{uploading
						? "Uploading..."
						: isDragActive
							? "Drop image to upload"
							: "Drag image here, or click to select"}
				</p>
			</div>
			{imageUrl && (
				<img
					src={imageUrl}
					alt={`Preview of ${label}`}
					className="rounded border border-gray-200 mt-3 max-w-full w-48 h-auto object-cover bg-gray-100" /* Adjusted margin/border */
				/>
			)}
		</section>
	);
}
