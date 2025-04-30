import { Outlet, data, useLoaderData } from "react-router";
import Footer from "~/modules/common/components/Footer";
import Header from "~/modules/common/components/Header";
import { HomeErrorBoundary } from "../components/HomeErrorBoundary";
import { getAllContent, getFeaturedProjects } from "app/modules/common/db";
import type { Route } from "../+types/route";

export async function loader({ context }: Route.LoaderArgs) {
  try {
    const [content, projects] = await Promise.all([
      getAllContent(context.db),
      getFeaturedProjects(context.db),
    ]);
    return data({ content, projects });
  } catch (error) {
    console.error("Error fetching data from D1:", error);
    return data(
      { content: {} as Record<string, string>, projects: [] },
      { status: 500 }
    );
  }
}

export function HomeLayout() {
  // Access the loader data to pass down to children
  const loaderData = useLoaderData<{
    content: Record<string, string>;
    projects: any[];
  }>();

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
