import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    // same baseline as the prod pod, whatever the developer's own time zone is
    env: { TZ: "UTC" },
  },
});
