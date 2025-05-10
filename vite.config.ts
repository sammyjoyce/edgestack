import path from "node:path";
import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
export default defineConfig({
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
