import { data, redirect } from "react-router";
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
  if (
    username === context.ADMIN_USERNAME &&
    password === context.ADMIN_PASSWORD &&
    (context as any).JWT_SECRET
  ) {
    const sessionValue = sign(username + ":" + Date.now(), (context as any).JWT_SECRET);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        method="post"
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Admin Login</h2>
        {loggedOut && (
          <div className="text-green-600 text-center">You have been logged out.</div>
        )}
        {actionData?.error && (
          <div className="text-red-600 text-center">{actionData.error}</div>
        )}
        <input
          name="username"
          type="text"
          required
          placeholder="Username"
          className="border rounded px-3 py-2 focus:ring w-full"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          className="border rounded px-3 py-2 focus:ring w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded w-full"
        >
          Log In
        </button>
      </form>
      <a href="/admin/logout" className="mt-4 text-blue-600 hover:underline text-center block">Logout</a>
    </div>
  );
}
