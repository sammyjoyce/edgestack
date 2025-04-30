import React, { useState } from "react";
import { Form, redirect, data } from "react-router";
import { FadeIn } from "~/modules/common/components/ui/FadeIn";
import type { Route } from "~/modules/admin/+types/route";
import { sign, COOKIE_NAME, COOKIE_MAX_AGE } from "~/modules/common/utils/auth";

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const jwtSecret = context.cloudflare?.env?.JWT_SECRET;

  if (!jwtSecret) {
    return data(
      { success: false, error: "JWT_SECRET not configured" },
      { status: 500 }
    );
  }

  // Use environment variables for credentials
  const adminUsername = context.cloudflare?.env?.ADMIN_USERNAME;
  const adminPassword = context.cloudflare?.env?.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    return data(
      { success: false, error: "Admin credentials not configured" },
      { status: 500 }
    );
  }

  // Check against environment variable credentials
  if (username === adminUsername && password === adminPassword) {
    // Create signed session token
    const token = await sign(username, jwtSecret);

    // Create response with redirect
    const response = redirect("/admin");

    // Set secure cookie with the token
    response.headers.set(
      "Set-Cookie",
      `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${COOKIE_MAX_AGE}`
    );

    return response;
  }

  return data(
    { success: false, error: "Invalid username or password" },
    { status: 401 }
  );
}

export function LoginRoute() {
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const username = form.username.value;
    const password = form.password.value;

    if (!username || !password) {
      e.preventDefault();
      setFormError("Username and password are required");
    } else {
      setFormError(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-100 py-12 sm:px-6 lg:px-8">
      <FadeIn>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto"
            src="/assets/logo_284x137-KoakP1Oi.png"
            alt="Lush Constructions"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <Form method="post" className="space-y-6" onSubmit={handleSubmit}>
              {formError && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        {formError}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Sign in
                </button>
              </div>
            </Form>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

// Default export for backwards compatibility
export default LoginRoute;
