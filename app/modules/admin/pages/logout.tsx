import React, { type JSX } from "react";
import { redirect } from "react-router";
import type { Route } from "./+types/logout";

import { COOKIE_NAME } from "~/modules/common/utils/auth";
import { Button } from "~/modules/common/components/ui/Button";

export async function loader({}: Route.LoaderArgs) {
  // Clear the cookie
  return redirect("/admin/login", {
    headers: {
      "Set-Cookie": `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`,
    },
  });
}

export default function Logout(): JSX.Element {
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
