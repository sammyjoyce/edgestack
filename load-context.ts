import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "./database/schema.js";
import type { ExecutionContext } from "@cloudflare/workers-types";
import type { AppLoadContext } from "react-router";

declare namespace Cloudflare {
  interface Env {
    CLOUDFLARE_ACCOUNT_ID: string;
    CLOUDFLARE_DATABASE_ID: string;
    main: string;
    ASSETS_BUCKET: unknown;
    DB: D1Database;
    JWT_SECRET: string; // <-- Add your custom env var here
  }
}
type Env = Cloudflare.Env;

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
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