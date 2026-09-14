import path from "path"
import { defineConfig, mergeConfig } from "vitest/config"
import viteConfig from "./vite.config"

// vite.config.ts exports a function so it can keep the Cloudflare plugin out of
// the production build. Evaluate it for a build here, where the plugin is not
// wanted either.
const baseConfig = typeof viteConfig === "function"
  ? viteConfig({ command: "build", mode: "test" })
  : viteConfig

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      environment: "node",
      include: ["src/**/*.test.{ts,tsx}", "worker/**/*.test.ts"],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }),
)
