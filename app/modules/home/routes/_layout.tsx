import { Outlet, data, useLoaderData, type TypedResponse } from "react-router";
import Footer from "~/modules/common/components/Footer";
import Header from "~/modules/common/components/Header";
import { HomeErrorBoundary } from "../components/HomeErrorBoundary";
import { getAllContent, getFeaturedProjects } from "app/modules/common/db";
import type { Route } from "../+types/route";
import type { Project } from "~/database/schema"; // Ensure Project type is imported if needed here
import type { LoaderData } from "../../../.react-router/types/app/modules/home/routes/_layout"; // Import generated type

export async function loader({ context }: Route.LoaderArgs) {
  try {
    const [content, projects] = await Promise.all([
      getAllContent(context.db),
      getFeaturedProjects(context.db), // Assuming this returns Project[]
    ]);
    // Ensure the returned shape matches LoaderData
    return data({ content, projects } satisfies LoaderData);
  } catch (error) {
    console.error("Error fetching data from D1:", error);
    // Ensure the error response shape matches LoaderData for consistency if possible,
    // or handle appropriately in the component. Here, we match the success shape.
    const errorData: LoaderData = {
      content: {} as Record<string, string>,
      projects: [],
    };
    return data(errorData, { status: 500 });
  }
}

export function HomeLayout() {
  // Use the generated LoaderData type
  const loaderData = useLoaderData() as LoaderData;

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
