import type React from "react";
import { useCallback } from "react";
import { useDropzone } from "@common/ui/hooks/useDropzone";

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
}: ImageUploadZoneProps) {
  const handleDrop = useCallback(
    (accepted: File[]) => {
      if (!disabled && accepted.length > 0) {
        onDrop(accepted);
      }
    },
    [onDrop, disabled]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    acceptedFiles,
  } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: handleDrop,
    disabled,
  });

  return (
    <section className={className + " my-2 w-full flex flex-col items-center"}>
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition w-full max-w-xs min-h-[10rem] bg-gray-50 cursor-pointer ${
          isDragReject
            ? "border-red-500"
            : isDragActive
            ? "border-green-500"
            : "border-gray-300"
        } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
        aria-label="Image upload drop zone"
      >
        <input ref={fileInputRef} {...getInputProps()} />
        <p className="text-sm text-gray-700">
          {uploading
            ? "Uploading..."
            : isDragActive
            ? "Drop to upload"
            : "Drag image here or click to select"}
        </p>
      </div>
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Preview"
          className="rounded border mt-2 max-w-full w-48 h-auto object-cover bg-gray-100"
        />
      )}
    </section>
  );
}
