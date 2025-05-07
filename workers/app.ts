import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import { createRequestHandler } from "react-router";
import * as schema from "../database/schema";
import type { ExecutionContext } from "@cloudflare/workers-types"; // Ensure ExecutionContext is imported
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
  import.meta.env.MODE
);

export default {
  async fetch(request, env, ctx) {
    const db = drizzle(env.DB, { schema });

    // The type for AppLoadContext should be picked up from `load-context.ts`
    const loadContext = {
      cloudflare: { env, ctx: ctx as Omit<ExecutionContext, "props"> }, // Cast ctx to match stricter type from load-context.ts
      db,
    };

    return requestHandler(request, loadContext);
  },
} satisfies ExportedHandler<Env>;
