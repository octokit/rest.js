// TODO: we don't currently run this test as part of our CI
// as installing leakage broke for recent Node versions.
// We are looking for an alternative.
import { iterate } from "leakage-node18";
import { Octokit } from "../src/index.ts";
import { describe, it } from "vitest";

const TestOctokit = Octokit.plugin((octokit) => {
  // skip sending requests altogether
  octokit.hook.wrap("request", () => null);
});

describe("memory leaks (relax, tests run slow)", function () {
  it("creating many instances", () => {
    return iterate.async(() => {
      const octokit = new TestOctokit();

      return octokit.request("/");
    });
  }, 30000);

  it("one instance, many requests", () => {
    const octokit = new TestOctokit();

    return iterate.async(() => {
      return octokit.request("/");
    });
  }, 30000);
});
