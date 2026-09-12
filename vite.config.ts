import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { cloudflare } from "@cloudflare/vite-plugin"

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  // The Cloudflare plugin runs worker/index.ts in workerd for `vite dev`, so the
  // /api/* routes behave the same locally as they do when deployed. It stays out
  // of the production build: it emits the client to dist/client, but the Worker
  // serves its assets from dist/, so index.html and /assets/* would 404.
  plugins: [
    react(),
    tailwindcss(),
    ...(command === "serve" && !isPreview && !process.env.VITEST ? [cloudflare()] : []),
  ],
  server: {
    watch: { usePolling: true },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}))
