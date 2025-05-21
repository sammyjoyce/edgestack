# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

## Features

- 🚀 Server-side rendering
- ⚡ Fast development with Bun and Vite️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Prerequisites

Before running the project you need the following tools:

- [**Bun**](https://bun.sh/) runtime for running scripts and the development server.
- [**Wrangler**](https://developers.cloudflare.com/workers/wrangler/) for deploying and testing Cloudflare Workers.

Install Bun and Wrangler globally if you don't already have them:

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Install Wrangler
bun add -g wrangler
```

Next, authenticate Wrangler with your Cloudflare account:

```bash
wrangler login
```

Copy `.dev.vars` and adjust the values for local development:

```bash
cp .dev.vars .dev.vars.local
```

Update `wrangler.jsonc` with your account and database IDs before deploying.

## Getting Started

### Installation

Install the dependencies:

```bash
bun install
```

### Development

Start the development server with HMR:

```bash
bun run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
bun run build
```

## Deployment

Deployment is done using the Wrangler CLI.

To deploy directly to production:

```sh
bun wrangler deploy
```

To deploy a preview URL:

```sh
bun wrangler versions upload
```

You can then promote a version to production after verification or roll it out progressively.

```sh
bun wrangler versions deploy
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

## Code Style

Consistent formatting keeps the project easy to read and maintain. Format and lint your changes with [Biome](https://biomejs.dev/):

```bash
bun run format
```

For broader styling guidance, see [docs/tigerstyle.md](docs/tigerstyle.md) and [.junie/guidelines.md](.junie/guidelines.md).

## Services and Business Logic

- **Separation of Concerns**: Place business logic, API calls, or complex data transformations in dedicated service files (for example `app/routes/home/services.ts`).
- **Pure Functions**: Whenever possible, implement service functions as pure functions to make them easier to test and reason about.
- **Error Handling**: Services should clearly communicate failures, either by throwing specific error types or by returning error objects.

## Project Structure

- `app/` - Route modules and components for the React Router app.
- `workers/` - Cloudflare Worker entry point that serves the app and static assets.
- `database/` - Drizzle ORM schema and database helpers.
- `migrations/` - SQL migrations generated with drizzle-kit.
- `seeds/` - Initial data for the D1 database.
- `public/` - Static files served without processing.
- `scripts/` - Utility scripts like database seeds.
- `docs/` - Additional project documentation.
- See [`docs/cloudflare.md`](docs/cloudflare.md) for details on Workers, Durable Objects, D1, and R2.

## Next Steps

Check the docs for React Router, Cloudflare Workers, and Drizzle ORM. Reviewing `database/schema.ts` and `wrangler.jsonc` will help you understand how the app ties together.

---

Built with ❤️ using React Router.
