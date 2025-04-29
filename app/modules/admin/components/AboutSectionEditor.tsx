import type React from "react";
import type { FetcherWithComponents } from "react-router";
import ImageUploadZone from "./ImageUploadZone";
import RichTextField from "./RichTextField";

interface AboutSectionEditorProps {
  fetcher: FetcherWithComponents<any>;
  initialContent: Record<string, string>;
  onImageUpload: (file: File) => void;
  imageUploading: boolean;
  aboutImageUrl?: string;
}

export function AboutSectionEditor({
  fetcher,
  initialContent,
  onImageUpload,
  imageUploading,
  aboutImageUrl,
}: AboutSectionEditorProps) {
  // Dropzone replaces file input

  function handleBlur(e: React.FocusEvent<HTMLTextAreaElement>) {
    const { name, value } = e.target;
    const data = new FormData();
    data.append(name, value);
    fetcher.submit(data, { method: "post" });
  }

  // Dropzone handles file selection and calls onImageUpload
  const handleDrop = (files: File[]) => {
    if (files && files[0]) {
      onImageUpload(files[0]);
    }
  };

  return (
    <div className="overflow-hidden bg-gray-50 sm:rounded-lg mb-8">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">About Section</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <label
              htmlFor="about_title"
              className="font-semibold text-gray-700"
            >
              About Title
            </label>
            <textarea
              name="about_title"
              id="about_title"
              rows={2}
              defaultValue={initialContent.about_title || ""}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              onBlur={handleBlur}
            />
            <label htmlFor="about_text" className="font-semibold text-gray-700">
              About Text
            </label>
            {/* Rich text editor for about_text using Lexical */}
            <RichTextField
              name="about_text"
              initialJSON={initialContent.about_text}
              disabled={fetcher.state === "submitting"}
            />
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <label
              className="font-semibold text-gray-700 mb-2"
              htmlFor="about-image-upload"
            >
              About Image
              <span className="ml-1 text-xs text-gray-500" role="tooltip">
                Upload or drag and drop an image for the about section.
              </span>
            </label>
            <div
              id="about-image-upload-status"
              role="status"
              aria-live="polite"
              className="sr-only"
            ></div>
            <ImageUploadZone
              onDrop={(files) => {
                handleDrop(files);
                const status = document.getElementById(
                  "about-image-upload-status"
                );
                if (status) status.textContent = `Uploading About Image...`;
              }}
              disabled={imageUploading}
              uploading={imageUploading}
              imageUrl={aboutImageUrl}
              label="About Image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
