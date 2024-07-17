import { describe, it, expect } from "vitest";
import { Octokit } from "../../src/index.ts";

describe("https://github.com/octokit/rest.js/issues/1553 is deprecated and removed", () => {
  it("octokit.rest.teams.removeMember() is deprecated and removed", () => {
    const octokit = new Octokit();
    // @ts-expect-error the function is deprecated and removed
    expect(typeof octokit.rest.teams.removeMember).to.equal("undefined");
  });
  it("octokit.rest.teams.removeMembership() is deprecated and removed", () => {
    const octokit = new Octokit();
    // @ts-expect-error the function is deprecated and removed
    expect(typeof octokit.rest.teams.removeMembership).to.equal("undefined");
  });
  it("octokit.rest.teams.listMembers() is deprecated and removed", () => {
    const octokit = new Octokit();
    // @ts-expect-error the function is deprecated and removed
    expect(typeof octokit.rest.teams.listMembers).to.equal("undefined");
  });
  it("octokit.rest.teams.listMembers.endpoint() is deprecated and removed", () => {
    const octokit = new Octokit();
    // @ts-expect-error the function is deprecated and removed
    expect(typeof octokit.rest.teams.listMembers?.endpoint).to.equal(
      "undefined",
    );
  });
  it("octokit.rest.teams.listMembersLegacy.endpoint() is deprecated and removed", () => {
    const octokit = new Octokit();
    // @ts-expect-error the function is deprecated and removed
    expect(typeof octokit.rest.teams.listMembersLegacy?.endpoint).to.equal(
      "undefined",
    );
  });
});
