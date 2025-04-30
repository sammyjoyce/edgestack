import React from "react"; // Ensure React is imported for JSX
import {
  type FetcherWithComponents,
  useFetcher,
  useLoaderData,
  Link,
} from "react-router";

// Types
// Import the specific loader and action types
import type { loader as adminIndexLoader } from "~/modules/admin/routes/index";
import type { action as adminIndexAction } from "~/modules/admin/routes/index";
import type { action as adminUploadAction } from "~/modules/admin/routes/upload";

// Validation
// import { validateErrorResponse } from "~/database/valibot-validation"; // Not used directly here

// UI primitives
import { Container } from "~/modules/common/components/ui/Container";
import { SectionIntro } from "~/modules/common/components/ui/SectionIntro";
import { FadeIn } from "~/modules/common/components/ui/FadeIn";
import { Button } from "~/modules/common/components/ui/Button";

// Admin components
import SectionSorter from "~/modules/admin/components/SectionSorter";
import { HeroSectionEditor } from "~/modules/admin/components/HeroSectionEditor";
import { ServicesSectionEditor } from "~/modules/admin/components/ServicesSectionEditor";
import { AboutSectionEditor } from "~/modules/admin/components/AboutSectionEditor";
import { ContactSectionEditor } from "~/modules/admin/components/ContactSectionEditor";

