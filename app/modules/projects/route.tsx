import { type MetaFunction, Outlet, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";

import { schema } from "../../database/schema";
import Footer from "../components/Footer";
import Header from "../components/Header";
import type { Route } from ".react-router/types/app/routes/+types/projects";

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
  let contentMap: { [key: string]: string } = {};

  try {
    // Query the content table
    const results = await context.db
      .select({ key: schema.content.key, value: schema.content.value })
      .from(schema.content);

    if (results) {
      contentMap = (results as Array<{ key: string; value: string }>).reduce(
        (acc: { [key: string]: string }, { key, value }) => {
          acc[key] = value;
          return acc;
        },
        {}
      );
    }
    // Return the plain data object directly
    return { content: contentMap };
  } catch (error) {
    console.error("Failed to fetch content from D1:", error);
    // Return the plain data object directly
    return { content: {} };
  }
}

export default function Projects() {
  // Use the generated Route type for loader data
  const { content } = useLoaderData<typeof loader>();

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
      <Outlet context={{ content }} />

      <Footer />
    </div>
  );
}
