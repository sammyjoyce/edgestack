import { vitePluginViteNodeMiniflare } from "@hiogawa/vite-node-miniflare";
import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ isSsrBuild }) => ({
	build: {
		rollupOptions: isSsrBuild
			? {
					input: "./workers/app.ts",
				}
			: undefined,
	},
	ssr: {
		target: "webworker",
		noExternal: true,
		resolve: {
			conditions: ["workerd", "browser"],
		},
		optimizeDeps: {
			include: [
				"react",
				"react/jsx-runtime",
				"react/jsx-dev-runtime",
				"react-dom",
				"react-dom/server",
				"react-router",
			],
		},
	},
	plugins: [
		vitePluginViteNodeMiniflare({
			entry: "./workers/app.ts",
			miniflareOptions: (options) => {
				options.compatibilityDate = "2024-11-18";
				options.compatibilityFlags = ["nodejs_compat"];
			},
		}),
		reactRouter(),
		tsconfigPaths(),
		  tailwindcss(),
	],
}));
