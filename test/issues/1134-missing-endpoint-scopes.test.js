import { Octokit } from "../../pkg/dist-src/index.js";

describe("https://github.com/octokit/rest.js/issues/1134", () => {
  it("octokit.rest.pulls", () => {
    const octokit = new Octokit();
    expect(typeof octokit.rest.pulls).toStrictEqual("object");
  });
});
