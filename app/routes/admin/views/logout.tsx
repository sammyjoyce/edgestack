import type { Route } from "./+types/logout";
import { redirect } from "react-router";
import { COOKIE_NAME, getSessionCookie, verify } from "~/routes/common/utils/auth";

async function handleLogout(request: Request, env: CloudflareEnvironment): Promise<Response> {
        const sessionValue = getSessionCookie(request);
        if (sessionValue) {
                const sessionId = await verify(sessionValue, env.JWT_SECRET);
                if (sessionId) {
                        const stub = env.SESSION_DO.get(env.SESSION_DO.idFromName(sessionId));
                        await stub.fetch(`https://session/${sessionId}`, { method: "DELETE" });
                }
        }
        const response = redirect("/admin/login");
        response.headers.set(
                "Set-Cookie",
                `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
        );
        return response;
}

export const loader = async ({ request, context }: Route.LoaderArgs) => {
        return handleLogout(request, context.cloudflare.env);
};

export async function action({ request, context }: Route.ActionArgs) {
        return handleLogout(request, context.cloudflare.env);
}
