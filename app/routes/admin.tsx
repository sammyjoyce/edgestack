import { Outlet } from "react-router";

export default function AdminLayout() {
  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f7" }}>
      <header style={{ padding: "1rem", background: "#222", color: "#fff" }}>
        <h1>Admin Dashboard</h1>
      </header>
      <main style={{ maxWidth: 900, margin: "2rem auto", background: "#fff", padding: 32, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <Outlet />
      </main>
    </div>
  );
}
