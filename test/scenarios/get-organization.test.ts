import { describe, beforeEach, it, expect } from "vitest";
import { getInstance, type OctokitType } from "../util.ts";

describe("api.github.com", () => {
  let octokit: OctokitType;
  beforeEach(() => {
    return getInstance("get-organization", {
      auth: "token 0000000000000000000000000000000000000001",
    }).then((instance) => {
      octokit = instance;
    });
  });

  it('octokit.rest.orgs.get({owner: "octokit-fixture-org"})', () => {
    return octokit.rest.orgs
      .get({ org: "octokit-fixture-org" })

      .then((response) => {
        expect(response.data.login).toEqual("octokit-fixture-org");
      });
  });
});
