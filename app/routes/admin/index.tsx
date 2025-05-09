import React, { useEffect, useState } from 'react';
import { Link } from './components/ui/link';


export default function AdminIndexRoute() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Action triggered in admin/index.tsx');
    // This is a placeholder for any initialization logic that might cause an invariant error
    try {
      // If there's any initialization or context check, it would go here
      console.log("Admin Dashboard initialized");
    } catch (err) {
      console.error("Error in Admin Dashboard initialization:", err);
      setError("Failed to load dashboard. Please check console for details.");
    }
  }, []);

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-red-600 mb-6">Error</h1>
        <div className="bg-red-100 p-6 rounded-lg shadow-md text-red-800">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-700 mb-4">Welcome to the Lush Constructions Admin Dashboard. Use the navigation to manage your projects and content.</p>
        <Link to="/admin/projects" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
          Manage Projects
        </Link>
      </div>
    </div>
  );
}
