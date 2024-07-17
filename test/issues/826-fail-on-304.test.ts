import { describe, it, expect } from "vitest";
import nock from "nock";
import { Octokit } from "../../src/index.ts";

describe("https://github.com/octokit/rest.js/issues/826", () => {
  it("throws error on 304 responses", () => {
    nock("https://request-errors-test.com")
      .get("/orgs/octokit/repos?type=public")
      .reply(304, "");

    const octokit = new Octokit({
      baseUrl: "https://request-errors-test.com",
    });
    return octokit.rest.repos
      .listForOrg({
        org: "octokit",
        type: "public",
      })
      .then(() => {
        expect.fail("should throw error");
      })
      .catch((error) => {
        expect(error.status).to.equal(304);
      });
  });
});
