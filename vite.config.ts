import { defineConfig } from "vite";
import { analyzer } from "vite-bundle-analyzer";
import viteReact from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    viteReact(),
    process.env.ANALYZE_DEBUG ? analyzer() : null,
    tsconfigPaths(),
  ],
  test: {
    include: ["**/*.test.tsx"],
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./setupTests.ts"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
