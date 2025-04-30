import { data, useLoaderData, type TypedResponse } from "react-router"; // Import useLoaderData, TypedResponse

import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import Footer from "~/modules/common/components/Footer";
import Header from "~/modules/common/components/Header";
import Hero from "./components/Hero";
import OurServices from "./components/OurServices";
import RecentProjects from "~/modules/common/components/RecentProjects";
import { getFeaturedProjects } from "app/modules/common/db"; // Import the new function
import { getAllContent } from "app/modules/common/db";
import type { Route } from "./+types/route";
import type { JSX } from "react";
// Import generated loader type
import type { LoaderData } from "../../.react-router/types/app/modules/home/route";
import type { Project } from "~/database/schema"; // Ensure Project is imported

export const meta: Route.MetaFunction<typeof loader> = ({ data }) => { // Type meta function if needed
  return [
    { title: "Lush Constructions" },
    {
      name: "description",
      content: "High-Quality Solutions for Home & Office Improvement",
    },
  ];
};

export async function loader({
  context,
}: Route.LoaderArgs): Promise<TypedResponse<LoaderData>> { // Use TypedResponse and LoaderData
  try {
    const [content, projects] = await Promise.all([
      getAllContent(context.db),
      getFeaturedProjects(context.db), // Assuming this returns Project[]
    ]);
    // Ensure the returned shape matches LoaderData
    return data({ content, projects } satisfies LoaderData);
  } catch (error) {
    console.error("Error fetching data from D1:", error);
    // Ensure the error response shape matches LoaderData
    const errorData: LoaderData = {
      content: {} as Record<string, string>,
      projects: [],
    };
    return data(errorData, { status: 500 });
  }
}

export default function HomeRoute(): JSX.Element { // Rename component if desired
  // Use useLoaderData with the generated type
  const { content, projects } = useLoaderData() as LoaderData;

  // Section mapping
  const sectionBlocks: Record<string, JSX.Element> = {
    hero: (
      <Hero
        key="hero"
        title={content?.hero_title ?? "Building Dreams, Creating Spaces"}
        subtitle={
          content?.hero_subtitle ??
          "Your trusted partner in construction and renovation."
        }
        imageUrl={content?.hero_image_url ?? "/assets/rozelle.jpg"}
      />
    ),
    services: (
      <OurServices
        key="services"
        introTitle={content?.services_intro_title ?? "Our Services"}
        introText={
          content?.services_intro_text ??
          "We offer a wide range of construction services."
        }
        servicesData={[
          {
            title: content?.service_1_title ?? "Kitchens",
            image: content?.service_1_image ?? "/assets/pic09-By9toE8x.png",
            link: "#contact",
          },
          {
            title: content?.service_2_title ?? "Bathrooms",
            image: content?.service_2_image ?? "/assets/pic06-BnCQnmx7.png",
            link: "#contact",
          },
          {
            title: content?.service_3_title ?? "Roofing",
            image: content?.service_3_image ?? "/assets/pic13-C3BImLY9.png",
            link: "#contact",
          },
          {
            title: content?.service_4_title ?? "Renovations",
            image: content?.service_4_image ?? "/assets/pic04-CxD2NUJX.png",
            link: "#contact",
          },
        ]}
      />
    ),
    projects: (
      <RecentProjects
        key="projects"
        introTitle={content?.projects_intro_title ?? "Recent Projects"}
        introText={
          content?.projects_intro_text ??
          "Take a look at some of our recent work."
        }
        projects={projects}
      />
    ),
    about: (
      <AboutUs
        key="about"
        title={content?.about_title ?? "About Us"}
        text={content?.about_text ?? "Learn more about our company and values."}
        imageUrl={content?.about_image_url ?? "/assets/rozelle.jpg"}
      />
    ),
    contact: <ContactUs key="contact" />,
  };

  // Determine order
  const DEFAULT_ORDER = ["hero", "services", "projects", "about", "contact"];
  const orderString = content?.home_sections_order as string | undefined;
  const order = orderString
    ? orderString.split(",").filter((id) => id in sectionBlocks)
    : DEFAULT_ORDER;

  return (
    <div className="bg-linear-180/oklch from-0% from-gray-600/0 via-20% via-80% via-gray-600/10 to-100% to-gray-600/0">
      <Header />
      {order.map((id) => sectionBlocks[id])}
      <Footer />
    </div>
  );
}
