import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { DefaultLogger } from "drizzle-orm/logger";
import { createRequestHandler } from "react-router";
import type {
  DurableObjectState,
  ExecutionContext,
} from "@cloudflare/workers-types";
import * as schema from "../database/schema";

const serverBuildModuleResolver = () =>
  import("virtual:react-router/server-build");
const requestHandler = createRequestHandler(
  serverBuildModuleResolver,
  import.meta.env.MODE,
);

/**
 * Durable Object that serves as the entry point for all dynamic
 * requests. It wires up React Router with a Drizzle ORM database
 * connection so loaders and actions can access the database.
 */

export class DrizzleReadDurable implements DurableObject {
  private db: DrizzleD1Database<typeof schema>;
  constructor(private state: DurableObjectState, private env: Env) {
    this.db = drizzle(env.DB, {
      schema,
      logger: import.meta.env.MODE === "development" ? new DefaultLogger() : false,
    });
  }

  /**
   * Handles all requests forwarded to this Durable Object by
   * invoking the React Router request handler with a database-aware
   * load context.
   */
  async fetch(request: Request) {
    const loadContext = {
      cloudflare: { env: this.env, ctx: {} as Omit<ExecutionContext, "props"> },
      db: this.db,
    };
    return requestHandler(request, loadContext);
  }
}
