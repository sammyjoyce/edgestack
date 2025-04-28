import React, { useRef } from "react";
import type { FetcherWithComponents } from "react-router";

export interface TextContentFormProps {
  fetcher: FetcherWithComponents<any>;
  initialContent: Record<string, string>;
  formRef?: React.RefObject<HTMLFormElement>;
}

export function TextContentForm({ fetcher, initialContent, formRef }: TextContentFormProps) {
  const localFormRef = useRef<HTMLFormElement>(null);
  const ref = formRef || localFormRef;

  // Config array for text fields
  const textFields = [
    { key: 'hero_title', label: 'Hero Title', rows: 2 },
    { key: 'hero_subtitle', label: 'Hero Subtitle', rows: 3 },
    { key: 'about_title', label: 'About Title', rows: 2 },
    { key: 'about_text', label: 'About Text', rows: 5 },
    { key: 'services_intro_title', label: 'Services Intro Title', rows: 2 },
    { key: 'services_intro_text', label: 'Services Intro Text', rows: 4 },
    { key: 'service_1_title', label: 'Service 1 Title', rows: 2 },
    { key: 'service_1_text', label: 'Service 1 Text', rows: 3 },
    { key: 'service_2_title', label: 'Service 2 Title', rows: 2 },
    { key: 'service_2_text', label: 'Service 2 Text', rows: 3 },
    // Add more fields as needed
  ];

  // Handler for auto-save on blur
  function handleBlur(e: React.FocusEvent<HTMLTextAreaElement>) {
    const form = e.target.form;
    if (form) {
      const data = new FormData(form);
      fetcher.submit(data, { method: 'post' });
    }
  }

  return (
    <fetcher.Form
      id="text-content-form"
      ref={ref}
      method="post"
      className="flex flex-col gap-6 bg-gray-50 rounded-lg shadow p-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Text Content</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {textFields.map(({ key, label, rows }) => (
          <div className="flex flex-col gap-1" key={key}>
            <label htmlFor={key} className="font-bold text-gray-700">{label}</label>
            <textarea
              name={key}
              id={key}
              data-key={key}
              rows={rows}
              defaultValue={initialContent[key] || ""}
              className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              onBlur={handleBlur}
            />
          </div>
        ))}
      </div>
    </fetcher.Form>
  );
}
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
