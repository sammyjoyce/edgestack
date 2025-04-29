import React from "react"; // Ensure React is imported for JSX
import {
  type FetcherWithComponents,
  useFetcher,
  useLoaderData,
  Link, // Import Link
} from "react-router";

// Types
import type { loader } from "~/modules/admin/route";

// Validation
import { validateErrorResponse } from "~/database/valibot-validation";

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
import type { action } from "~/modules/admin/pages";

// Helper to check if content is an error response using valibot
const isContentError = (obj: any): obj is { error: string; status: number } => {
  try {
    validateErrorResponse(obj);
    return true;
  } catch {
    return false;
  }
};

export default function AdminDashboard(): React.JSX.Element { // Changed to React.JSX.Element
  // Get initial content from loader
  const content = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  // Status message handling based on fetcher
  const status = React.useMemo(() => {
    if (fetcher.state === "submitting") {
      return { msg: "Saving...", isError: false };
    }
    // Add type guards for fetcher.data properties
    if (fetcher.data && "success" in fetcher.data && fetcher.data.success) {
      return { msg: "Saved successfully!", isError: false };
    }
    if (fetcher.data && "error" in fetcher.data && fetcher.data.error) {
      return { msg: fetcher.data.error, isError: true };
    }
    return null;
  }, [fetcher.state, fetcher.data]);

  // Access content safely with type guard, handle null case
  const safeContent = !content || isContentError(content)
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
      key: string,
      file: File,
      setUploading: (v: boolean) => void,
      setUrl: (url: string) => void
    ) => {
      setUploading(true);
      const data = new FormData();
      data.append("image", file);
      data.append("key", key);
      await fetcher.submit(data, {
        method: "post",
        action: "/admin/upload",
        encType: "multipart/form-data",
      });
      // Add type guard for fetcher.data.url
      if (fetcher.data && "url" in fetcher.data && typeof fetcher.data.url === 'string') {
        setUrl(fetcher.data.url);
      }
      setUploading(false);
    },
    [fetcher]
  );

  const handleHeroImageUpload = (file: File) =>
    uploadImage("hero_image_url", file, setHeroUploading, setHeroImageUrl);

  const handleAboutImageUpload = (file: File) =>
    uploadImage("about_image_url", file, setAboutUploading, setAboutImageUrl);

  const handleServiceImageUpload = (idx: number, file: File) =>
    uploadImage(
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
      <SectionSorter orderValue={sectionsOrder} fetcher={fetcher as FetcherWithComponents<any>} /> {/* Cast fetcher type */}
      {status && (
        <FadeIn>
          <div
            className={`p-3 mb-6 rounded text-sm border ${
              /* Adjusted padding/margin/size/border */
              status.isError
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-green-50 text-green-700 border-green-200"
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
          fetcher={fetcher as FetcherWithComponents<any>} {/* Cast fetcher type */}
          initialContent={safeContent}
          onImageUpload={handleHeroImageUpload}
          imageUploading={heroUploading}
          heroImageUrl={heroImageUrl}
        />
      </section>
      <section aria-label="Services Section Editor" role="region" tabIndex={0}>
        <ServicesSectionEditor
          fetcher={fetcher as FetcherWithComponents<any>} {/* Cast fetcher type */}
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
                  const data = new FormData();
                  data.append("projects_intro_title", e.target.value);
                  fetcher.submit(data, { method: "post" });
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
                  const data = new FormData();
                  data.append("projects_intro_text", e.target.value);
                  fetcher.submit(data, { method: "post" });
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
              as={Link} /* Use Link component */
              to="/admin/projects" /* Use 'to' prop */
              className="bg-blue-600 text-white hover:bg-blue-700 text-sm" /* Explicit style, text-sm */
              aria-label="Go to Projects Admin"
            >
              Go to Projects Admin
            </Button>
          </div>
        </div>
      </section>
      <section aria-label="About Section Editor" role="region" tabIndex={0}>
        <AboutSectionEditor
          fetcher={fetcher as FetcherWithComponents<any>} {/* Cast fetcher type */}
          initialContent={safeContent}
          onImageUpload={handleAboutImageUpload}
          imageUploading={aboutUploading}
          aboutImageUrl={aboutImageUrl}
        />
      </section>
      <section aria-label="Contact Section Editor" role="region" tabIndex={0}>
        <ContactSectionEditor fetcher={fetcher as FetcherWithComponents<any>} initialContent={safeContent} /> {/* Cast fetcher type */}
      </section>
    </Container>
  );
}
