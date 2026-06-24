import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    // Mirror the tsconfig "@/*" path alias so tests can import route handlers
    // that use "@/lib/..." imports.
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    // Discover both the engine golden tests and the app/ route tests.
    include: ["lib/**/*.test.ts", "app/**/*.test.ts"],
  },
});
