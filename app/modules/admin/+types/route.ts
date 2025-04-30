import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "~/database/schema";

// Define the AppLoadContext shape expected in Cloudflare Workers environment
export interface AppLoadContext {
  db: DrizzleD1Database<typeof schema>;
  cloudflare: {
    env: {
      JWT_SECRET?: string;
      ADMIN_USERNAME?: string;
      ADMIN_PASSWORD?: string;
      ASSETS_BUCKET?: string;
      LUSH_R2_BUCKET?: string;
      PUBLIC_R2_URL?: string;
      [key: string]: string | undefined;
    };
    ctx: any; // Execution context for Cloudflare environment
  };
  [key: string]: any;
}

// Extended Router types to include our AppLoadContext
export namespace Route {
  export interface LoaderArgs extends LoaderFunctionArgs {
    context: AppLoadContext;
  }

  export interface ActionArgs extends ActionFunctionArgs {
    context: AppLoadContext;
  }
}
