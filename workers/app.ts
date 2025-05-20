import { createRequestHandler } from "react-router";
const serverBuildModuleResolver = () => {
        return import("virtual:react-router/server-build");
};
const requestHandler = createRequestHandler(
        serverBuildModuleResolver,
        import.meta.env.MODE,
);
export default {
        async fetch(request, env, ctx) {
                console.log("WORKER INVOKED", new Date().toISOString(), request.url);
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
				const typeMap: Record<string, string> = {
					jpg: "image/jpeg",
					jpeg: "image/jpeg",
					png: "image/png",
					webp: "image/webp",
					gif: "image/gif",
					svg: "image/svg+xml",
				};
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
				return new Response("Error fetching asset", { status: 500 });
			}
		}
                const id = env.DRIZZLE_DO.idFromName("db-instance");
                const stub = env.DRIZZLE_DO.get(id);
                return stub.fetch(request);
        },
} satisfies ExportedHandler<Env>;
