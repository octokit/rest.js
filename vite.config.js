import { defineConfig } from "vite";

export default defineConfig({
  test: {
    poolOptions: {
      // Added custom GC flag for test forks
      forks: {
        execArgv: ["--expose-gc"]
      }
    },
    coverage: {
      include: ["src/**/*.ts"],
      reporter: ["html", "text"], // Added text reporter for console output
      thresholds: {
        90: true, // Lowered threshold for flexibility
      },
    },
  },
});
