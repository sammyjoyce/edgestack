import React, { useState, useEffect, useRef, useCallback } from "react";
import { useFetcher, type FetcherWithComponents } from "react-router";
import { SectionIntro } from "~/modules/common/components/ui/SectionIntro";
import { FadeIn } from "~/modules/common/components/ui/FadeIn";
// Import the specific action type
import type { action as adminUploadAction } from "~/modules/admin/routes/upload";
import ImageUploadZone from "~/modules/admin/components/ImageUploadZone";
import { Button } from "~/modules/common/components/ui/Button";
import { GrayscaleTransitionImage } from "~/modules/common/components/ui/GrayscaleTransitionImage";

const imageFields = [
  { key: "hero_image_url", label: "Hero Image" },
  { key: "about_image_url", label: "About Image" },
  { key: "service_1_image", label: "Service 1 Image" },
  { key: "service_2_image", label: "Service 2 Image" },
  { key: "service_3_image", label: "Service 3 Image" },
  { key: "service_4_image", label: "Service 4 Image" },
];

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

  // Status text for each upload (mirrors imageFields order)
  const [statusTexts, setStatusTexts] = useState<string[]>(
    Array(imageFields.length).fill("")
  );

  // One fetcher per field, typed with inferred action type
  const fetchers = imageFields.map(() => useFetcher<typeof adminUploadAction>());
  // Create refs for each file input
  const fileInputRefs = imageFields.map(() => useRef<HTMLInputElement>(null));

  // Type the fetcher argument with inferred action type
  const makeDropHandler = useCallback(
    (
        idx: number,
        fetcher: FetcherWithComponents<typeof adminUploadAction>,
        key: string,
        label: string
      ) =>
      (files: File[]) => {
        const [file] = files;
        if (!file) return;

        const formData = new FormData();
        formData.append("intent", "uploadImage"); // Add intent
        formData.append("image", file);
        formData.append("key", key);

        // Use typed action path for the upload route
        fetcher.submit(formData, {
          method: "post",
          action: "/admin/upload",
          encType: "multipart/form-data",
        });

        setStatusTexts((prev) => {
          const next = [...prev];
          next[idx] = `Uploading ${label}…`;
          return next;
        });
      },
    []
  );

  // Effect to clear file input on successful upload
  useEffect(() => {
    fetchers.forEach((fetcher, idx) => {
      if (fetcher.state === "idle" && fetcher.data) {
        // Check fetcher.data structure based on AdminActionResponse
        if ("success" in fetcher.data && fetcher.data.success) {
          const inputRef = fileInputRefs[idx].current;
          if (inputRef) {
            inputRef.value = "";
          }
          setStatusTexts((prev) => {
            const next = [...prev];
            next[idx] = `${imageFields[idx].label} uploaded successfully!`;
            return next;
          });
        } else if (
          fetcher.data &&
          typeof fetcher.data === "object" &&
          fetcher.data &&
          typeof fetcher.data === "object" &&
          "error" in fetcher.data
        ) {
          // Handle error response with inferred type
          const errorData = fetcher.data;
          setStatusTexts((prev) => {
            const next = [...prev];
            // Use optional chaining and provide a default message
            next[idx] = errorData?.error ?? "Upload failed";
            return next;
          });
        }
      }
    });
  }, [fetchers]);

  return (
    <section
      id="image-uploads"
      ref={ref}
      className="bg-gray-50 rounded-lg shadow p-6 mt-8"
      aria-labelledby="image-uploads-heading"
    >
      <SectionIntro title="Image Uploads" className="mb-4" />
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
                  onDrop={makeDropHandler(idx, fetcher, key, label)}
                  disabled={fetcher.state === "submitting"}
                  uploading={fetcher.state === "submitting"}
                  imageUrl={fetcher.data?.url || initialContent[key] || ""}
                  label={label}
                  className="w-full" // Ensure zone takes width
                />
                <input type="hidden" name="key" value={key} />
                {/* Removed the redundant submit button */}
                {/* <Button type="submit" aria-label={`Upload ${label}`} onClick={() =>
                    setStatusTexts((prev) => {
                      const next = [...prev];
                      next[idx] = `Uploading ${label}…`;
                      return next;
                    })
                  }
                >
                  {fetcher.state === "submitting"
                    ? `Uploading...`
                    : `Upload ${label}` // Button removed
                </Button> */}
                <div
                  className="text-sm text-gray-600 h-5 mt-2" // Add margin top
                  role="status"
                  aria-live="polite"
                >
                  {statusTexts[idx]}
                </div>
                {/* Use fetcher.data with inferred type */}
                <GrayscaleTransitionImage
                  id={`${key}_preview`}
                  src={
                    (fetcher.data?.success ? fetcher.data.url : undefined) ||
                    initialContent[key] ||
                    ""
                  }
                  alt={`${label} Preview`}
                  className="rounded border border-gray-200 mt-2 max-w-full w-48 h-auto object-cover bg-gray-100" // Added border color
                />
                {/* Removed redundant image display, GrayscaleTransitionImage handles preview */}
                {fetcher.data?.error && (
                  <div className="text-red-600 mt-2 text-xs" role="alert">
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
