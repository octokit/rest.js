import { defineConfig } from "vite";

export default defineConfig({
  test: {
    execArgv: ["--expose-gc"],
    coverage: {
      include: ["src/**/*.ts"],
      reporter: ["html"],
      thresholds: {
        100: true,
      },
    },
  },
});
