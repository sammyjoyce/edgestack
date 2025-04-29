import { redirect } from "react-router";
import { COOKIE_NAME } from "../utils/auth";

export async function loader() {
  // Clear the cookie
  return redirect("/admin/login", {
    headers: {
      "Set-Cookie": `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`,
    },
  });
}

import { Button } from "../components/ui/Button";

// Accessible logout page
export default function Logout() {
  // This should only render if the loader is not redirecting (e.g., in dev or error)
  return (
    <main
      className="min-h-screen flex items-center justify-center bg-gray-50"
      role="main"
      aria-label="Logout Page"
    >
      <div
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm flex flex-col gap-6 items-center"
        role="region"
        aria-labelledby="logout-heading"
      >
        <h2
          className="text-2xl font-bold text-center text-gray-800"
          id="logout-heading"
        >
          Logged Out
        </h2>
        <div
          className="rounded bg-green-100 text-green-700 px-3 py-2 text-center mb-2"
          role="status"
          aria-live="polite"
        >
          You have been logged out.
        </div>
        <Button
          href="/admin/login"
          className="mt-2 w-full text-center"
          aria-label="Return to Login Page"
        >
          Return to Login
        </Button>
      </div>
    </main>
  );
}
