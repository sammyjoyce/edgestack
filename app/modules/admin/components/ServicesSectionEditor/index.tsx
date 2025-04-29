import React, { useState, useCallback, useEffect } from "react";
import type { FetcherWithComponents } from "react-router";
import ImageUploadZone from "~/modules/admin/components/ImageUploadZone";

interface ServiceField {
  titleKey: string;
  textKey: string;
  imageKey: string;
  label: string;
}

interface ServicesSectionEditorProps {
  fetcher: FetcherWithComponents<any>;
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

// ------------------------------------------------------------------------
// Component
// ------------------------------------------------------------------------
export function ServicesSectionEditor({
  fetcher,
  initialContent,
  onImageUpload,
  imageUploading,
  serviceImageUrls,
}: ServicesSectionEditorProps): JSX.Element {
  const [statusTexts, setStatusTexts] = useState<string[]>(
    Array(serviceFields.length).fill("")
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      const { name, value } = e.currentTarget;
      const data = new FormData();
      data.append(name, value);
      fetcher.submit(data, { method: "post" });
    },
    [fetcher]
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
    [onImageUpload]
  );

  // Update status once upload completes
  useEffect(() => {
    imageUploading.forEach((uploading, idx) => {
      if (!uploading && statusTexts[idx].startsWith("Uploading")) {
        setStatusTexts((prev) => {
          const next = [...prev];
          next[
            idx
          ] = `${serviceFields[idx].label} Image uploaded successfully!`;
          return next;
        });
      }
    });
  }, [imageUploading, statusTexts]);

  return (
    <div className="overflow-hidden bg-gray-50 sm:rounded-lg mb-8">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Services Section
        </h2>
        <div className="flex flex-col gap-8">
          <div className="mb-2">
            <label
              htmlFor="services_intro_title"
              className="font-semibold text-gray-700"
            >
              Services Intro Title
            </label>
            <textarea
              name="services_intro_title"
              id="services_intro_title"
              rows={2}
              defaultValue={initialContent.services_intro_title || ""}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 mb-2"
              onBlur={handleBlur}
            />
            <label
              htmlFor="services_intro_text"
              className="font-semibold text-gray-700"
            >
              Services Intro Text
            </label>
            <textarea
              name="services_intro_text"
              id="services_intro_text"
              rows={4}
              defaultValue={initialContent.services_intro_text || ""}
              className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 w-full"
              onBlur={handleBlur}
            />
          </div>
          {serviceFields.map((field, idx) => (
            <div
              key={field.label}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6 mt-4"
            >
              <div className="flex flex-col gap-4">
                <label
                  htmlFor={field.titleKey}
                  className="font-semibold text-gray-700"
                >
                  {field.label} Title
                </label>
                <textarea
                  name={field.titleKey}
                  id={field.titleKey}
                  rows={2}
                  defaultValue={initialContent[field.titleKey] || ""}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onBlur={handleBlur}
                />
                <label
                  htmlFor={field.textKey}
                  className="font-semibold text-gray-700"
                >
                  {field.label} Text
                </label>
                <textarea
                  name={field.textKey}
                  id={field.textKey}
                  rows={3}
                  defaultValue={initialContent[field.textKey] || ""}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onBlur={handleBlur}
                />
              </div>
              <div className="flex flex-col gap-2 items-center justify-center">
                <label
                  className="font-semibold text-gray-700 mb-2"
                  htmlFor={`service-image-upload-${idx}`}
                >
                  {field.label} Image
                  <span className="ml-1 text-xs text-gray-500" role="tooltip">
                    Upload or drag and drop an image for the{" "}
                    {field.label.toLowerCase()}.
                  </span>
                </label>
                <div
                  className="text-sm text-gray-600 h-5"
                  role="status"
                  aria-live="polite"
                >
                  {statusTexts[idx]}
                </div>
                <ImageUploadZone
                  onDrop={handleDrop(idx)}
                  disabled={imageUploading[idx]}
                  uploading={imageUploading[idx]}
                  imageUrl={serviceImageUrls[idx]}
                  label={`${field.label} Image`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}