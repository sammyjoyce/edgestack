import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { DefaultLogger } from "drizzle-orm/logger";
import { createRequestHandler } from "react-router";
import type {
  DurableObjectState,
  ExecutionContext,
} from "@cloudflare/workers-types";
import * as schema from "../database/schema";

/**
 * Durable Object exposing the Drizzle ORM database.
 * Incoming requests are forwarded to React Router with the database
 * instance attached to the load context for server-side routing.
 */
const serverBuildModuleResolver = () => import("virtual:react-router/server-build");
const requestHandler = createRequestHandler(serverBuildModuleResolver, import.meta.env.MODE);

export class DrizzleDurable implements DurableObject {
  private db: DrizzleD1Database<typeof schema>;
  constructor(private state: DurableObjectState, private env: Env) {
    this.db = drizzle(env.DB, {
      schema,
      logger: import.meta.env.MODE === "development" ? new DefaultLogger() : false,
    });
  }

  /**
   * Handles HTTP requests by forwarding them to React Router. The database
   * and environment are provided via the load context for loader functions.
   */
  async fetch(request: Request) {
    const loadContext = {
      cloudflare: { env: this.env, ctx: {} as Omit<ExecutionContext, "props"> },
      db: this.db,
    };
    return requestHandler(request, loadContext);
  }
}
