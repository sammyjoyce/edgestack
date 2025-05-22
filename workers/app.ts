import { createRequestHandler } from "react-router";
import { logger, logError } from "../utils/logger";
const serverBuildModuleResolver = () => {
        return import("virtual:react-router/server-build");
};
const requestHandler = createRequestHandler(
        serverBuildModuleResolver,
        import.meta.env.MODE,
);
const typeMap: Record<string, string> = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        webp: "image/webp",
        gif: "image/gif",
        svg: "image/svg+xml",
};
export default {
        async fetch(request, env, ctx) {
                if (import.meta.env.MODE !== "production") {
                        logger.debug("worker invoked", { url: request.url });
                }
                const url = new URL(request.url);
                if (url.pathname.startsWith("/assets/")) {
                        const key = url.pathname.slice("/assets/".length);
			if (!key) {
				return new Response("Missing asset key", { status: 400 });
			}
			try {
				const object = await env.ASSETS_BUCKET.get(key);
				if (!object) {
					return new Response("Not found", { status: 404 });
				}
                                const ext = key.split(".").pop()?.toLowerCase() as
                                        | keyof typeof typeMap
                                        | undefined;
                                const contentType =
                                        object.httpMetadata?.contentType ||
                                        (ext && typeMap[ext]) ||
					"application/octet-stream";
				return new Response(object.body, {
					status: 200,
					headers: {
						"Content-Type": contentType,
						"Cache-Control": "public, max-age=86400, immutable",
						"Access-Control-Allow-Origin": "*",
					},
				});
                        } catch (err) {
                                logError("asset fetch failed", err, { key });
                                return new Response("Error fetching asset", { status: 500 });
                        }
		}
                const isRead = request.method === "GET";
                const id = isRead
                        ? env.DRIZZLE_READ_DO.idFromName("db-read-instance")
                        : env.DRIZZLE_WRITE_DO.idFromName("db-write-instance");
                const stub = isRead
                        ? env.DRIZZLE_READ_DO.get(id)
                        : env.DRIZZLE_WRITE_DO.get(id);
                return stub.fetch(request);
        },
} satisfies ExportedHandler<Env>;
