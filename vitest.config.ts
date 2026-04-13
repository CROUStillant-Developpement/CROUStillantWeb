import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    exclude: ["node_modules", ".next"],
    environmentOptions: {
      // Neutral production-like URL so hostname-dependent components
      // don't accidentally activate in tests.
      url: "https://croustillant.menu",
    },
    coverage: {
      provider: "v8",
      include: ["src/lib/**", "src/store/**", "src/components/**"],
      exclude: ["src/components/ui/**", "**/*.test.*", "**/__tests__/**"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
