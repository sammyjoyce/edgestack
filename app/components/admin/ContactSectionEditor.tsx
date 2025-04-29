import type React from "react";
import type { FetcherWithComponents } from "react-router";
import RichTextField from "./RichTextField";

interface ContactSectionEditorProps {
  fetcher: FetcherWithComponents<any>;
  initialContent: Record<string, string>;
}

const contactFields = [
  {
    key: "contact_headline",
    label: "Contact Headline",
    rows: 2,
    placeholder: "Ready to Start Your Project?",
  },
  {
    key: "contact_intro",
    label: "Contact Intro",
    rows: 3,
    placeholder: "From concept to completion, we're here...",
  },
  {
    key: "contact_address",
    label: "Address",
    rows: 2,
    placeholder: "PO BOX 821\nMarrickville, NSW 2204",
  },
  {
    key: "contact_phone",
    label: "Phone",
    rows: 1,
    placeholder: "0404 289 437",
  },
  {
    key: "contact_email",
    label: "Email",
    rows: 1,
    placeholder: "contact@lushconstructions.com",
  },
  {
    key: "contact_hours",
    label: "Hours",
    rows: 2,
    placeholder: "Monday - Friday: 7am - 5pm\nSaturday: By appointment",
  },
  { key: "contact_abn", label: "ABN", rows: 1, placeholder: "99 652 947 528" },
  { key: "contact_acn", label: "ACN", rows: 1, placeholder: "141 565 746" },
  {
    key: "contact_license",
    label: "License Number",
    rows: 1,
    placeholder: "4632530",
  },
  {
    key: "contact_instagram",
    label: "Instagram URL",
    rows: 1,
    placeholder: "https://www.instagram.com/lushconstructions",
  },
];

export function ContactSectionEditor({
  fetcher,
  initialContent,
}: ContactSectionEditorProps) {
  function handleBlur(
    e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    const { name, value } = e.target;
    const data = new FormData();
    data.append(name, value);
    fetcher.submit(data, { method: "post" });
  }

  return (
    <section className="bg-white rounded-lg shadow p-6 mb-8 border">
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Contact Section (Home Page)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contactFields.map(({ key, label, rows, placeholder }) => (
          <div className="flex flex-col gap-1" key={key}>
            <label htmlFor={key} className="font-bold text-gray-700">
              {label}
            </label>
            {rows > 1 && key === "contact_intro" ? (
              // Rich text editor for contact_intro using Lexical
              <RichTextField
                name={key}
                initialJSON={initialContent[key]}
                disabled={fetcher.state === "submitting"}
              />
            ) : rows > 1 ? (
              <textarea
                name={key}
                id={key}
                rows={rows}
                defaultValue={initialContent[key] || ""}
                placeholder={placeholder}
                className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                onBlur={handleBlur}
              />
            ) : (
              <input
                type="text"
                name={key}
                id={key}
                defaultValue={initialContent[key] || ""}
                placeholder={placeholder}
                className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                onBlur={handleBlur}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
