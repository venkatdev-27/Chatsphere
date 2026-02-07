import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    plugins: [react()],

    // ✅ Dev server (local only)
    server: !isProduction
      ? {
          host: "0.0.0.0",
          port: 5173,
          hmr: true,
        }
      : undefined,

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },

    build: {
      outDir: "dist",
      emptyOutDir: true,
    },
  };
});
