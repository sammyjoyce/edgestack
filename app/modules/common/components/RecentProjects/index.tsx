import React from "react";
import { Link, type To } from "react-router"; // Import To type
import type { Project } from "~/database/schema";
import { SectionIntro } from "~/modules/common/components/ui/SectionIntro";
import { Container } from "~/modules/common/components/ui/Container";
import { FadeIn, FadeInStagger } from "~/modules/common/components/ui/FadeIn";
import { clsx } from "clsx";
import ConditionalRichTextRenderer from "~/modules/common/components/ConditionalRichTextRenderer"; // Import the new component

// Define props interface
interface RecentProjectsProps {
  introTitle?: string;
  introText?: string;
  projects: Project[]; // Expect projects array as a prop
}

export default function RecentProjects({
  introTitle,
  introText,
  projects = [],
}: RecentProjectsProps) {
  // No longer use hardcoded data

  return (
    <section id="projects" className="w-full bg-white py-20">
      {/* Use props for intro title and text, with defaults */}
      <SectionIntro
        title={introTitle ?? "Recent Projects"}
        className="mb-16 max-w-6xl px-4 lg:px-8"
      >
        {introText && <p>{introText}</p>}{" "}
        {/* Conditionally render intro text if provided */}
      </SectionIntro>
      <Container className="max-w-6xl px-4 lg:px-8">
        <FadeInStagger>
          <div className="flex flex-col gap-24">
            {projects.map((project, idx) => (
              <FadeIn key={project.id}>
                <div
                  className={clsx(
                    "grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12",
                    // Alternate layout direction based on index
                    idx % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
                  )}
                >
                  <div
                    className={clsx(
                      "w-full",
                      idx % 2 === 1 ? "md:order-last" : ""
                    )}
                  >
                    <img
                      src={project.imageUrl ?? undefined}
                      alt={project.title}
                      className="aspect-3/2 w-full rounded-md object-cover"
                    />
                  </div>
                  <div
                    className={clsx(
                      "flex w-full flex-col justify-center px-4 py-6 md:px-8 md:py-0",
                      idx % 2 === 1 ? "md:order-first" : ""
                    )}
                  >
                    <h3 className="mb-4 font-serif text-2xl text-black leading-snug md:mb-6 md:text-3xl">
                      {project.title}
                    </h3>
                    <ConditionalRichTextRenderer
                      text={project.description}
                      fallbackClassName="mb-4 text-base text-gray-700 md:mb-6 md:text-lg"
                      fallbackTag="p"
                    />
                    {/* Use Link with typed 'to' prop */}
                    <Link
                      to="/projects/:projectId"
                      params={{ projectId: String(project.id) }}
                      className="font-semibold text-base text-black underline underline-offset-4 transition hover:text-gray-700"
                    >
                      View Project Details →
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeInStagger>
      </Container>
    </section>
  );
}
