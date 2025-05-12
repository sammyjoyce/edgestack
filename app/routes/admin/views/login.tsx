import type { Route } from "./+types/login";
import type React from "react";
import { useState } from "react";
import adminThemeStylesheet from "../../../admin-theme.css?url";
import { Form, redirect } from "react-router";
import { FadeIn } from "~/routes/common/components/ui/FadeIn";
import {
	COOKIE_MAX_AGE,
	COOKIE_NAME,
	getSessionCookie,
	sign,
	verify,
} from "~/routes/common/utils/auth";
import { FormCard } from "../components/ui/FormCard";
import { PageHeader } from "../components/ui/PageHeader";
import { Alert } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { Field, Label } from "../components/ui/fieldset";
import { Input } from "../components/ui/input";
// Removed unused Route type import.

export const links: Route.LinksFunction = () => [
	{ rel: "stylesheet", href: adminThemeStylesheet },
];

const DEBUG = process.env.NODE_ENV !== "production";
type LoginActionData = { success: false; error: string } | { success: true };
export const action = async ({
	request,
	context,
	params,
}: Route.ActionArgs) => {
	try {
		const formData = await request.formData();
		const username = formData.get("username")?.toString() ?? "";
		const password = formData.get("password")?.toString() ?? "";
		const env = context.cloudflare?.env;
		const jwtSecret = env?.JWT_SECRET;
		if (DEBUG) {
			console.log("[ADMIN LOGIN] Accessing environment variables:", {
				adminUsernameDefined: !!env?.ADMIN_USERNAME,
				adminPasswordDefined: !!env?.ADMIN_PASSWORD,
				jwtSecretDefined: !!jwtSecret,
			});
		}
		if (!jwtSecret) {
			console.error("JWT_SECRET not configured.");
			return { success: false, error: "Server configuration error." };
		}
		const adminUsername = env?.ADMIN_USERNAME as string;
		const adminPassword = env?.ADMIN_PASSWORD as string;
		if (!adminUsername || !adminPassword) {
			console.error("Admin credentials not configured.");
			return { success: false, error: "Server configuration error." };
		}
		if (username === adminUsername && password === adminPassword) {
			const token = await sign(username, jwtSecret);
			const response = redirect("/admin");
			response.headers.set(
				"Set-Cookie",
				`${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${COOKIE_MAX_AGE}`,
			);
			return response;
		}
		return { success: false, error: "Invalid username or password" };
	} catch (error) {
		if (DEBUG) console.error("[ADMIN LOGIN] ActionError:", error);
		return { success: false, error: "Unexpected server error during login." };
	}
};
export const loader = async ({
	request,
	context,
	params,
}: Route.LoaderArgs) => {
	try {
		const sessionValue = getSessionCookie(request);
		const jwtSecret = context.cloudflare?.env?.JWT_SECRET;
		if (sessionValue && jwtSecret) {
			try {
				const isAuthenticated = await verify(sessionValue, jwtSecret);
				if (isAuthenticated) {
					return redirect("/admin");
				}
			} catch (e) {
				if (DEBUG) console.error("Login loader verification error:", e);
			}
		}
		return null;
	} catch (error) {
		if (DEBUG) console.error("[ADMIN LOGIN] Loader Error:", error);
		throw new Response(
			"Unexpected server error during login loader process. Please check logs for details.",
			{ status: 500 },
		);
	}
};
export default function Component({ actionData }: Route.ComponentProps) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	return (
		<FadeIn className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<FormCard>
				<PageHeader
					title="Admin Login"
					className="mb-2 text-center"
					actions={null}
				/>
				<Form method="post" className="mt-8 space-y-6">
					<input type="hidden" name="remember" defaultValue="true" />
					<Field>
						<Label htmlFor="username">Username</Label>
						<div className="mt-1">
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
						</div>
					</Field>
					<Field>
						<Label htmlFor="password">Password</Label>
						<div className="mt-1">
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
						</div>
					</Field>
					{actionData &&
						typeof actionData === "object" &&
						actionData !== null &&
						!actionData.success &&
						"error" in actionData && (
							<Alert variant="error" className="mb-4">
								{actionData.error}
							</Alert>
						)}
					<div>
						<Button type="submit" variant="solid" color="primary" className="w-full">
							Sign in
						</Button>
					</div>
				</Form>
			</FormCard>
		</FadeIn>
	);
}
