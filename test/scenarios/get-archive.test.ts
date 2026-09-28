import { describe, beforeEach, it, expect } from "vitest";
import nock from "nock";
import { Octokit } from "../../src/index.ts";

// The "get-archive" scenario from "@octokit/fixtures" cannot be replayed for
// this test. It is the only scenario whose `reqheaders` pin
// `accept-encoding: "gzip, compress, deflate, br"`, which nock enforces as an
// exact match. That value was recorded in 2017 and no current Node.js fetch
// client sends it (undici sends `accept-encoding: gzip, deflate`), so the
// request never matches and the fixtures server answers with
// `Nock: No match for request`. The fixtures are auto-generated upstream, so
// the redirect to codeload.github.com is mocked here instead.
describe("api.github.com", () => {
  let octokit: Octokit;

  const REDIRECT_URL =
    "https://codeload.github.com/octokit-fixture-org/get-archive/legacy.tar.gz/refs/heads/main";
  const TARBALL = Buffer.from(
    "1f8b0800000000000003f248cdc9c90307114c7c4b1c0c0a1e2c4e8e2c2c9e0a0000000000ffff0000000000000000",
    "hex",
  );

  beforeEach(() => {
    octokit = new Octokit({
      auth: "token 0000000000000000000000000000000000000001",
    });
  });

  it('octokit.rest.repos.downloadTarballArchive({owner: "octokit-fixture-org", repo: "get-archive"})', () => {
    nock("https://api.github.com")
      .get("/repos/octokit-fixture-org/get-archive/tarball/main")
      .reply(302, "", { location: REDIRECT_URL });
    nock("https://codeload.github.com")
      .get("/octokit-fixture-org/get-archive/legacy.tar.gz/refs/heads/main")
      .reply(200, TARBALL, { "content-type": "application/x-gzip" });

    return octokit.rest.repos
      .downloadTarballArchive({
        owner: "octokit-fixture-org",
        repo: "get-archive",
        ref: "main",
      })

      .then((response) => {
        // @ts-ignore https://github.com/octokit/types.ts/issues/211
        expect(response.data.byteLength).toEqual(TARBALL.byteLength);
        expect(response.url).toEqual(REDIRECT_URL);
        expect(response.headers["content-type"]).toEqual("application/x-gzip");
      });
  });
});
