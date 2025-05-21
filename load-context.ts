import type { ExecutionContext } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/d1";
import { DefaultLogger } from "drizzle-orm/logger";
import type { AppLoadContext } from "react-router";
import * as schema from "./database/schema";
import type { AppDatabase } from "~/database";
import { CmsClient } from "~/services/cms.client";
declare global {
	interface CloudflareEnvironment extends Env {
		ADMIN_USERNAME: string;
		ADMIN_PASSWORD: string;
                ASSETS_BUCKET: R2Bucket;
                PUBLIC_R2_URL: string;
                DRIZZLE_WRITE_DO: DurableObjectNamespace;
                DRIZZLE_READ_DO: DurableObjectNamespace;
                SESSION_DO: DurableObjectNamespace;
        }
}
declare module "react-router" {
        export interface AppLoadContext {
                cloudflare: {
                        env: CloudflareEnvironment;
                        ctx: Omit<ExecutionContext, "props">;
                };
                db: AppDatabase;
                cms: CmsClient;
        }
}
type GetLoadContextArgs = {
	request: Request;
	context: Pick<AppLoadContext, "cloudflare">;
};
export function getLoadContext({ context }: GetLoadContextArgs) {
        const env = context.cloudflare.env;
        if (["CHANGE_ME", "admin", "dev", "password"].includes(env.ADMIN_PASSWORD)) {
                console.warn(
                        "[SECURITY] ADMIN_PASSWORD is set to an insecure default value. Please update this secret.",
                );
        }
        const db = drizzle(env.DB, {
                schema,
                // Enable logger only in development mode
                logger:
                        import.meta.env.MODE === "development" // Vite standard for mode
                                ? new DefaultLogger()
                                : false,
        });
        const cms = new CmsClient(db);
        return {
                cloudflare: context.cloudflare,
                db,
                cms,
        };
}
