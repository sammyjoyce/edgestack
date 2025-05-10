import React from "react";
import { redirect } from "react-router";
import { COOKIE_NAME } from "~/routes/common/utils/auth";
// Import generated types from the correct path
import type { Route } from "./+types/logout"; // Ensure this path is correct

// Use the generated type with the proper format
async function handleLogout(): Promise<Response> {
	// Create response with typed redirect to login
	const response = redirect("/admin/login");

	// Clear session cookie
	response.headers.set(
		"Set-Cookie",
		`${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
	);

	return response;
}

export const loader = async (): Promise<Response> => {
	return handleLogout();
};

export async function action({
	request,
	context,
}: Route.ActionArgs): Promise<Response> {
	// Although logout is typically a GET or a POST to an action,
	// if action is called, we perform the same logout logic.
	return handleLogout();
}

// No default component export needed as loader/action will always redirect.
