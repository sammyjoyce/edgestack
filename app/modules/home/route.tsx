import { data, useLoaderData } from "react-router"; // data helper is typically in the node adapter

import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import Footer from "~/modules/common/components/Footer";
import Header from "~/modules/common/components/Header";
import Hero from "./components/Hero";
import OurServices from "./components/OurServices";
import RecentProjects from "~/modules/common/components/RecentProjects";
import { getFeaturedProjects } from "~/db"; // Import the new function
import { getAllContent } from "~/db";
import type { Route } from "./+types/route";
import type { JSX } from "react";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Lush Constructions" },
    {
      name: "description",
      content: "High-Quality Solutions for Home & Office Improvement",
    },
  ];
};

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

export default function Home(_props: Route.ComponentProps): JSX.Element {
  const { content, projects } = useLoaderData<typeof loader>(); // Destructure projects

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
