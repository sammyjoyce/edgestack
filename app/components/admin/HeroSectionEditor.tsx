import type React from "react";
import type { FetcherWithComponents } from "react-router";
import { Button } from "../ui/Button";
import { FadeIn } from "../ui/FadeIn";
import ImageUploadZone from "./ImageUploadZone";

interface HeroSectionEditorProps {
  fetcher: FetcherWithComponents<any>;
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
}: HeroSectionEditorProps) {
  // Dropzone replaces file input

  // Handler for auto-save on blur
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">Hero Section</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <label htmlFor="hero_title" className="font-semibold text-gray-700">
              Hero Title
            </label>
            <textarea
              name="hero_title"
              id="hero_title"
              rows={2}
              defaultValue={initialContent.hero_title || ""}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              onBlur={handleBlur}
            />
            <label
              htmlFor="hero_subtitle"
              className="font-semibold text-gray-700"
            >
              Hero Subtitle
            </label>
            <textarea
              name="hero_subtitle"
              id="hero_subtitle"
              rows={3}
              defaultValue={initialContent.hero_subtitle || ""}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              onBlur={handleBlur}
            />
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <label
              className="font-semibold text-gray-700 mb-2"
              htmlFor="hero-image-upload"
            >
              Hero Image
              <span className="ml-1 text-xs text-gray-500" role="tooltip">
                Upload or drag and drop an image for the hero section.
              </span>
            </label>
            <div
              id="hero-image-upload-status"
              role="status"
              aria-live="polite"
              className="sr-only"
            ></div>
            <ImageUploadZone
              onDrop={(files) => {
                handleDrop(files);
                const status = document.getElementById(
                  "hero-image-upload-status"
                );
                if (status) status.textContent = `Uploading Hero Image...`;
              }}
              disabled={imageUploading}
              uploading={imageUploading}
              imageUrl={heroImageUrl}
              label="Hero Image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
