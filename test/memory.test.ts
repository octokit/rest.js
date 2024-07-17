import { Octokit } from "../src/index.ts";
import { describe, it, expect } from "vitest";

const skip = !global.gc;

const TestOctokit = Octokit.plugin((octokit) => {
  // @ts-expect-error skip sending requests altogether
  octokit.hook.wrap("request", () => null);
});

describe("memory leaks (relax, tests run slow)", { skip }, function () {
  it("creating many instances", async () => {
    // Initialize first time for more realistic heap size after
    {
      const octokit = new TestOctokit();
      await octokit.request("/");
    }

    // force a garbage collection for good measures
    global.gc!();

    const preHeapSize = process.memoryUsage().heapUsed;
    for (let i = 0; i < 100000; i++) {
      const octokit = new TestOctokit();
      await octokit.request("/");
    }

    // force a garbage collection to check if there are any memory leaks
    global.gc!();

    const postHeapSize = process.memoryUsage().heapUsed;
    expect(postHeapSize).toBeLessThan(preHeapSize * 1.025);
  }, 30000);

  it("one instance, many requests", async () => {
    const octokit = new TestOctokit();
    global.gc!();

    // Initialize first time for more realistic heap size after
    {
      await octokit.request("/");
    }
    const preHeapSize = process.memoryUsage().heapUsed;
    for (let i = 0; i < 100000; i++) {
      await octokit.request("/");
    }

    // force a garbage collection to check if there are any memory leaks
    global.gc!();

    const postHeapSize = process.memoryUsage().heapUsed;
    expect(postHeapSize).toBeLessThan(preHeapSize * 1.025);
  }, 30000);
});
