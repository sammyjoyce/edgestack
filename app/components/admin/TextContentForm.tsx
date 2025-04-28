import React, { useRef } from "react";
import type { FetcherWithComponents } from "react-router";

export interface TextContentFormProps {
  fetcher: FetcherWithComponents<any>;
  initialContent: Record<string, string>;
  formRef?: React.RefObject<HTMLFormElement>;
}

export function TextContentForm({ fetcher, initialContent, formRef }: TextContentFormProps) {
  // Local refs for textareas
  const localFormRef = useRef<HTMLFormElement>(null);
  const ref = formRef || localFormRef;

  return (
    <fetcher.Form
      id="text-content-form"
      ref={ref}
      method="post"
      className="flex flex-col gap-6 bg-gray-50 rounded-lg shadow p-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Text Content</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="hero_title" className="font-bold text-gray-700">Hero Title</label>
          <textarea name="hero_title" id="hero_title" data-key="hero_title" rows={2} defaultValue={initialContent.hero_title || ""} className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="hero_subtitle" className="font-bold text-gray-700">Hero Subtitle</label>
          <textarea name="hero_subtitle" id="hero_subtitle" data-key="hero_subtitle" rows={3} defaultValue={initialContent.hero_subtitle || ""} className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="about_title" className="font-bold text-gray-700">About Title</label>
          <textarea name="about_title" id="about_title" data-key="about_title" rows={2} defaultValue={initialContent.about_title || ""} className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="about_text" className="font-bold text-gray-700">About Text</label>
          <textarea name="about_text" id="about_text" data-key="about_text" rows={5} defaultValue={initialContent.about_text || ""} className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="services_intro_title" className="font-bold text-gray-700">Services Intro Title</label>
          <textarea name="services_intro_title" id="services_intro_title" data-key="services_intro_title" rows={2} defaultValue={initialContent.services_intro_title || ""} className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="services_intro_text" className="font-bold text-gray-700">Services Intro Text</label>
          <textarea name="services_intro_text" id="services_intro_text" data-key="services_intro_text" rows={4} defaultValue={initialContent.services_intro_text || ""} className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="service_1_title" className="font-bold text-gray-700">Service 1 Title</label>
          <textarea name="service_1_title" id="service_1_title" data-key="service_1_title" rows={2} defaultValue={initialContent.service_1_title || ""} className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="service_1_text" className="font-bold text-gray-700">Service 1 Text</label>
          <textarea id="service_1_text" data-key="service_1_text" rows={3} defaultValue={initialContent.service_1_text || ""} className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="service_2_title" className="font-bold text-gray-700">Service 2 Title</label>
          <textarea id="service_2_title" data-key="service_2_title" rows={2} defaultValue={initialContent.service_2_title || ""} className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="service_2_text" className="font-bold text-gray-700">Service 2 Text</label>
          <textarea name="service_2_text" id="service_2_text" data-key="service_2_text" rows={3} defaultValue={initialContent.service_2_text || ""} className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="projects_intro_title" className="font-bold text-gray-700">Projects Intro Title</label>
          <textarea name="projects_intro_title" id="projects_intro_title" data-key="projects_intro_title" rows={2} defaultValue={initialContent.projects_intro_title || ""} className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="projects_intro_text" className="font-bold text-gray-700">Projects Intro Text</label>
          <textarea name="projects_intro_text" id="projects_intro_text" data-key="projects_intro_text" rows={4} defaultValue={initialContent.projects_intro_text || ""} className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
        </div>
      </div>
      {/* Hidden textareas for image URLs */}
      <textarea name="hero_image_url" id="hero_image_url" data-key="hero_image_url" style={{ display: "none" }} defaultValue={initialContent.hero_image_url || ""} />
      <textarea name="about_image_url" id="about_image_url" data-key="about_image_url" style={{ display: "none" }} defaultValue={initialContent.about_image_url || ""} />
      <textarea name="service_1_image" id="service_1_image" data-key="service_1_image" style={{ display: "none" }} defaultValue={initialContent.service_1_image || ""} />
      <textarea name="service_2_image" id="service_2_image" data-key="service_2_image" style={{ display: "none" }} defaultValue={initialContent.service_2_image || ""} />
      <textarea name="service_3_image" id="service_3_image" data-key="service_3_image" style={{ display: "none" }} defaultValue={initialContent.service_3_image || ""} />
      <textarea name="service_4_image" id="service_4_image" data-key="service_4_image" style={{ display: "none" }} defaultValue={initialContent.service_4_image || ""} />
      <button
        type="submit"
        className="mt-4 bg-blue-600 text-white font-bold py-2 px-6 rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      >
        Save Text Content
      </button>
    </fetcher.Form>
  );
}
