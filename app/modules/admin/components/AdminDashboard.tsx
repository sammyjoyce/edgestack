import React, { useRef } from "react";
import { useFetcher, useLoaderData } from "react-router";
import { validateErrorResponse } from "../../../database/valibot-validation";
import type { loader } from "../pages/index";
import { Button } from "@components/ui/Button";
import { Container } from "@components/ui/Container";
import { FadeIn } from "@components/ui/FadeIn";
import { SectionIntro } from "@components/ui/SectionIntro";
import { AboutSectionEditor } from "./AboutSectionEditor";
import { ContactSectionEditor } from "./ContactSectionEditor";
import { HeroSectionEditor } from "./HeroSectionEditor";
import { ImageUploadSection } from "./ImageUploadSection";
import SectionSorter from "./SectionSorter";
import { ServicesSectionEditor } from "./ServicesSectionEditor";
import { TextContentForm } from "./TextContentForm";

export default function AdminDashboard() {
  // Get initial content from loader
  const content = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const textFormRef = useRef<HTMLFormElement>(null);
  const imageSectionRef = useRef<HTMLDivElement>(null);

  // Status message handling based on fetcher
  let status: { msg: string; isError: boolean } | null = null;
  if (fetcher.state === "submitting") {
    status = { msg: "Saving...", isError: false };
  } else if (fetcher.data?.success) {
    status = { msg: "Saved successfully!", isError: false };
  } else if (fetcher.data?.error) {
    status = { msg: fetcher.data.error, isError: true };
  }

  // Helper to check if content is an error response using valibot
  const isContentError = (
    obj: any
  ): obj is { error: string; status: number } => {
    try {
      validateErrorResponse(obj);
      return true;
    } catch {
      return false;
    }
  };

  // Access content safely with type guard
  const safeContent = isContentError(content)
    ? ({} as Record<string, string>)
    : (content as Record<string, string>);

  // Handler for Hero image upload
  const [heroUploading, setHeroUploading] = React.useState(false);
  const [heroImageUrl, setHeroImageUrl] = React.useState(
    safeContent.hero_image_url || ""
  );
  const [aboutUploading, setAboutUploading] = React.useState(false);
  const [aboutImageUrl, setAboutImageUrl] = React.useState(
    safeContent.about_image_url || ""
  );
  const [serviceUploading, setServiceUploading] = React.useState([
    false,
    false,
    false,
    false,
  ]);
  const [serviceImageUrls, setServiceImageUrls] = React.useState([
    safeContent.service_1_image || "",
    safeContent.service_2_image || "",
    safeContent.service_3_image || "",
    safeContent.service_4_image || "",
  ]);

  async function handleHeroImageUpload(file: File) {
    setHeroUploading(true);
    const data = new FormData();
    data.append("image", file);
    data.append("key", "hero_image_url");
    await fetcher.submit(data, {
      method: "post",
      action: "/admin/upload",
      encType: "multipart/form-data",
    });
    if (fetcher.data?.url) {
      setHeroImageUrl(fetcher.data.url);
    }
    setHeroUploading(false);
  }

  async function handleAboutImageUpload(file: File) {
    setAboutUploading(true);
    const data = new FormData();
    data.append("image", file);
    data.append("key", "about_image_url");
    await fetcher.submit(data, {
      method: "post",
      action: "/admin/upload",
      encType: "multipart/form-data",
    });
    if (fetcher.data?.url) {
      setAboutImageUrl(fetcher.data.url);
    }
    setAboutUploading(false);
  }

  async function handleServiceImageUpload(idx: number, file: File) {
    setServiceUploading((prev) => prev.map((v, i) => (i === idx ? true : v)));
    const data = new FormData();
    data.append("image", file);
    data.append("key", `service_${idx + 1}_image`);
    await fetcher.submit(data, {
      method: "post",
      action: "/admin/upload",
      encType: "multipart/form-data",
    });
    if (fetcher.data?.url) {
      setServiceImageUrls((prev) =>
        prev.map((url, i) => (i === idx ? fetcher.data.url : url))
      );
    }
    setServiceUploading((prev) => prev.map((v, i) => (i === idx ? false : v)));
  }

  /* ------------------------------------------------- *
   * Section order comes from key "home_sections_order"
   * Persist handled inside SectionSorter via fetcher
   * ------------------------------------------------- */
  const sectionsOrder = safeContent.home_sections_order as string | undefined;

  return (
    <Container>
      <SectionIntro title="Home Editor" className="mb-6" />
      {/* 🔀 Drag-to-reorder CMS sections */}
      <SectionSorter orderValue={sectionsOrder} fetcher={fetcher} />
      {status && (
        <FadeIn>
          <div
            className={`p-2 mb-4 rounded ${
              status.isError
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
            role="status"
            aria-live="polite"
            tabIndex={0}
          >
            {status.msg}
          </div>
        </FadeIn>
      )}
      <section aria-label="Hero Section Editor" role="region" tabIndex={0}>
        <HeroSectionEditor
          fetcher={fetcher}
          initialContent={safeContent}
          onImageUpload={handleHeroImageUpload}
          imageUploading={heroUploading}
          heroImageUrl={heroImageUrl}
        />
      </section>
      <section aria-label="Services Section Editor" role="region" tabIndex={0}>
        <ServicesSectionEditor
          fetcher={fetcher}
          initialContent={safeContent}
          onImageUpload={handleServiceImageUpload}
          imageUploading={serviceUploading}
          serviceImageUrls={serviceImageUrls}
        />
      </section>

      <section aria-label="Recent Projects Editor" role="region" tabIndex={0}>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Projects Section</h2>

          <div className="grid grid-cols-1 gap-4 mt-4">
            <div>
              <label
                htmlFor="projects_intro_title"
                className="block text-sm font-medium text-gray-700"
              >
                Projects Title
              </label>
              <input
                type="text"
                name="projects_intro_title"
                id="projects_intro_title"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                defaultValue={
                  safeContent.projects_intro_title || "Recent Projects"
                }
                onBlur={(e) => {
                  const data = new FormData();
                  data.append("projects_intro_title", e.target.value);
                  fetcher.submit(data, { method: "post" });
                }}
              />
            </div>

            <div>
              <label
                htmlFor="projects_intro_text"
                className="block text-sm font-medium text-gray-700"
              >
                Projects Intro Text
              </label>
              <textarea
                name="projects_intro_text"
                id="projects_intro_text"
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                defaultValue={
                  safeContent.projects_intro_text ||
                  "Take a look at some of our recent work."
                }
                onBlur={(e) => {
                  const data = new FormData();
                  data.append("projects_intro_text", e.target.value);
                  fetcher.submit(data, { method: "post" });
                }}
              />
            </div>
          </div>
          <div className="mb-4 text-gray-700">
            <ul className="list-disc list-inside text-gray-600 mb-2">
              <li>
                To add, edit, or reorder projects, visit the Projects admin
                page.
              </li>
              <li>
                To feature a project on the home page, edit the project and
                enable the <span className="font-semibold">"Featured"</span>{" "}
                option.
              </li>
              <li>
                Project order and details are managed in the Projects admin
                page.
              </li>
            </ul>
          </div>
          <div className="mt-4">
            <Button
              as="a"
              href="/admin/projects"
              className="bg-blue-600 text-white hover:bg-blue-700"
              aria-label="Go to Projects Admin"
            >
              Go to Projects Admin
            </Button>
          </div>
        </div>
      </section>

      <section aria-label="About Section Editor" role="region" tabIndex={0}>
        <AboutSectionEditor
          fetcher={fetcher}
          initialContent={safeContent}
          onImageUpload={handleAboutImageUpload}
          imageUploading={aboutUploading}
          aboutImageUrl={aboutImageUrl}
        />
      </section>

      <section aria-label="Contact Section Editor" role="region" tabIndex={0}>
        <ContactSectionEditor fetcher={fetcher} initialContent={safeContent} />
      </section>
    </Container>
  );
}
