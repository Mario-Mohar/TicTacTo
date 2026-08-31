import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // The harness builds its own JSDOM per test, so node is the right base.
    environment: "node",
    include: ["tests/**/*.test.js"],
  },
});
