import { data, redirect } from "react-router";
import { Button } from "../components/ui/Button";
import { type LoaderFunctionArgs, type ActionFunctionArgs, useActionData, useSearchParams } from "react-router";
import type { Route } from "./+types/admin.login";

import { COOKIE_NAME, COOKIE_MAX_AGE, sign, verify, getSessionCookie } from "../utils/auth";

export async function loader({ request, context }: Route.LoaderArgs) {
  const sessionValue = getSessionCookie(request);
  if (sessionValue && (context.cloudflare.env as any).JWT_SECRET && await verify(sessionValue, (context.cloudflare.env as any).JWT_SECRET)) {
    return redirect("/admin");
  }
  return data({});
}

export async function action({ request, context }: ActionFunctionArgs) {
  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");
  const env = (context.cloudflare?.env ?? {});
  if (
    username === env.ADMIN_USERNAME &&
    password === env.ADMIN_PASSWORD &&
    env.JWT_SECRET
  ) {
    const sessionValue = await sign(username + ":" + Date.now(), env.JWT_SECRET);
    return redirect("/admin", {
      headers: {
        "Set-Cookie": `${COOKIE_NAME}=${sessionValue}; HttpOnly; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Strict`,
      },
    });
  }
  return data({ error: "Invalid credentials" }, { status: 401 });
}


export default function AdminLogin() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  const loggedOut = searchParams.get("loggedOut") === "1";
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <form
        method="post"
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Admin Login</h2>
        {loggedOut && (
          <div className="rounded bg-green-100 text-green-700 px-3 py-2 text-center mb-2">You have been logged out.</div>
        )}
        {actionData?.error && (
          <div className="rounded bg-red-100 text-red-700 px-3 py-2 text-center mb-2">{actionData.error}</div>
        )}
        <input
          name="username"
          type="text"
          required
          placeholder="Username"
          className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        />
        <Button type="submit" className="mt-2">Login</Button>
      </form>

    </div>
  );
}
