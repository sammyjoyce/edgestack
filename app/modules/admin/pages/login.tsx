import {
  data,
  redirect,
  useActionData,
  useSearchParams,
} from "react-router";
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

export default function AdminLogin(_props: Route.ComponentProps): JSX.Element {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  const loggedOut = searchParams.get("loggedOut") === "1";
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <form
        method="post"
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm flex flex-col gap-6"
        aria-label="Admin Login Form"
        role="form"
      >
        <h2
          className="text-2xl font-bold text-center text-gray-800"
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
            className="rounded bg-green-100 text-green-700 px-3 py-2 text-center mb-2"
            role="alert"
            aria-live="polite"
          >
            You have been logged out.
          </div>
        )}
        {actionData?.error && (
          <div
            className="rounded bg-red-100 text-red-700 px-3 py-2 text-center mb-2"
            role="alert"
            aria-live="assertive"
          >
            {actionData.error}
          </div>
        )}
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
          className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        />
        <span id="username-help" className="text-xs text-gray-500">
          Enter your admin username.
        </span>
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
          className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        />
        <span id="password-help" className="text-xs text-gray-500">
          Enter your admin password. This field is case-sensitive.
        </span>
        <Button
          type="submit"
          className="mt-2"
          aria-label="Login to Admin Dashboard"
        >
          Login
        </Button>
      </form>
    </div>
  );
}
