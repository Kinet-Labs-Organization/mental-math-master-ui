import path from "path"
import { fileURLToPath } from 'url'
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

// https://vite.dev/config/
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const env = loadEnv(process.env.NODE_ENV as string, process.cwd(), '');

export default defineConfig({
  mode: process.env.NODE_ENV,
  plugins: [react(), tailwindcss()],
  server: {
    port: env.VITE_PORT ? Number(env.VITE_PORT) : 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
