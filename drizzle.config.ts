// .env is only required for local CLI tools (e.g., Drizzle migrations). All runtime config and secrets are managed via wrangler.toml and Wrangler secrets.
import "dotenv/config";
import { defineConfig } from "drizzle-kit";
export default defineConfig({
	schema: "./database/schema.ts", 
	out: "./migrations",
	dialect: "sqlite",
	driver: "d1-http", // Explicitly set for D1 HTTP API interaction
	dbCredentials: {
		accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
		databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
		token: process.env.CLOUDFLARE_D1_TOKEN!,
	},
});
