import { describe, beforeEach, it, expect } from "vitest";
import nock from "nock";
import { Octokit } from "../../src/index.ts";

describe("request 304s", () => {
  let octokit: Octokit;

  beforeEach(() => {
    octokit = new Octokit({
      baseUrl: "https://request-errors-test.com",
    });
  });

  it("304 etag", () => {
    nock("https://request-errors-test.com").get("/orgs/myorg").reply(304, "");

    return octokit.rest.orgs
      .get({ org: "myorg", headers: { "If-None-Match": "etag" } })
      .then(() => {
        expect.fail("should throw error");
      })
      .catch((error) => {
        expect(error.status).to.equal(304);
      });
  });

  it("304 last-modified", () => {
    nock("https://request-errors-test.com").get("/orgs/myorg").reply(304, "");

    return octokit.rest.orgs
      .get({
        org: "myorg",
        headers: {
          "If-Modified-Since": "Sun Dec 24 2017 22:00:00 GMT-0600 (CST)",
        },
      })
      .then(() => {
        expect.fail("should throw error");
      })
      .catch((error) => {
        expect(error.status).to.equal(304);
      });
  });
});
