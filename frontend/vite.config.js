import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 1221;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
    }),
  ],
  base: "/",
  build: {
    outDir: "build",
    sourcemap: false,
  },
  server: {
    port: port,
    strictPort: true,
    host: true,
  },
});