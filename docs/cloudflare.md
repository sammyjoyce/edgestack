# Cloudflare Features Overview

This project demonstrates how to combine several Cloudflare services together in a single Workers application. The key pieces are Workers, Durable Objects, D1, and R2.

## Workers

The Worker entry point lives in `workers/app.ts`. It serves static files from an R2 bucket and routes all other requests through Durable Objects. Wrangler is used for local development and deployment.

To start the Worker locally:

```bash
bun run dev
```

### Deployment

Use Wrangler to deploy either a preview version or directly to production:

```bash
bun wrangler deploy          # Deploy to the default environment
bun wrangler versions upload # Upload a preview version
bun wrangler versions deploy # Promote a version to production
```

## Durable Objects

Durable Objects provide stateful logic. This template includes three examples:

- `SessionDurable` in `workers/session-durable.ts` – a basic key/value store for session data.
- `DrizzleReadDurable` in `workers/drizzle-read-durable.ts` – handles read-only application requests.
- `DrizzleWriteDurable` in `workers/drizzle-write-durable.ts` – handles write operations and exposes the D1 database via Drizzle ORM.

Both objects are registered in `wrangler.jsonc` so they are created automatically when you deploy.

## D1 Database

D1 is Cloudflare's managed SQLite service. Database schema and seed data live in the `database/` and `seeds/` folders. The sample `seed-database.sh` script can populate a local or remote D1 instance.

Common tasks:

```bash
bun run db:generate   # Generate types and migrations
bun run db:migrate    # Apply migrations locally
bun run db:migrate-production # Apply migrations to production
```

## R2 Object Storage

Static assets are stored in an R2 bucket. The Worker fetches files from the bucket when requests begin with `/assets/`. Set the `PUBLIC_R2_URL` secret for your account so that public asset links resolve correctly once deployed.

---

Check `wrangler.jsonc` for all bindings and environment variables. Feel free to customise these settings for your own project.