// Helper to check if content is an error response using valibot
const isContentError = (
// Removed isContentError helper as it's not used

export default function AdminDashboard(): React.JSX.Element {
  // Use type inference for useLoaderData
  const loaderData = useLoaderData<typeof adminIndexLoader>();
  const content = loaderData?.content; // Access content property

  // Typed fetchers using inferred types
  const heroFetcher = useFetcher<typeof adminIndexAction | typeof adminUploadAction>();
  const introFetcher = useFetcher<typeof adminIndexAction>();
  const servicesFetcher = useFetcher<typeof adminIndexAction | typeof adminUploadAction>();
  const aboutFetcher = useFetcher<typeof adminIndexAction | typeof adminUploadAction>();
  const contactFetcher = useFetcher<typeof adminIndexAction>();
  const sorterFetcher = useFetcher<typeof adminIndexAction>();
  const projectsFetcher = useFetcher<typeof adminIndexAction>();

  // Access content safely, handle null/error case
  const safeContent =
    !content || typeof content !== "object" || "error" in content
      ? ({} as Record<string, string>)
      : content;

  // Handler for Hero image upload
  const [heroUploading, setHeroUploading] = React.useState(false);
  const [heroImageUrl, setHeroImageUrl] = React.useState(
    safeContent.hero_image_url || ""
  );
  const [aboutUploading, setAboutUploading] = React.useState(false);
  const [aboutImageUrl, setAboutImageUrl] = React.useState(
    safeContent.about_image_url || ""
  );
  const [serviceUploading, setServiceUploading] = React.useState<boolean[]>(
    Array(4).fill(false)
  );
  const [serviceImageUrls, setServiceImageUrls] = React.useState([
    safeContent.service_1_image || "",
    safeContent.service_2_image || "",
    safeContent.service_3_image || "",
    safeContent.service_4_image || "",
  ]);

  const uploadImage = React.useCallback(
    async (
      fetcherInstance: ReturnType<typeof useFetcher>,
      key: string,
      file: File,
      setUploading: (v: boolean) => void,
      setUrl: (url: string) => void
    ) => {
      setUploading(true);
      const fd = new FormData();
      fd.append("image", file);
      fd.append("key", key);
      // Use typed action path
      await fetcherInstance.submit(fd, {
        method: "post",
        action: "/admin/upload",
        encType: "multipart/form-data",
      });
      // Use the specific fetcher instance's data with inferred type
      const uploadData = fetcherInstance.data;
      if (uploadData?.success && uploadData.url) {
        setUrl(uploadData.url);
      }
      setUploading(false);
    },
    [] // No dependency on fetcher needed here anymore
  );

  const handleHeroImageUpload = (file: File) =>
    uploadImage(
      heroFetcher,
      "hero_image_url",
      file,
      setHeroUploading,
      setHeroImageUrl
    );

  const handleAboutImageUpload = (file: File) =>
    uploadImage(
      aboutFetcher,
      "about_image_url",
      file,
      setAboutUploading,
      setAboutImageUrl
    );

  const handleServiceImageUpload = (idx: number, file: File) =>
    uploadImage(
      servicesFetcher, // Use servicesFetcher for service images
      `service_${idx + 1}_image`,
      file,
      (v) =>
        setServiceUploading((prev) =>
          prev.map((val, i) => (i === idx ? v : val))
        ),
      (url) =>
        setServiceImageUrls((prev) =>
          prev.map((val, i) => (i === idx ? url : val))
        )
    );

  /* ------------------------------------------------- *
   * Section order comes from key "home_sections_order"
   * Persist handled inside SectionSorter via fetcher
   * ------------------------------------------------- */
  const sectionsOrder = safeContent.home_sections_order as string | undefined;

  return (
    <Container className="space-y-10">
      {" "}
      {/* Add vertical spacing between sections */}
      <SectionIntro title="Home Page Editor" className="mb-8" />{" "}
      {/* Adjusted margin */}
      {/* 🔀 Drag-to-reorder CMS sections */}
      <SectionSorter // <<< HERE
        orderValue={sectionsOrder}
        fetcher={sorterFetcher} // Pass typed fetcher
      />
      {/* Removed the global status block */}
      <section aria-label="Hero Section Editor" role="region" tabIndex={0}>
        <HeroSectionEditor
          fetcher={heroFetcher} // Pass typed fetcher
          initialContent={safeContent}
          onImageUpload={handleHeroImageUpload}
          imageUploading={heroUploading}
          heroImageUrl={heroImageUrl}
        />
      </section>
      <section aria-label="Services Section Editor" role="region" tabIndex={0}>
        <ServicesSectionEditor
          fetcher={servicesFetcher} // Pass typed fetcher
          initialContent={safeContent}
          onImageUpload={handleServiceImageUpload}
          imageUploading={serviceUploading}
          serviceImageUrls={serviceImageUrls}
        />
      </section>
      <section aria-label="Recent Projects Editor" role="region" tabIndex={0}>
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          {" "}
          {/* Adjusted shadow/border */}
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Projects Section
          </h2>{" "}
          {/* Adjusted size/color/margin */}
          <div className="grid grid-cols-1 gap-6 mt-4">
            {" "}
            {/* Increased gap */}
            <div>
              <label
                htmlFor="projects_intro_title"
                className="block text-sm font-medium text-gray-700 mb-1" /* Added margin */
              >
                Projects Intro Title
              </label>
              <input
                type="text"
                name="projects_intro_title"
                id="projects_intro_title"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" /* Use text-sm */
                defaultValue={
                  safeContent.projects_intro_title || "Recent Projects"
                }
                onBlur={(e) => {
                  const formData = new FormData();
                  formData.append("intent", "updateTextContent"); // Add intent
                  formData.append("projects_intro_title", e.target.value);
                  // Use projectsFetcher for project intro fields with typed action
                  projectsFetcher.submit(formData, { method: "post", action: "/admin" });
                }}
              />
            </div>
            <div>
              <label
                htmlFor="projects_intro_text"
                className="block text-sm font-medium text-gray-700 mb-1" /* Added margin */
              >
                Projects Intro Text
              </label>
              <textarea
                name="projects_intro_text"
                id="projects_intro_text"
                rows={3} /* Increased rows */
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" /* Use text-sm */
                defaultValue={
                  safeContent.projects_intro_text ||
                  "Take a look at some of our recent work."
                }
                onBlur={(e) => {
                  const formData = new FormData();
                  formData.append("intent", "updateTextContent"); // Add intent
                  formData.append("projects_intro_text", e.target.value);
                  // Use projectsFetcher for project intro fields with typed action
                  projectsFetcher.submit(formData, { method: "post", action: "/admin" });
                }}
              />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 space-y-1">
            {" "}
            {/* Adjusted margin/size/spacing */}
            <p>
              <strong>Note:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              {" "}
              {/* Added spacing */}
              <li>
                To add, edit, or reorder projects, visit the Projects admin
                page.
              </li>
              <li>
                To feature a project on the home page, edit the project and
                enable the{" "}
                <span className="font-semibold text-gray-700">"Featured"</span>{" "}
                option.
              </li>
              <li>
                Project display order and details are managed in the Projects
                admin page.
              </li>
            </ul>
          </div>
          <div className="mt-6">
            {" "}
            {/* Increased margin */}
            <Button
              as={Link}
              to="/admin/projects"
              className="bg-blue-600 text-white hover:bg-blue-700 text-sm"
              aria-label="Go to Projects Admin"
            >
              Go to Projects Admin
            </Button>
          </div>
        </div>
      </section>
      <section aria-label="About Section Editor" role="region" tabIndex={0}>
        <AboutSectionEditor
          fetcher={aboutFetcher} // Pass typed fetcher
          initialContent={safeContent}
          onImageUpload={handleAboutImageUpload}
          imageUploading={aboutUploading}
          aboutImageUrl={aboutImageUrl}
        />
      </section>
      <section aria-label="Contact Section Editor" role="region" tabIndex={0}>
        <ContactSectionEditor
          fetcher={contactFetcher}
          initialContent={safeContent}
        />
      </section>
    </Container>
  );
}
