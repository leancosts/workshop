import { existsSync } from "node:fs";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// O .env fica na raiz de greenfield/. O npm roda o script na pasta deste app.
if (existsSync("../../.env")) process.loadEnvFile("../../.env");

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // /api/health chega na API como /health.
      "/api": {
        target: `http://localhost:${process.env.PORT ?? 3000}`,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
