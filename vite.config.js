import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  esbuild: {
    drop: process === "production" ? ["console", "debugger"] : [],
  },
  plugins: [react()],
  server: {
    host: true,
    watch: {
      usePolling: true,
    },
  },
});
