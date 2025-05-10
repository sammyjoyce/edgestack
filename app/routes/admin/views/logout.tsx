import React from "react";
import { redirect } from "react-router";
import { COOKIE_NAME } from "~/routes/common/utils/auth";
// Import generated types from the correct path
import type { Route } from "./+types/logout"; // Ensure this path is correct

// Use the generated type with the proper format
export const loader = async (): Promise<Response> => {
	// Explicit Promise<Response>
	// Create response with typed redirect to login
	const response = redirect("/admin/login");

	// Clear session cookie
	response.headers.set(
		"Set-Cookie",
		`${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
	);

	return response;
};

export async function action({
	request,
	context,
}: Route.ActionArgs): Promise<Response> {
	const env = context.cloudflare.env as Env;
	return handleLogout(env);
}

async function handleLogout(env: Env): Promise<Response> {
	const SESSION_COOKIE_NAME = "session";
	return new Response(null, {
		status: 302,
		headers: {
			Location: "/",
			"Set-Cookie": `${SESSION_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict`,
		},
	});
}

export function LogoutRoute() {
	// This component shouldn't actually render, as the loader should redirect
	return (
		<div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
					Logging out...
				</h2>
				<p className="mt-2 text-center text-sm text-gray-600">
					If you are not redirected, please
					<a href="/admin/login" className="text-primary hover:underline">
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
