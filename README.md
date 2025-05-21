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
