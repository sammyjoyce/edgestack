import { Outlet, data, useLoaderData, type TypedResponse } from "react-router"; // Import useLoaderData, TypedResponse
import Footer from "~/modules/common/components/Footer";
import Header from "~/modules/common/components/Header";
import { ProjectsErrorBoundary } from "../components/ProjectsErrorBoundary";
import { getAllContent, getAllProjects } from "app/modules/common/db";
import type { Project } from "~/database/schema";
import type { Route } from "~/modules/projects/+types/route";
// Import generated type
import type { LoaderData } from "../../../.react-router/types/app/modules/projects/routes/_layout";

export async function loader({
  context,
}: Route.LoaderArgs): Promise<TypedResponse<LoaderData>> { // Use TypedResponse and LoaderData
  try {
    const content = await getAllContent(context.db);
    const projects = await getAllProjects(context.db);
    // Ensure shape matches LoaderData
    return data({ content, projects } satisfies LoaderData);
  } catch (error) {
    console.error("Failed to fetch content or projects:", error);
    // Ensure error response shape matches LoaderData
    const errorData: LoaderData = {
      content: {} as Record<string, string>,
      projects: [] as Project[],
    };
    return data(errorData, { status: 500 });
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

      {/* Outlet automatically receives context, use useLoaderData in children */}
      <Outlet />

      <Footer />
    </div>
  );
}

export function ErrorBoundary() {
  return <ProjectsErrorBoundary />;
}

// Default export for backwards compatibility
export default ProjectsLayout;
