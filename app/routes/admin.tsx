import { Outlet } from "react-router";
import { NavLink } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <nav className="w-64 bg-white shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Admin Menu</h2>
        <ul className="space-y-4">
          {/* Link to the main dashboard which contains both text and image sections */}
          <li><NavLink to="/admin" end className={({ isActive }) => isActive ? "block font-semibold text-blue-600" : "block font-semibold text-gray-700 hover:text-blue-600"}>Dashboard</NavLink></li>
          {/* Link to the Project Management section */}
          <li><NavLink to="/admin/projects" className={({ isActive }) => isActive ? "block font-semibold text-blue-600" : "block font-semibold text-gray-700 hover:text-blue-600"}>Projects</NavLink></li>
          {/* Add other admin sections here if needed in the future */}
          <li><a href="/admin/logout" className="block font-semibold text-gray-700 hover:text-red-600 mt-8">Logout</a></li> {/* Added margin-top */}
        </ul>
      </nav>
      <main className="flex-1 p-8 overflow-y-auto"> {/* Added overflow-y-auto */}
        <Outlet />
      </main>
    </div>
  );
}
