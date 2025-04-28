import React from "react";
import { useOutletContext, useParams, Link } from "react-router-dom"; // Import Link
import { FadeIn } from "../../components/ui/FadeIn"; // Import FadeIn

// Define the type for the context passed from the parent route
type ProjectsContext = {
  content: { [key: string]: string } | undefined;
};

// Hardcoded project data matching RecentProjects.tsx for demonstration
// In a real app, this data would likely be fetched based on projectId
const defaultProjects = [
	{
		id: "modern-home-extension",
		title: "Modern Home Extension",
		image: "/assets/pic13-C3BImLY9.png",
		description:
			"A seamless blend of old and new, this extension maximizes light and space while maintaining character. Features include large glass panels, natural wood finishes, and integrated smart home technology.",
		details: "Location: Marrickville | Duration: 6 months | Budget: $250,000",
	},
	{
		id: "luxury-kitchen-renovation",
		title: "Luxury Kitchen Renovation",
		image: "/assets/pic09-By9toE8x.png",
		description:
			"Premium finishes and high-end appliances transform this kitchen into the heart of the home. Includes custom cabinetry, marble countertops, and professional-grade cooking equipment.",
		details: "Location: Double Bay | Duration: 3 months | Budget: $150,000",
	},
	{
		id: "outdoor-living-retreat",
		title: "Outdoor Living Retreat",
		image: "/assets/pic08-B09tdJ9o.png",
		description:
			"A resort-style alfresco area perfect for entertaining and relaxation, year-round. Complete with an outdoor kitchen, fireplace, and comfortable seating.",
		details: "Location: Mosman | Duration: 4 months | Budget: $180,000",
	},
];


export default function ProjectDetail() {
  // Get the content data from the parent route (optional, could be used for general text)
  const { content } = useOutletContext<ProjectsContext>();
  // Get the project ID from the URL parameters
  const { projectId } = useParams<{ projectId: string }>(); // Ensure projectId is typed

  // Find the project data based on the projectId
  const project = defaultProjects.find(p => p.id === projectId);

  return (
    <div className="py-16 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {project ? (
          <FadeIn>
            <article className="bg-gray-50 p-6 rounded-lg shadow-md">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-64 md:h-96 object-cover rounded-md mb-6"
              />
              <h2 className="text-3xl font-serif font-bold text-black mb-4">
                {project.title}
              </h2>
              <p className="text-gray-700 text-lg mb-4">
                {project.description}
              </p>
              {project.details && (
                <p className="text-gray-600 text-sm mb-6">
                  <strong>Details:</strong> {project.details}
                </p>
              )}
              {/* Optional: Use content from context for generic text */}
              <p className="text-gray-500 italic mb-6">
                {content?.project_detail_footer ?? 'Contact us for more information about similar projects.'}
              </p>
              <Link 
                to="/projects" 
                className="inline-block text-blue-600 hover:underline"
              >
                ← Back to Projects
              </Link>
            </article>
          </FadeIn>
        ) : (
          <div className="text-center py-10">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Project Not Found</h2>
            <p className="text-gray-500 mb-6">
              The project you are looking for does not exist or could not be found.
            </p>
            <Link 
              to="/projects" 
              className="inline-block text-blue-600 hover:underline"
            >
              ← Back to Projects
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
