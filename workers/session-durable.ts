import type { DurableObjectState } from "@cloudflare/workers-types";

interface SessionRecord {
  username: string;
  createdAt: number;
}

/**
 * TTL for stored session records in seconds.
 * Sessions expire automatically after two hours.
 */
const SESSION_TTL = 60 * 60 * 2;

/**
 * Durable Object that manages basic session data using the built-in
 * key/value storage.
 */
export class SessionDurable implements DurableObject {
  constructor(private state: DurableObjectState, private env: Env) {}

  /**
   * Dispatches CRUD-style operations based on the request method.
   */
  async fetch(request: Request): Promise<Response> {
    const id = new URL(request.url).pathname.slice(1);
    if (!id) return new Response("Bad Request", { status: 400 });
    switch (request.method) {
      case "PUT": {
        const data: SessionRecord = await request.json();
        await this.state.storage.put(id, data, { expirationTtl: SESSION_TTL });
        return new Response("OK");
      }
      case "GET": {
        const data = await this.state.storage.get<SessionRecord>(id);
        if (!data) return new Response("Not Found", { status: 404 });
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      case "DELETE": {
        await this.state.storage.delete(id);
        return new Response("OK");
      }
      default:
        return new Response("Method Not Allowed", { status: 405 });
    }
  }
}
