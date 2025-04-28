import React, { useRef, useEffect } from "react"; // Import useEffect
import { useFetcher } from "react-router";
import { Button } from "../ui/Button";
import { GrayscaleTransitionImage } from "../ui/GrayscaleTransitionImage";
import { SectionIntro } from "../ui/SectionIntro";
import { FadeIn } from "../ui/FadeIn";
import { Container } from "../ui/Container";

export interface ImageUploadSectionProps {
  initialContent: Record<string, string>;
  sectionRef?: React.RefObject<HTMLDivElement>;
}

export function ImageUploadSection({ initialContent, sectionRef }: ImageUploadSectionProps) {
  const localRef = useRef<HTMLDivElement>(null);
  const ref = sectionRef || localRef;

  // Config array for image fields
  const imageFields = [
    { key: 'hero_image_url', label: 'Hero Image' },
    { key: 'about_image_url', label: 'About Image' },
    { key: 'service_1_image', label: 'Service 1 Image' },
    { key: 'service_2_image', label: 'Service 2 Image' },
    { key: 'service_3_image', label: 'Service 3 Image' },
    { key: 'service_4_image', label: 'Service 4 Image' },
  ];

  // One fetcher per field and refs for file inputs
  const fetchers = imageFields.map(() => useFetcher());
  const fileInputRefs = imageFields.map(() => useRef<HTMLInputElement>(null));

  // Effect to clear file input on successful upload
  useEffect(() => {
    fetchers.forEach((fetcher, idx) => {
      if (fetcher.state === 'idle' && fetcher.data?.success) {
        const inputRef = fileInputRefs[idx];
        if (inputRef.current) {
          inputRef.current.value = ''; // Clear the file input
        }
        // TODO: Consider adding revalidation logic here if needed
        // Example: revalidate(); // If using useRevalidator hook from parent
      }
    });
    // Depend on fetcher states and data to re-run the effect
  }, [fetchers, fileInputRefs]); // Add fileInputRefs to dependency array

  return (
    <section id="image-uploads" ref={ref} className="bg-gray-50 rounded-lg shadow p-6 mt-8">
      <SectionIntro title="Image Uploads" className="mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {imageFields.map(({ key, label }, idx) => {
          const fetcher = fetchers[idx];
          return (
            <FadeIn key={key}>
              <fetcher.Form
                method="post"
                action="/admin/upload" // Point to the correct upload action route
                encType="multipart/form-data"
                className="flex flex-col items-center bg-white rounded-lg shadow p-4 gap-2 border"
              >
                <label htmlFor={`${key}_input`} className="font-bold text-gray-700 self-start">{label}</label>
                <input
                  type="file"
                  name="image"
                  id={`${key}_input`}
                  ref={fileInputRefs[idx]} // Assign ref to the input
                  data-key={key}
                  accept="image/*"
                  className="w-full border rounded p-1"
                  required
                />
                <input type="hidden" name="key" value={key} />
                <Button type="submit">
                  {fetcher.state === "submitting" ? `Uploading...` : `Upload ${label}`}
                </Button>
                <GrayscaleTransitionImage
                  id={`${key}_preview`}
                  src={fetcher.data?.url || initialContent[key] || ""}
                  alt={`${label} Preview`}
                  className="rounded border mt-2 max-w-full w-48 h-auto object-cover bg-gray-100"
                />
                {fetcher.data?.error && <div className="text-red-600 mt-2">{fetcher.data.error}</div>}
              </fetcher.Form>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
