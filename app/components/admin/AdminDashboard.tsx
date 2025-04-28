import React, { useRef } from "react";
import { useLoaderData, useFetcher } from "react-router";
import { TextContentForm } from "./TextContentForm";
import { ImageUploadSection } from "./ImageUploadSection";
import { Container } from "../ui/Container";
import { SectionIntro } from "../ui/SectionIntro";
import { FadeIn } from "../ui/FadeIn";

export default function AdminDashboard() {
  // Get initial content from loader
  const content = useLoaderData() as Record<string, string>;
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

  return (
    <Container>
      <SectionIntro title="Admin Dashboard" className="mb-6" />
      {status && (
        <FadeIn>
          <div className={`p-2 mb-4 rounded ${status.isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {status.msg}
          </div>
        </FadeIn>
      )}
      <TextContentForm
        fetcher={fetcher}
        initialContent={content}
        formRef={textFormRef}
      />
      <ImageUploadSection
        initialContent={content}
        sectionRef={imageSectionRef}
      />
    </Container>
  );
}
