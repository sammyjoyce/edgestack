import React from "react";
import { useOutletContext, useParams } from "react-router";

// Define the type for the context passed from the parent route
type ProjectsContext = {
  content: { [key: string]: string } | undefined;
};

export default function ProjectDetail() {
  // Get the content data from the parent route
  const { content } = useOutletContext<ProjectsContext>();
  // Get the project ID from the URL parameters
  const { projectId } = useParams();

  return (
    <div className="py-16 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-serif font-bold text-black mb-6">
          Project Details
        </h2>
        
        {projectId ? (
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold mb-4">Project ID: {projectId}</h3>
            <p className="text-gray-700 mb-4">
              This is a placeholder for project details. In a real application, you would fetch the project data based on the ID and display it here.
            </p>
            <p className="text-gray-700">
              {content?.project_detail_text ?? 'Detailed information about this project would be displayed here, including specifications, timeline, challenges, and outcomes.'}
            </p>
          </div>
        ) : (
          <p className="text-gray-700">
            No project ID specified. Please select a project from the list.
          </p>
        )}
      </div>
    </div>
  );
}