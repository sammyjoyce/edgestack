import React from "react";
import { redirect } from "react-router";
import type { Route } from "../+types/route";
import { COOKIE_NAME } from "~/modules/common/utils/auth";

export async function loader() {
  // Create response with typed redirect to login
  const response = redirect("/admin/login"); // Use typed path

  // Clear session cookie
  response.headers.set(
    "Set-Cookie",
    `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`
  );

  return response;
}

export function LogoutRoute() {
  // This component shouldn't actually render, as the loader should redirect
  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-100 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Logging out...
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          If you are not redirected, please{" "}
          <a href="/admin/login" className="text-blue-600 hover:underline">
            click here
          </a>
          .
        </p>
      </div>
    </div>
  );
}

// Default export for backwards compatibility
export default LogoutRoute;
