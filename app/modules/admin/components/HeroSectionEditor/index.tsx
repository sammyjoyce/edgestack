import React from "react";
import type { FetcherWithComponents } from "react-router";

import ImageUploadZone from "~/modules/admin/components/ImageUploadZone";
import type { action } from "~/modules/admin/pages";

interface HeroSectionEditorProps {
  fetcher: FetcherWithComponents<typeof action>;
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
}: HeroSectionEditorProps): JSX.Element {
  const [uploadStatus, setUploadStatus] = React.useState<string | null>(null);

  const handleBlur = React.useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      const { name, value } = e.currentTarget;
      const data = new FormData();
      data.append(name, value);
      fetcher.submit(data, { method: "post" });
    },
    [fetcher]
  );

  const handleDrop = React.useCallback(
    (files: File[]) => {
      const [file] = files;
      if (!file) return;
      onImageUpload(file);
      setUploadStatus("Uploading Hero Image…");
    },
    [onImageUpload]
  );

  React.useEffect(() => {
    if (!imageUploading && uploadStatus === "Uploading Hero Image…") {
      setUploadStatus("Hero Image uploaded successfully!");
    }
  }, [imageUploading, uploadStatus]);

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
              className="text-sm text-gray-600 mb-2 h-5"
            >
              {uploadStatus}
            </div>
            <ImageUploadZone
              onDrop={handleDrop}
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