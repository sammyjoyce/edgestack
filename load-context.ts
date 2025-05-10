import type { ExecutionContext } from "@cloudflare/workers-types";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { DefaultLogger } from "drizzle-orm/logger";
import type { AppLoadContext } from "react-router";
import * as schema from "./database/schema";
declare global {
	interface CloudflareEnvironment extends Env {
		ADMIN_USERNAME: string;
		ADMIN_PASSWORD: string;
		ASSETS_BUCKET: R2Bucket;
		PUBLIC_R2_URL: string;
	}
}
declare module "react-router" {
	export interface AppLoadContext {
		cloudflare: {
			env: CloudflareEnvironment;
			ctx: Omit<ExecutionContext, "props">;
		};
		db: DrizzleD1Database<typeof schema>;
	}
}
type GetLoadContextArgs = {
	request: Request;
	context: Pick<AppLoadContext, "cloudflare">;
};
export function getLoadContext({ context }: GetLoadContextArgs) {
	const db = drizzle(context.cloudflare.env.DB, {
		schema,
		// Enable logger only in development mode
		// Assuming import.meta.env.DEV is available or use an equivalent check
		logger:
			context.cloudflare.env.ENVIRONMENT === "development"
				? new DefaultLogger()
				: false,
	});
	return {
		cloudflare: context.cloudflare,
		db,
	};
}
