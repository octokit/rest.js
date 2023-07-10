const nock = require("nock");
const { Octokit } = require("../..");

describe("https://github.com/octokit/rest.js/issues/1323", () => {
  it("should accept new parameter", () => {
    nock("https://api.github.com")
      .get("/repos/probot/probot/issues/1")
      .reply(200, {});

    const octokit = new Octokit();
    return octokit.rest.issues.get({
      owner: "probot",
      repo: "probot",
      issue_number: 1,
    });
  });
});
