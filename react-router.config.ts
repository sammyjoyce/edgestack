import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: false, // Attempt to disable file-system routing
  ssr: true,
  future: {
    unstable_viteEnvironmentApi: true,
  },
} satisfies Config;