import React from "react";
import { redirect } from "react-router";
import { COOKIE_NAME } from "~/routes/common/utils/auth";
import type { Route } from "./+types/logout"; 
async function handleLogout(): Promise<Response> {
	const response = redirect("/admin/login");
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
	return handleLogout();
}
