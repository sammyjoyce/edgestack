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
    const { name, value } = e.target;
    const data = new FormData();
    data.append(name, value);
    fetcher.submit(data, { method: 'post' });
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
