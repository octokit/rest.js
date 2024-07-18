import { describe, beforeEach, it, expect } from "vitest";
import { getInstance, type OctokitType } from "../util.ts";

describe.skip("api.github.com", () => {
  let octokit: OctokitType;

  beforeEach(() => {
    return getInstance("get-archive", {
      auth: "token 0000000000000000000000000000000000000001",
    }).then((instance) => {
      octokit = instance;
    });
  });

  it('octokit.rest.repos.downloadTarballArchive({owner: "octokit-fixture-org", repo: "get-archive"})', () => {
    return octokit.rest.repos
      .downloadTarballArchive({
        owner: "octokit-fixture-org",
        repo: "get-archive",
        ref: "main",
      })

      .then((response) => {
        // @ts-ignore https://github.com/octokit/types.ts/issues/211
        expect(response.data.byteLength).toEqual(172);
      });
  });
});
