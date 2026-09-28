import { describe, beforeEach, it, expect } from "vitest";
import nock from "nock";
import { Octokit } from "../../src/index.ts";

// The "get-content" scenario from "@octokit/fixtures" cannot be replayed for
// this test. It records the root directory listing as
// "GET /repos/octokit-fixture-org/hello-world/contents/" (with a trailing
// slash), but "@octokit/endpoint" strips the trailing slash when `path` is
// empty (octokit/endpoint.js#455), so the client now requests
// "GET /repos/octokit-fixture-org/hello-world/contents". The fixtures are
// auto-generated upstream, so the two requests are mocked here instead.
describe("api.github.com", () => {
  let octokit: Octokit;

  beforeEach(() => {
    octokit = new Octokit({
      auth: "token 0000000000000000000000000000000000000001",
    });
  });

  it("octokit.rest.repos.getContent()", () => {
    nock("https://api.github.com")
      .get("/repos/octokit-fixture-org/hello-world/contents")
      .reply(200, [
        {
          name: "README.md",
          path: "README.md",
          sha: "93a078d1c3f76aa1ca11def8f882a06df1d4a01b",
          size: 13,
          url: "https://api.github.com/repos/octokit-fixture-org/hello-world/contents/README.md?ref=master",
          html_url:
            "https://github.com/octokit-fixture-org/hello-world/blob/master/README.md",
          git_url:
            "https://api.github.com/repos/octokit-fixture-org/hello-world/git/blobs/93a078d1c3f76aa1ca11def8f882a06df1d4a01b",
          download_url:
            "https://raw.githubusercontent.com/octokit-fixture-org/hello-world/master/README.md",
          type: "file",
        },
      ])
      .get("/repos/octokit-fixture-org/hello-world/contents/README.md")
      .matchHeader("accept", "application/vnd.github.v3.raw")
      .reply(200, "# hello-world");

    return octokit.rest.repos
      .getContent({
        owner: "octokit-fixture-org",
        repo: "hello-world",
        path: "",
      })

      .then((response) => {
        if (!Array.isArray(response.data)) {
          throw `folder response expected`;
        }

        expect(response.data.length).toEqual(1);

        return octokit.rest.repos.getContent({
          owner: "octokit-fixture-org",
          repo: "hello-world",
          path: "README.md",
          headers: {
            accept: "application/vnd.github.v3.raw",
          },
        });
      })

      .then((response) => {
        expect(response.data).toEqual("# hello-world");
      });
  });
});
