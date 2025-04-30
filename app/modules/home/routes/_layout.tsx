import { Outlet, data, useLoaderData, type TypedResponse } from "react-router";
import Footer from "~/modules/common/components/Footer";
import Header from "~/modules/common/components/Header";
import { HomeErrorBoundary } from "../components/HomeErrorBoundary";
import { getAllContent, getFeaturedProjects } from "app/modules/common/db";
import type { Route } from "../+types/route";
import type { Project } from "~/database/schema"; // Ensure Project type is imported if needed here

export async function loader({ context }: Route.LoaderArgs) {
  try {
    const [content, projects] = await Promise.all([
      getAllContent(context.db),
      getFeaturedProjects(context.db), // Assuming this returns Project[]
    ]);
    // Use data helper to ensure TypedResponse shape
    return data({ content, projects });
  } catch (error) {
    console.error("Error fetching data from D1:", error);
    // Use data helper for error response
    return data(
      {
        content: {} as Record<string, string>,
        projects: [] as Project[],
        error: "Failed to load layout data", // Add error field if needed by LoaderData type
      },
      { status: 500 }
    );
  }
}

export function HomeLayout() {
  // Use type inference for useLoaderData
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="bg-linear-180/oklch from-0% from-gray-600/0 via-20% via-80% via-gray-600/10 to-100% to-gray-600/0">
      <Header />
      <Outlet context={loaderData} />
      <Footer />
    </div>
  );
}

export function ErrorBoundary() {
  return <HomeErrorBoundary />;
}

// Default export for backwards compatibility, but we encourage using named exports
export default HomeLayout;
