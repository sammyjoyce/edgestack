import type { Route } from "./+types/logout";
import { redirect } from "react-router";
import { COOKIE_NAME } from "~/routes/common/utils/auth";

async function handleLogout(): Promise<Response> {
	const response = redirect("/admin/login");
	response.headers.set(
		"Set-Cookie",
		`${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
	);
	return response;
}

export const loader = async ({
	request,
	context,
	params,
}: Route.LoaderArgs) => {
	return handleLogout();
};

export async function action({ request, context, params }: Route.ActionArgs) {
	return handleLogout();
}
