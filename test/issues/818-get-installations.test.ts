import { describe, it } from "vitest";
import nock from "nock";
import { Octokit } from "../../src/index.ts";

describe("https://github.com/octokit/rest.js/issues/818", () => {
  it("octokit.rest.apps.listInstallations()", () => {
    nock("https://api.github.com").get("/app/installations").reply(200, []);

    const octokit = new Octokit();
    return octokit.rest.apps.listInstallations();
  });
});
