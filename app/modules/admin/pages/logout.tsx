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

export function Component(_props: Route.ComponentProps): JSX.Element {
  // This should only render if the loader is not redirecting (e.g., in dev or error)
  return (
    <main
      className="min-h-screen flex items-center justify-center bg-gray-50"
      role="main"
      aria-label="Logout Page"
    >
      <div
        className="bg-white p-8 rounded-lg shadow-md border border-gray-200 w-full max-w-sm flex flex-col gap-4 items-center" /* Adjusted shadow/border/gap */
        role="region"
        aria-labelledby="logout-heading"
      >
        <h2
          className="text-2xl font-semibold text-center text-gray-900" /* Use semibold, gray-900 */
          id="logout-heading"
        >
          Logged Out
        </h2>
        <div
          className="rounded border border-green-200 bg-green-50 text-green-700 px-3 py-2 text-center text-sm w-full" /* Adjusted style, full width */
          role="status"
          aria-live="polite"
        >
          You have been logged out.
        </div>
        <Button
          href="/admin/login"
          className="mt-4 w-full justify-center bg-blue-600 text-white hover:bg-blue-700" /* Added margin, full width, explicit style */
          aria-label="Return to Login Page"
        >
          Return to Login
        </Button>
      </div>
    </main>
  );
}
