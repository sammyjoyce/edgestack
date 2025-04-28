import React, { useRef } from "react";
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

  // One fetcher per field
  const fetchers = imageFields.map(() => useFetcher());

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
                encType="multipart/form-data"
                className="flex flex-col items-center bg-white rounded-lg shadow p-4 gap-2 border"
              >
                <label htmlFor={`${key}_input`} className="font-bold text-gray-700 self-start">{label}</label>
                <input
                  type="file"
                  name="image"
                  id={`${key}_input`}
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
            <input type="file" name="image" id="service_1_image_input" data-key="service_1_image" accept="image/*" className="w-full border rounded p-1" required />
            <input type="hidden" name="key" value="service_1_image" />
            <Button type="submit">
              {service1ImageFetcher.state === "submitting" ? "Uploading..." : "Upload Service 1 Image"}
            </Button>
            <GrayscaleTransitionImage id="service_1_image_preview" src={service1ImageFetcher.data?.url || initialContent.service_1_image || ""} alt="Service 1 Image Preview" className="rounded border mt-2 max-w-full w-48 h-auto object-cover bg-gray-100" />
            {service1ImageFetcher.data?.error && <div className="text-red-600 mt-2">{service1ImageFetcher.data.error}</div>}
          </service1ImageFetcher.Form>
        </FadeIn>
        <FadeIn>
          <service2ImageFetcher.Form method="post" encType="multipart/form-data" className="flex flex-col items-center bg-white rounded-lg shadow p-4 gap-2 border">
            <label htmlFor="service_2_image_input" className="font-bold text-gray-700 self-start">Service 2 Image</label>
            <input type="file" name="image" id="service_2_image_input" data-key="service_2_image" accept="image/*" className="w-full border rounded p-1" required />
            <input type="hidden" name="key" value="service_2_image" />
            <Button type="submit">
              {service2ImageFetcher.state === "submitting" ? "Uploading..." : "Upload Service 2 Image"}
            </Button>
            <GrayscaleTransitionImage id="service_2_image_preview" src={service2ImageFetcher.data?.url || initialContent.service_2_image || ""} alt="Service 2 Image Preview" className="rounded border mt-2 max-w-full w-48 h-auto object-cover bg-gray-100" />
            {service2ImageFetcher.data?.error && <div className="text-red-600 mt-2">{service2ImageFetcher.data.error}</div>}
          </service2ImageFetcher.Form>
        </FadeIn>
        <FadeIn>
          <service3ImageFetcher.Form method="post" encType="multipart/form-data" className="flex flex-col items-center bg-white rounded-lg shadow p-4 gap-2 border">
            <label htmlFor="service_3_image_input" className="font-bold text-gray-700 self-start">Service 3 Image</label>
            <input type="file" name="image" id="service_3_image_input" data-key="service_3_image" accept="image/*" className="w-full border rounded p-1" required />
            <input type="hidden" name="key" value="service_3_image" />
            <Button type="submit">
              {service3ImageFetcher.state === "submitting" ? "Uploading..." : "Upload Service 3 Image"}
            </Button>
            <GrayscaleTransitionImage id="service_3_image_preview" src={service3ImageFetcher.data?.url || initialContent.service_3_image || ""} alt="Service 3 Image Preview" className="rounded border mt-2 max-w-full w-48 h-auto object-cover bg-gray-100" />
            {service3ImageFetcher.data?.error && <div className="text-red-600 mt-2">{service3ImageFetcher.data.error}</div>}
          </service3ImageFetcher.Form>
        </FadeIn>
        <FadeIn>
          <service4ImageFetcher.Form method="post" encType="multipart/form-data" className="flex flex-col items-center bg-white rounded-lg shadow p-4 gap-2 border">
            <label htmlFor="service_4_image_input" className="font-bold text-gray-700 self-start">Service 4 Image</label>
            <input type="file" name="image" id="service_4_image_input" data-key="service_4_image" accept="image/*" className="w-full border rounded p-1" required />
            <input type="hidden" name="key" value="service_4_image" />
            <Button type="submit">
              {service4ImageFetcher.state === "submitting" ? "Uploading..." : "Upload Service 4 Image"}
            </Button>
            <GrayscaleTransitionImage id="service_4_image_preview" src={service4ImageFetcher.data?.url || initialContent.service_4_image || ""} alt="Service 4 Image Preview" className="rounded border mt-2 max-w-full w-48 h-auto object-cover bg-gray-100" />
            {service4ImageFetcher.data?.error && <div className="text-red-600 mt-2">{service4ImageFetcher.data.error}</div>}
          </service4ImageFetcher.Form>
        </FadeIn>
      </div>
      <img id="hero_image_url_preview" src={heroImageFetcher.data?.url || initialContent.hero_image_url || ""} alt="Hero Image Preview" className="rounded border mt-2 max-w-full w-48 h-auto object-cover bg-gray-100" />
      {heroImageFetcher.data?.error && <div className="text-red-600 mt-2">{heroImageFetcher.data.error}</div>}
      <FadeIn>
        <aboutImageFetcher.Form method="post" encType="multipart/form-data" className="flex flex-col items-center bg-white rounded-lg shadow p-4 gap-2 border">
          <label htmlFor="about_image_input" className="font-bold text-gray-700 self-start">About Image</label>
          <input type="file" name="image" id="about_image_input" data-key="about_image_url" accept="image/*" className="w-full border rounded p-1" required />
          <input type="hidden" name="key" value="about_image_url" />
          <Button type="submit">
          {aboutImageFetcher.state === "submitting" ? "Uploading..." : "Upload About Image"}
        </Button>
          <img id="about_image_url_preview" src={aboutImageFetcher.data?.url || initialContent.about_image_url || ""} alt="About Image Preview" className="rounded border mt-2 max-w-full w-48 h-auto object-cover bg-gray-100" />
          {aboutImageFetcher.data?.error && <div className="text-red-600 mt-2">{aboutImageFetcher.data.error}</div>}
        </aboutImageFetcher.Form>
      </FadeIn>
      <h3 className="text-lg font-semibold text-gray-700 mt-8 mb-4">Service Images</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Service 1 Image */}
        <service1ImageFetcher.Form method="post" encType="multipart/form-data" className="flex flex-col items-center bg-white rounded-lg shadow p-4 gap-2 border">
          <label htmlFor="service_1_image_input" className="font-bold text-gray-700 self-start">Service 1 Image</label>
          <input type="file" name="image" id="service_1_image_input" data-key="service_1_image" accept="image/*" className="w-full border rounded p-1" required />
          <input type="hidden" name="key" value="service_1_image" />
          <button type="submit" className="bg-blue-600 text-white font-semibold py-1 px-4 rounded hover:bg-blue-700 transition">
            {service1ImageFetcher.state === "submitting" ? "Uploading..." : "Upload Service 1 Image"}
          </button>
          <img id="service_1_image_preview" src={service1ImageFetcher.data?.url || initialContent.service_1_image || ""} alt="Service 1 Image Preview" className="rounded border mt-2 max-w-full w-48 h-auto object-cover bg-gray-100" />
          {service1ImageFetcher.data?.error && <div className="text-red-600 mt-2">{service1ImageFetcher.data.error}</div>}
        </service1ImageFetcher.Form>
        {/* Service 2 Image */}
        <service2ImageFetcher.Form method="post" encType="multipart/form-data" className="flex flex-col items-center bg-white rounded-lg shadow p-4 gap-2 border">
          <label htmlFor="service_2_image_input" className="font-bold text-gray-700 self-start">Service 2 Image</label>
          <input type="file" name="image" id="service_2_image_input" data-key="service_2_image" accept="image/*" className="w-full border rounded p-1" required />
          <input type="hidden" name="key" value="service_2_image" />
          <button type="submit" className="bg-blue-600 text-white font-semibold py-1 px-4 rounded hover:bg-blue-700 transition">
            {service2ImageFetcher.state === "submitting" ? "Uploading..." : "Upload Service 2 Image"}
          </button>
          <img id="service_2_image_preview" src={service2ImageFetcher.data?.url || initialContent.service_2_image || ""} alt="Service 2 Image Preview" className="rounded border mt-2 max-w-full w-48 h-auto object-cover bg-gray-100" />
          {service2ImageFetcher.data?.error && <div className="text-red-600 mt-2">{service2ImageFetcher.data.error}</div>}
        </service2ImageFetcher.Form>
        {/* Service 3 Image */}
        <service3ImageFetcher.Form method="post" encType="multipart/form-data" className="flex flex-col items-center bg-white rounded-lg shadow p-4 gap-2 border">
          <label htmlFor="service_3_image_input" className="font-bold text-gray-700 self-start">Service 3 Image</label>
          <input type="file" name="image" id="service_3_image_input" data-key="service_3_image" accept="image/*" className="w-full border rounded p-1" required />
          <input type="hidden" name="key" value="service_3_image" />
          <button type="submit" className="bg-blue-600 text-white font-semibold py-1 px-4 rounded hover:bg-blue-700 transition">
            {service3ImageFetcher.state === "submitting" ? "Uploading..." : "Upload Service 3 Image"}
          </button>
          <img id="service_3_image_preview" src={service3ImageFetcher.data?.url || initialContent.service_3_image || ""} alt="Service 3 Image Preview" className="rounded border mt-2 max-w-full w-48 h-auto object-cover bg-gray-100" />
          {service3ImageFetcher.data?.error && <div className="text-red-600 mt-2">{service3ImageFetcher.data.error}</div>}
        </service3ImageFetcher.Form>
        {/* Service 4 Image */}
        <service4ImageFetcher.Form method="post" encType="multipart/form-data" className="flex flex-col items-center bg-white rounded-lg shadow p-4 gap-2 border">
          <label htmlFor="service_4_image_input" className="font-bold text-gray-700 self-start">Service 4 Image</label>
          <input type="file" name="image" id="service_4_image_input" data-key="service_4_image" accept="image/*" className="w-full border rounded p-1" required />
          <input type="hidden" name="key" value="service_4_image" />
          <button type="submit" className="bg-blue-600 text-white font-semibold py-1 px-4 rounded hover:bg-blue-700 transition">
            {service4ImageFetcher.state === "submitting" ? "Uploading..." : "Upload Service 4 Image"}
          </button>
          <img id="service_4_image_preview" src={service4ImageFetcher.data?.url || initialContent.service_4_image || ""} alt="Service 4 Image Preview" className="rounded border mt-2 max-w-full w-48 h-auto object-cover bg-gray-100" />
          {service4ImageFetcher.data?.error && <div className="text-red-600 mt-2">{service4ImageFetcher.data.error}</div>}
        </service4ImageFetcher.Form>
      </div>
    </section>
  );
}
