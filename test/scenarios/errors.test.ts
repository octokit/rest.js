import { getInstance, type OctokitType } from "../util.ts";

describe("api.github.com", () => {
  let octokit: OctokitType;

  beforeEach(() => {
    return getInstance("errors", {
      auth: "token 0000000000000000000000000000000000000001",
    }).then((instance) => {
      octokit = instance;
    });
  });

  it("(#684) errors-test", () => {
    return octokit.rest.issues
      .createLabel({
        owner: "octokit-fixture-org",
        repo: "errors",
        name: "foo",
        color: "invalid",
      })

      .catch((error) => {
        expect(error.message).toMatch(
          new RegExp(
            `Validation Failed: {"resource":"Label","code":"invalid","field":"color"} - http://localhost:3000/docs.github.com/[a-z0-9]{11}/rest/reference/issues#create-a-label`,
          ),
        );
        expect(error.response.data.errors).toEqual([
          {
            resource: "Label",
            code: "invalid",
            field: "color",
          },
        ]);
        expect(error.response.data.documentation_url).toMatch(
          new RegExp("rest/reference/issues#create-a-label"),
        );
      });
  });
});
