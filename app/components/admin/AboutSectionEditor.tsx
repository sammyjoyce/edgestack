import React, { useRef } from "react";
import type { FetcherWithComponents } from "react-router";

interface AboutSectionEditorProps {
  fetcher: FetcherWithComponents<any>;
  initialContent: Record<string, string>;
  onImageUpload: (file: File) => void;
  imageUploading: boolean;
  aboutImageUrl?: string;
}

export function AboutSectionEditor({
  fetcher,
  initialContent,
  onImageUpload,
  imageUploading,
  aboutImageUrl,
}: AboutSectionEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleBlur(e: React.FocusEvent<HTMLTextAreaElement>) {
    const { name, value } = e.target;
    const data = new FormData();
    data.append(name, value);
    fetcher.submit(data, { method: "post" });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  }

  return (
    <div className="overflow-hidden bg-gray-50 sm:rounded-lg mb-8">
  <div className="px-4 py-5 sm:p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">About Section</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <label htmlFor="about_title" className="font-semibold text-gray-700">
            About Title
          </label>
          <textarea
            name="about_title"
            id="about_title"
            rows={2}
            defaultValue={initialContent.about_title || ""}
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            onBlur={handleBlur}
          />
          <label htmlFor="about_text" className="font-semibold text-gray-700">
            About Text
          </label>
          <textarea
            name="about_text"
            id="about_text"
            rows={5}
            defaultValue={initialContent.about_text || ""}
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            onBlur={handleBlur}
          />
        </div>
        <div className="flex flex-col gap-2 items-center justify-center">
          <label className="font-semibold text-gray-700 mb-2">About Image</label>
          {aboutImageUrl ? (
            <img
              src={aboutImageUrl}
              alt="About Preview"
              className="rounded shadow w-full max-w-xs mb-2"
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full max-w-xs h-40 bg-gray-200 rounded shadow mb-2 border border-dashed border-gray-400">
              <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 000 7.75M12 21v-4m0 0a4 4 0 01-4-4V7m4 10a4 4 0 004-4V7" /></svg>
              <span className="text-gray-500 text-sm">No image selected</span>
            </div>
          )
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="mb-2"
            onChange={handleFileChange}
            disabled={imageUploading}
          />
          {imageUploading && (
            <span className="text-blue-500 text-sm">Uploading...</span>
          )}
        </div>
      </div>
    </div>
</div>
  );
}
