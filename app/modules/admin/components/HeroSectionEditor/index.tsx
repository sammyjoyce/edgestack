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
}: HeroSectionEditorProps): React.ReactElement { // Use React.ReactElement
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
    <div className="overflow-hidden bg-white sm:rounded-lg shadow-sm border border-gray-200">
      {" "}
      {/* Use white bg, adjusted shadow/border */}
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Hero Section
        </h2>{" "}
        {/* Use semibold, increased margin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-y-1.5">
            {" "}
            {/* Reduced gap */}
            <label
              htmlFor="hero_title"
              className="block text-sm font-medium text-gray-700"
            >
              {" "}
              {/* Standard label */}
              Hero Title
            </label>
            <textarea
              name="hero_title"
              id="hero_title"
              rows={2}
              defaultValue={initialContent.hero_title || ""}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" /* Standard input */
              onBlur={handleBlur}
            />
            <label
              htmlFor="hero_subtitle"
              className="block text-sm font-medium text-gray-700 mt-3" /* Standard label, added margin */
            >
              Hero Subtitle
            </label>
            <textarea
              name="hero_subtitle"
              id="hero_subtitle"
              rows={3}
              defaultValue={initialContent.hero_subtitle || ""}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" /* Standard input */
              onBlur={handleBlur}
            />
          </div>
          <div className="flex flex-col items-center justify-start pt-1">
            {" "}
            {/* Align top */}
            <label
              className="block text-sm font-medium text-gray-700 mb-1 self-start" /* Standard label, align left */
              htmlFor="hero-image-upload"
            >
              Hero Image
            </label>
            <p className="text-xs text-gray-500 mb-2 self-start">
              {" "}
              {/* Help text */}
              Upload or drag and drop an image for the hero section.
            </p>
            <div
              id="hero-image-upload-status"
              role="status"
              aria-live="polite"
              className="text-sm text-gray-600 mb-2 h-5 self-start" /* Align left */
            >
              {uploadStatus}
            </div>
            <ImageUploadZone
              onDrop={handleDrop}
              disabled={imageUploading}
              uploading={imageUploading}
              imageUrl={heroImageUrl}
              label="Hero Image"
              className="mt-1" /* Added margin */
            />
          </div>
        </div>
      </div>
    </div>
  );
}
