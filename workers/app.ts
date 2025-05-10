import type { ExecutionContext } from "@cloudflare/workers-types"; 
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { createRequestHandler } from "react-router";
import * as schema from "../database/schema";
const serverBuildModuleResolver = () => {
	return import("virtual:react-router/server-build");
};
const requestHandler = createRequestHandler(
	serverBuildModuleResolver,
	import.meta.env.MODE,
);
export default {
	async fetch(request, env, ctx) {
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
		const db = drizzle(env.DB, { schema });
		const loadContext = {
			cloudflare: { env, ctx: ctx as Omit<ExecutionContext, "props"> },
			db,
		};
		return requestHandler(request, loadContext);
	},
} satisfies ExportedHandler<Env>;
