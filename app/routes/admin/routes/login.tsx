import type React from "react";
import { useState } from "react";
import { Form, redirect, useActionData } from "react-router";
import { FadeIn } from "~/routes/common/components/ui/FadeIn";
import { COOKIE_MAX_AGE, COOKIE_NAME, sign } from "~/routes/common/utils/auth";
// Import generated types from proper path
import type { Route } from "./+types/login";

// Use generated type without explicit return type annotation
export const action = async ({ request, context }: Route.ActionArgs) => {
	// Debug log for env variables (redact actual secrets)
	// NOTE: The 'env' object comes from Cloudflare context and may not be typed with ADMIN_USERNAME/PASSWORD in some environments.
	const env = context.cloudflare?.env;
	console.log("[ADMIN LOGIN] ENV:", {
		JWT_SECRET: env?.JWT_SECRET ? "[set]" : "[missing]",
		ADMIN_USERNAME: env?.ADMIN_USERNAME ? "[set]" : "[missing]",
		ADMIN_PASSWORD: env?.ADMIN_PASSWORD ? "[set]" : "[missing]",
	});
	const formData = await request.formData();
	const username = formData.get("username") as string;
	const password = formData.get("password") as string;
	const jwtSecret = env?.JWT_SECRET;

	// Provide clear error if JWT_SECRET is missing
	if (!jwtSecret) {
		return {
			success: false,
			error:
				"JWT_SECRET not configured. Please set JWT_SECRET in your environment variables.",
		};
	}

	// Use optional chaining to access potentially undefined properties
	const adminUsername =
		env && "ADMIN_USERNAME" in env ? (env.ADMIN_USERNAME as string) : undefined;
	const adminPassword =
		env && "ADMIN_PASSWORD" in env ? (env.ADMIN_PASSWORD as string) : undefined;

	if (!adminUsername || !adminPassword) {
		return {
			success: false,
			error:
				"Admin credentials not configured. Please set ADMIN_USERNAME and ADMIN_PASSWORD in your environment variables.",
		};
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
		error: "Invalid username or password",
	};
};

export default function LoginRoute() {
	// Use useActionData to get typed action data
	const actionData = useActionData<typeof action>();
	const [error, setError] = useState<string | null>(actionData?.error || null);

	// Always use actionData.error if present, else local error
	const effectiveError = actionData?.error ?? error;

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		const form = e.currentTarget;
		const username = form.username.value;
		const password = form.password.value;

		if (!username || !password) {
			e.preventDefault();
			setError("Username and password are required");
		} else {
			setError(null);
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
							{effectiveError && (
								<div className="rounded-md bg-red-100 border border-red-400 p-4 mb-4">
									<div className="flex items-center">
										<svg
											className="h-6 w-6 text-red-600 mr-2"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"
											/>
										</svg>
										<div>
											<h3 className="text-base font-semibold text-red-800">
												{effectiveError}
											</h3>
											{process.env.NODE_ENV === "development" && (
												<p className="mt-1 text-xs text-red-700">
													{effectiveError.includes("JWT_SECRET") &&
														"Tip: Add JWT_SECRET=your_secret to your .dev.vars file."}
													{effectiveError.includes("Admin credentials") &&
														"Tip: Add ADMIN_USERNAME and ADMIN_PASSWORD to your .dev.vars file."}
												</p>
											)}
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

// No need for extra export as we're using default export directly