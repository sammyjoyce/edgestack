import React, { useRef } from "react";
import { useLoaderData, useFetcher } from "react-router";
import { TextContentForm } from "./TextContentForm";
import { ImageUploadSection } from "./ImageUploadSection";
import { HeroSectionEditor } from "./HeroSectionEditor";
import { AboutSectionEditor } from "./AboutSectionEditor";
import { ServicesSectionEditor } from "./ServicesSectionEditor";
import { Container } from "../ui/Container";
import { SectionIntro } from "../ui/SectionIntro";
import { FadeIn } from "../ui/FadeIn";
import { Button } from "../ui/Button";
import type { loader } from "../../routes/admin.index";

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

  // Handler for Hero image upload
  const [heroUploading, setHeroUploading] = React.useState(false);
  const [heroImageUrl, setHeroImageUrl] = React.useState(content.hero_image_url || "");
  const [aboutUploading, setAboutUploading] = React.useState(false);
  const [aboutImageUrl, setAboutImageUrl] = React.useState(content.about_image_url || "");
  const [serviceUploading, setServiceUploading] = React.useState([false, false, false, false]);
  const [serviceImageUrls, setServiceImageUrls] = React.useState([
    content.service_1_image || "",
    content.service_2_image || "",
    content.service_3_image || "",
    content.service_4_image || "",
  ]);

  async function handleHeroImageUpload(file: File) {
    setHeroUploading(true);
    const data = new FormData();
    data.append("image", file);
    data.append("key", "hero_image_url");
    await fetcher.submit(data, { method: "post", action: "/admin/upload", encType: "multipart/form-data" });
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
    await fetcher.submit(data, { method: "post", action: "/admin/upload", encType: "multipart/form-data" });
    if (fetcher.data?.url) {
      setAboutImageUrl(fetcher.data.url);
    }
    setAboutUploading(false);
  }

  async function handleServiceImageUpload(idx: number, file: File) {
    setServiceUploading(prev => prev.map((v, i) => (i === idx ? true : v)));
    const data = new FormData();
    data.append("image", file);
    data.append("key", `service_${idx + 1}_image`);
    await fetcher.submit(data, { method: "post", action: "/admin/upload", encType: "multipart/form-data" });
    if (fetcher.data?.url) {
      setServiceImageUrls(prev => prev.map((url, i) => (i === idx ? fetcher.data.url : url)));
    }
    setServiceUploading(prev => prev.map((v, i) => (i === idx ? false : v)));
  }

  return (
    <Container>
      <SectionIntro title="Home Editor" className="mb-6" />
      {status && (
        <FadeIn>
          <div className={`p-2 mb-4 rounded ${status.isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {status.msg}
          </div>
        </FadeIn>
      )}
      <HeroSectionEditor
        fetcher={fetcher}
        initialContent={content}
        onImageUpload={handleHeroImageUpload}
        imageUploading={heroUploading}
        heroImageUrl={heroImageUrl}
      />
      <ServicesSectionEditor
        fetcher={fetcher}
        initialContent={content}
        onImageUpload={handleServiceImageUpload}
        imageUploading={serviceUploading}
        serviceImageUrls={serviceImageUrls}
      />

      {/* Home Page Projects Section Editor */}
      <section className="bg-white rounded-lg shadow p-6 mb-8 border">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Projects Section (Home Page)</h2>
        <div className="mb-4">
          <label htmlFor="projects_intro_title" className="block font-bold text-gray-700 mb-1">Projects Section Title</label>
          <textarea
            id="projects_intro_title"
            name="projects_intro_title"
            rows={2}
            defaultValue={content.projects_intro_title || "Recent Projects"}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white mb-2"
            onBlur={e => {
              const data = new FormData();
              data.append("projects_intro_title", e.target.value);
              fetcher.submit(data, { method: "post" });
            }}
          />
          <label htmlFor="projects_intro_text" className="block font-bold text-gray-700 mb-1">Projects Section Intro Text</label>
          <textarea
            id="projects_intro_text"
            name="projects_intro_text"
            rows={3}
            defaultValue={content.projects_intro_text || "Take a look at some of our recent work."}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            onBlur={e => {
              const data = new FormData();
              data.append("projects_intro_text", e.target.value);
              fetcher.submit(data, { method: "post" });
            }}
          />
        </div>
        <div className="mb-4 text-gray-700">
          <ul className="list-disc list-inside text-gray-600 mb-2">
            <li>To add, edit, or reorder projects, visit the Projects admin page.</li>
            <li>To feature a project on the home page, edit the project and enable the <span className="font-semibold">"Featured"</span> option.</li>
            <li>Project order and details are managed in the Projects admin page.</li>
          </ul>
        </div>
        <div className="mt-4">
          <Button as="a" href="/admin/projects" className="bg-blue-600 text-white hover:bg-blue-700">Go to Projects Admin</Button>
        </div>
      </section>

      <AboutSectionEditor
        fetcher={fetcher}
        initialContent={content}
        onImageUpload={handleAboutImageUpload}
        imageUploading={aboutUploading}
        aboutImageUrl={aboutImageUrl}
      />

    </Container>
  );
}
