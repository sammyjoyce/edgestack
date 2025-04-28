import { Outlet } from "react-router";
import { NavLink } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <nav className="w-64 bg-white shadow p-6">
        <ul className="space-y-4">
          <li><NavLink to="." end className={({ isActive }) => isActive ? "block font-semibold text-blue-600" : "block font-semibold text-gray-700 hover:text-blue-600"}>Text Content</NavLink></li>
          <li><NavLink to="upload" className={({ isActive }) => isActive ? "block font-semibold text-blue-600" : "block font-semibold text-gray-700 hover:text-blue-600"}>Images</NavLink></li>
        </ul>
      </nav>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
