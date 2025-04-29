import type React from "react";
import type { FetcherWithComponents } from "react-router";
import ImageUploadZone from "./ImageUploadZone";

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

export function ServicesSectionEditor({
  fetcher,
  initialContent,
  onImageUpload,
  imageUploading,
  serviceImageUrls,
}: ServicesSectionEditorProps) {
  // Dropzone replaces file input for each service

  function handleBlur(e: React.FocusEvent<HTMLTextAreaElement>) {
    const { name, value } = e.target;
    const data = new FormData();
    data.append(name, value);
    fetcher.submit(data, { method: "post" });
  }

  // Dropzone handles file selection and calls onImageUpload
  const handleDrop = (idx: number) => (files: File[]) => {
    if (files && files[0]) {
      onImageUpload(idx, files[0]);
    }
  };

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
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 mb-2 w-full"
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
                  id={`service-image-upload-status-${idx}`}
                  role="status"
                  aria-live="polite"
                  className="sr-only"
                ></div>
                <ImageUploadZone
                  onDrop={(files) => {
                    handleDrop(idx)(files);
                    const status = document.getElementById(
                      `service-image-upload-status-${idx}`
                    );
                    if (status)
                      status.textContent = `Uploading ${field.label} Image...`;
                  }}
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
