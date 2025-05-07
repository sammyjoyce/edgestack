import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "./database/schema";
import type { ExecutionContext } from "@cloudflare/workers-types";
import type { AppLoadContext } from "react-router";

declare global {
  interface CloudflareEnvironment extends Env {
    ADMIN_USERNAME?: string;
    ADMIN_PASSWORD?: string;
    ASSETS_BUCKET: R2Bucket; // Assuming ASSETS_BUCKET is always expected
    PUBLIC_R2_URL?: string;
    // JWT_SECRET is already in worker-configuration.d.ts Env
  }
}

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: CloudflareEnvironment; // This will now include the above
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
  const db = drizzle(context.cloudflare.env.DB, { schema });

  return {
    cloudflare: context.cloudflare,
    db,
  };
}
