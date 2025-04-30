import { Outlet, data } from "react-router";
import Footer from "~/modules/common/components/Footer";
import Header from "~/modules/common/components/Header";
import { ProjectsErrorBoundary } from "../components/ProjectsErrorBoundary";
import { getAllContent, getAllProjects } from "app/modules/common/db";
import type { Project } from "~/database/schema";
import type { Route } from "~/modules/projects/+types/route";

export async function loader({ context }: Route.LoaderArgs) {
  try {
    const content = await getAllContent(context.db);
    const projects = await getAllProjects(context.db);
    return data({ content, projects });
  } catch (error) {
    console.error("Failed to fetch content or projects:", error);
    return data(
      { content: {} as Record<string, string>, projects: [] as Project[] },
      { status: 500 }
    );
  }
}

export function ProjectsLayout() {
  return (
    <div className="bg-linear-180/oklch from-0% from-gray-600/0 via-20% via-80% via-gray-600/10 to-100% to-gray-600/0">
      <Header />

      <div className="bg-white pt-20 pb-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-center font-bold font-serif text-4xl text-black">
            Our Projects
          </h1>
          <p className="mx-auto max-w-3xl text-center text-gray-700 text-xl">
            Explore our portfolio of completed projects, showcasing our
            commitment to quality craftsmanship and attention to detail.
          </p>
        </div>
      </div>

      <Outlet context={{ type: "projects" }} />

      <Footer />
    </div>
  );
}

export function ErrorBoundary() {
  return <ProjectsErrorBoundary />;
}

// Default export for backwards compatibility
export default ProjectsLayout;
