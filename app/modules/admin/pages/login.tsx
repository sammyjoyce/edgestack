import { data, redirect, useSearchParams } from "react-router";
import type { Route } from "./+types/login";
import React from "react"; // Import React
import { data, redirect, useSearchParams } from "react-router";
import type { Route } from "./+types/login";
import { Button } from "~/modules/common/components/ui/Button";

import {
  COOKIE_MAX_AGE,
  COOKIE_NAME,
  getSessionCookie,
  sign,
  verify,
} from "~/modules/common/utils/auth";

export async function loader({ request, context }: Route.LoaderArgs) {
  const sessionValue = getSessionCookie(request);
  if (
    sessionValue &&
    (context.cloudflare.env as any).JWT_SECRET &&
    (await verify(sessionValue, (context.cloudflare.env as any).JWT_SECRET))
  ) {
    return redirect("/admin");
  }
  return data({});
}

export async function action({ request, context }: Route.ActionArgs) {
  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");
  const env = context.cloudflare?.env ?? {};
  if (
    username === env.ADMIN_USERNAME &&
    password === env.ADMIN_PASSWORD &&
    env.JWT_SECRET
  ) {
    const sessionValue = await sign(
      username + ":" + Date.now(),
      env.JWT_SECRET
    );
    return redirect("/admin", {
      headers: {
        "Set-Cookie": `${COOKIE_NAME}=${sessionValue}; HttpOnly; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Strict`,
      },
    });
  }
  return data({ error: "Invalid credentials" }, { status: 401 });
}

export default function AdminLogin({
  actionData,
}: Route.ComponentProps): React.ReactElement { // Use React.ReactElement
  const [searchParams] = useSearchParams();
  const loggedOut = searchParams.get("loggedOut") === "1";
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <form
        method="post"
        className="bg-white p-8 rounded-lg shadow-md border border-gray-200 w-full max-w-sm flex flex-col gap-4" /* Adjusted shadow/border/gap */
        aria-label="Admin Login Form"
        role="form"
      >
        <h2
          className="text-2xl font-semibold text-center text-gray-900 mb-2" /* Use semibold, gray-900, added margin */
          id="admin-login-heading"
        >
          Admin Login
        </h2>
        <div
          id="admin-login-status"
          role="status"
          aria-live="polite"
          className="sr-only"
        ></div>
        {loggedOut && (
          <div
            className="rounded border border-green-200 bg-green-50 text-green-700 px-3 py-2 text-center text-sm" /* Adjusted style */
            role="alert"
            aria-live="polite"
          >
            You have been logged out.
          </div>
        )}
        {actionData?.error && (
          <div
            className="rounded border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-center text-sm" /* Adjusted style */
            role="alert"
            aria-live="assertive"
          >
            {actionData.error}
          </div>
        )}
        {/* Group input and help text */}
        <div>
          <label htmlFor="username" className="sr-only">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            placeholder="Username"
            aria-label="Username"
            aria-describedby="username-help"
            className="block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500" /* Standardized input */
          />
          <span id="username-help" className="mt-1 text-xs text-gray-500 block">
            {" "}
            {/* Added margin, block display */}
            Enter your admin username.
          </span>
        </div>
        {/* Group input and help text */}
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Password"
            aria-label="Password"
            aria-describedby="password-help"
            className="block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500" /* Standardized input */
          />
          <span id="password-help" className="mt-1 text-xs text-gray-500 block">
            {" "}
            {/* Added margin, block display */}
            Enter your admin password. This field is case-sensitive.
          </span>
        </div>
        <Button
          type="submit"
          className="mt-4 w-full justify-center bg-blue-600 text-white hover:bg-blue-700" /* Added margin, full width, explicit style */
          aria-label="Login to Admin Dashboard"
        >
          Login
        </Button>
      </form>
    </div>
  );
}
