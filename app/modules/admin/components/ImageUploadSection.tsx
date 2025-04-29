import type React from "react";
import { useEffect, useRef } from "react";
import { useFetcher } from "react-router";
import { Button } from "../../../components/ui/Button";
import { Container } from "../../../components/ui/Container";
import { FadeIn } from "../../../components/ui/FadeIn";
import { GrayscaleTransitionImage } from "../ui/GrayscaleTransitionImage";
import { SectionIntro } from "../../../components/ui/SectionIntro";
import ImageUploadZone from "./ImageUploadZone";

interface ImageUploadSectionProps {
  initialContent: Record<string, string>;
  sectionRef?: React.RefObject<HTMLDivElement>;
}

export function ImageUploadSection({
  initialContent,
  sectionRef,
}: ImageUploadSectionProps) {
  const localRef = useRef<HTMLDivElement>(null);
  const ref = sectionRef || localRef;

  // Config array for image fields
  const imageFields = [
    { key: "hero_image_url", label: "Hero Image" },
    { key: "about_image_url", label: "About Image" },
    { key: "service_1_image", label: "Service 1 Image" },
    { key: "service_2_image", label: "Service 2 Image" },
    { key: "service_3_image", label: "Service 3 Image" },
    { key: "service_4_image", label: "Service 4 Image" },
  ];

  // One fetcher per field
  const fetchers = imageFields.map(() => useFetcher());
  // Create refs for each file input
  const fileInputRefs = imageFields.map(() => useRef<HTMLInputElement>(null));

  // Effect to clear file input on successful upload
  useEffect(() => {
    fetchers.forEach((fetcher, idx) => {
      if (fetcher.state === "idle" && fetcher.data?.success) {
        const inputRef = fileInputRefs[idx];
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    });
    // Depend on fetcher states and data to re-run the effect
  }, [fetchers, fileInputRefs]);

  return (
    <section
      id="image-uploads"
      ref={ref}
      className="bg-gray-50 rounded-lg shadow p-6 mt-8"
      aria-labelledby="image-uploads-heading"
    >
      <SectionIntro title="Image Uploads" className="mb-4" />
      <div
        id="image-upload-status"
        role="status"
        aria-live="polite"
        className="sr-only"
      ></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {imageFields.map(({ key, label }, idx) => {
          const fetcher = fetchers[idx];
          return (
            <FadeIn key={key}>
              <fetcher.Form
                method="post"
                action="/admin/upload"
                encType="multipart/form-data"
                className="flex flex-col items-center bg-white rounded-lg shadow p-4 gap-2 border"
                aria-describedby={`help-${key}`}
              >
                <label
                  htmlFor={`${key}_input`}
                  className="font-bold text-gray-700 self-start"
                >
                  {label}
                  <span
                    id={`help-${key}`}
                    className="ml-1 text-xs text-gray-500"
                    role="tooltip"
                  >
                    Upload or drag and drop an image for the{" "}
                    {label.toLowerCase()}.
                  </span>
                </label>
                <ImageUploadZone
                  fileInputRef={
                    fileInputRefs[idx] as React.RefObject<HTMLInputElement>
                  }
                  onDrop={(files: File[]) => {
                    if (files && files[0]) {
                      const dataTransfer = new DataTransfer();
                      dataTransfer.items.add(files[0]);
                      const event = {
                        target: { files: dataTransfer.files, name: "image" },
                      };
                      fetcher.submit(
                        (() => {
                          const formData = new FormData();
                          formData.append("image", files[0]);
                          formData.append("key", key);
                          return formData;
                        })(),
                        {
                          method: "post",
                          action: "/admin/upload",
                          encType: "multipart/form-data",
                        }
                      );
                      // Announce status for screen readers
                      const status = document.getElementById(
                        "image-upload-status"
                      );
                      if (status) status.textContent = `Uploading ${label}...`;
                    }
                  }}
                  disabled={fetcher.state === "submitting"}
                  uploading={fetcher.state === "submitting"}
                  imageUrl={fetcher.data?.url || initialContent[key] || ""}
                  label={label}
                />
                <input type="hidden" name="key" value={key} />
                <Button
                  type="submit"
                  aria-label={`Upload ${label}`}
                  onClick={() => {
                    const status = document.getElementById(
                      "image-upload-status"
                    );
                    if (status) status.textContent = `Uploading ${label}...`;
                  }}
                >
                  {fetcher.state === "submitting"
                    ? `Uploading...`
                    : `Upload ${label}`}
                </Button>
                <GrayscaleTransitionImage
                  id={`${key}_preview`}
                  src={fetcher.data?.url || initialContent[key] || ""}
                  alt={`${label} Preview`}
                  className="rounded border mt-2 max-w-full w-48 h-auto object-cover bg-gray-100"
                />
                {fetcher.data?.error && (
                  <div className="text-red-600 mt-2" role="alert">
                    {fetcher.data.error}
                  </div>
                )}
              </fetcher.Form>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
