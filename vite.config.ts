import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  ssr: {
    noExternal: [
      '@heroicons/react'
    ]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@heroicons/react')) {
            return 'heroicons';
          }
        },
      },
    },
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    reactRouter({
      appDirectory: false, // Explicitly disable file-system routing via plugin
      // Another attempt: tell it where the routes config is, maybe it stops scanning elsewhere
      // routesConfig: "./app/routes.ts", 
    }),
    tsconfigPaths(),
  ],
});