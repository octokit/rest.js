import nock from "nock";
import { Octokit } from "../../pkg/dist-src/index.js";

describe("https://github.com/octokit/rest.js/issues/765", () => {
  it("octokit.rest.issues.update({..., milestone: null})", () => {
    nock("https://api.github.com")
      .patch("/repos/epmatsw/example-repo/issues/1", (body) => {
        expect(body).toStrictEqual({ milestone: null });
        return true;
      })
      .reply(200, {});

    const octokit = new Octokit();
    return octokit.rest.issues.update({
      owner: "epmatsw",
      repo: "example-repo",
      milestone: null,
      issue_number: 1,
    });
  });
});
