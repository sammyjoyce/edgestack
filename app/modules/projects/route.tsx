import { Outlet } from "react-router";

import { schema } from "~/database/schema";
import { getAllContent, getAllProjects } from "~/db";
import type { Project } from "~/database/schema";
import Footer from "~/modules/common/components/Footer";
import Header from "~/modules/common/components/Header";
import type { Route } from "./+types/route";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Projects | Lush Constructions" },
    {
      name: "description",
      content: "Explore our recent construction and renovation projects",
    },
  ];
};

// Loader to fetch dynamic content from D1
// The loader should return the data type, React Router handles the Response wrapping
export async function loader({ context }: Route.LoaderArgs) {
  try {
    const content = await getAllContent(context.db);
    const projects = await getAllProjects(context.db);
    return { content, projects };
  } catch (error) {
    console.error("Failed to fetch content or projects:", error);
    return {
      content: {} as Record<string, string>,
      projects: [] as Project[],
    };
  }
}

export default function Projects({ loaderData }: Route.ComponentProps) {
  const { content, projects } = loaderData; // Destructure projects here

  return (
    <div className="bg-linear-180/oklch from-0% from-gray-600/0 via-20% via-80% via-gray-600/10 to-100% to-gray-600/0">
      <Header />

      <div className="bg-white pt-20 pb-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-center font-bold font-serif text-4xl text-black">
            Our Projects
          </h1>
          <p className="mx-auto max-w-3xl text-center text-gray-700 text-xl">
            {content?.projects_page_intro ??
              "Explore our portfolio of completed projects, showcasing our commitment to quality craftsmanship and attention to detail."}
          </p>
        </div>
      </div>

      {/* Outlet renders the child route */}
      {/* Pass projects to Outlet context */}
      <Outlet context={{ content, projects }} />

      <Footer />
    </div>
  );
}
