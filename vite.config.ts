import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: { usePolling: true },
    proxy: {
      "/api/smogon": {
        target: "https://www.smogon.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/smogon/, "/stats"),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
