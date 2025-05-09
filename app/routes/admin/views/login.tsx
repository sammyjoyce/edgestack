import type React from "react";
import { useState } from "react";
import {
	Form,
	redirect,
	useActionData,
	// useLoaderData, // Not needed if loader only redirects or returns null
} from "react-router";
import {
	COOKIE_MAX_AGE,
	COOKIE_NAME,
	getSessionCookie,
	sign,
	verify,
} from "~/routes/common/utils/auth";
import { FadeIn } from "~/routes/common/components/ui/FadeIn";

import { Button } from "~/routes/admin/components/ui/Button";
// Import generated types from proper path
import type { Route } from "./+types/login";
import { Fieldset } from "../components/ui/fieldset";
import { Label } from "../components/ui/fieldset";
import { Input } from "../components/ui/input";

// Define a specific type for the data part of the action's return
type LoginActionData = { success: false; error: string };

// Use generated type without explicit return type annotation
export const action = async ({ request, context }: Route.ActionArgs) => {
	try {
		const formData = await request.formData();
		const username = formData.get("username")?.toString() ?? "";
		const password = formData.get("password")?.toString() ?? "";
		const env = context.cloudflare?.env;
		const jwtSecret = env?.JWT_SECRET;

		// Log environment variable access
		console.log("[ADMIN LOGIN] Accessing environment variables:", {
			adminUsernameDefined: !!env?.ADMIN_USERNAME,
			adminPasswordDefined: !!env?.ADMIN_PASSWORD,
			jwtSecretDefined: !!jwtSecret,
		});

		// Provide clear error if JWT_SECRET is missing
		if (!jwtSecret) {
			throw new Response(
				"JWT_SECRET not configured. Please set JWT_SECRET in your environment variables.",
				{ status: 500 }
			);
		}

		// Directly access environment variables
		const adminUsername = env?.ADMIN_USERNAME as string;
		const adminPassword = env?.ADMIN_PASSWORD as string;

		if (!adminUsername || !adminPassword) {
			throw new Response(
				"Admin credentials not configured. Please set ADMIN_USERNAME and ADMIN_PASSWORD in your environment variables.",
				{ status: 500 }
			);
		}

		// Check against environment variable credentials
		if (username === adminUsername && password === adminPassword) {
			// Create signed session token
			const token = await sign(username, jwtSecret);

			// Create response with typed redirect
			const response = redirect("/admin");

			// Set secure cookie with the token
			response.headers.set(
				"Set-Cookie",
				`${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${COOKIE_MAX_AGE}`,
			);

			return response;
		}

		// Return error data directly
		return {
			success: false,
			error: "Invalid username or password"
		};
	} catch (error) {
		console.error("[ADMIN LOGIN] Action Error:", error);
		throw new Response(
			"Unexpected server error during login process. Please check logs for details.",
			{ status: 500 }
		);
	}
};

// Add loader to check authentication status before rendering the login page
export const loader = async ({ request, context }: Route.LoaderArgs) => {
	try {
		const sessionValue = getSessionCookie(request);
		const jwtSecret = context.cloudflare?.env?.JWT_SECRET;

		if (sessionValue && jwtSecret) {
			try {
				const isAuthenticated = await verify(sessionValue, jwtSecret);
				if (isAuthenticated) {
					// If already logged in, redirect to the admin dashboard
					return redirect("/admin");
				}
			} catch (e) {
				// Ignore verification errors, just means they aren't logged in
				console.error("Login loader verification error:", e);
			}
		}

		// If not logged in or verification fails, allow rendering the login page
		// Returning null is standard practice here
		return null;
	} catch (error) {
		console.error("[ADMIN LOGIN] Loader Error:", error);
		throw new Response(
			"Unexpected server error during login loader process. Please check logs for details.",
			{ status: 500 }
		);
	}
};

export default function LoginRoute() {
	// Access action data with proper typing
	const actionData = useActionData<LoginActionData>();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	return (
		<FadeIn className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8 rounded-lg border border-gray-200 bg-white p-8 shadow-md dark:border-gray-700 dark:bg-gray-800">
				<div className="text-center">
					<h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
						Admin Login
					</h1>
					<p className="mt-2 text-gray-600 dark:text-gray-300">
						Sign in to your account
					</p>
				</div>

				<Form method="post" className="mt-8 space-y-6">
					<input type="hidden" name="remember" defaultValue="true" />
					<div className="space-y-4 rounded-md shadow-sm">
						<Fieldset className="space-y-4">
							<Label htmlFor="username">Username</Label>
							<Input
								id="username"
								name="username"
								type="text"
								autoComplete="username"
								required
								placeholder="Admin username"
								value={username}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setUsername(e.target.value)
								}
								className="w-full"
							/>

							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								placeholder="Admin password"
								value={password}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setPassword(e.target.value)
								}
								className="w-full"
							/>
						</Fieldset>
					</div>

					{actionData && !actionData.success && (
						<div className="rounded-md border-l-4 border-red-500 bg-red-100 p-3 dark:bg-red-900/30 dark:text-red-200">
							<p className="text-sm font-medium">{actionData.error}</p>
						</div>
					)}

					<div>
						<Button type="submit" variant="primary" className="w-full">
							Sign in
						</Button>
					</div>
				</Form>
			</div>
		</FadeIn>
	);
}
