import path from "node:path";
import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	// map "~" → "./app"
	resolve: {
		alias: {
			"~": path.resolve(__dirname, "app"),
		},
	},

	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("@heroicons/react")) {
						return "heroicons";
					}
				},
			},
		},
	},
	plugins: [
		// point the plugin at your Cloudflare‐tsconfig so it picks up "~/*"
		tsconfigPaths({
			projects: [path.resolve(__dirname, "tsconfig.cloudflare.json")],
		}),
		reactRouter(),
		cloudflare({
			viteEnvironment: { name: process.env.CLOUDFLARE_ENV || "ssr" },
		}),
		tailwindcss(),
	],
});
