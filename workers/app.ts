import type { ExecutionContext } from "@cloudflare/workers-types"; // Ensure ExecutionContext is imported
/// <reference types="../worker-configuration" />
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { createRequestHandler } from "react-router";
import * as schema from "../database/schema";
// AppLoadContext is augmented globally by `load-context.ts`.

const serverBuildModuleResolver = () => {
	// This is a Vite-specific virtual module. For typechecking outside Vite,
	// you might need to provide a shim or ensure this file is only typechecked
	// in an environment where Vite's types are available.
	// @ts-expect-error - This will be resolved by Vite at build time
	return import("virtual:react-router/server-build");
};

const requestHandler = createRequestHandler(
	serverBuildModuleResolver,
	import.meta.env.MODE,
);

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		// 1. Proxy /assets/* requests to R2 with cache headers
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
				// Guess content type from extension (simple heuristic)
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
					object.httpMetadata?.contentType || // Prefer R2 metadata
					(ext && typeMap[ext]) || // Fallback to extension map
					"application/octet-stream"; // Default
				return new Response(object.body, {
					status: 200,
					headers: {
						"Content-Type": contentType,
						"Cache-Control": "public, max-age=86400, immutable", // 1 day
						"Access-Control-Allow-Origin": "*",
					},
				});
			} catch (err) {
				return new Response("Error fetching asset", { status: 500 });
			}
		}
		// 2. All other requests go to React Router
		const db = drizzle(env.DB, { schema });
		const loadContext = {
			cloudflare: { env, ctx: ctx as Omit<ExecutionContext, "props"> },
			db,
		};
		return requestHandler(request, loadContext);
	},
} satisfies ExportedHandler<Env>;
