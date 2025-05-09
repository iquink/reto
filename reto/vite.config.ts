import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
    css: {
      modules: {
        classNameStrategy: "non-scoped",
      },
    },
  },
  resolve: {
    alias: {
      "@router": path.resolve(__dirname, "src/router"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@components": path.resolve(__dirname, "src/components"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@context": path.resolve(__dirname, "src/context"),
      "@test-utils": path.resolve(__dirname, "src/test-utils"),
      "@store": path.resolve(__dirname, "src/store"),
      "@api": path.resolve(__dirname, "src/api"),
    },
  },
});
