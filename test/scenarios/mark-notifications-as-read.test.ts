import { getInstance, type OctokitType } from "../util.ts";

describe("api.github.com", () => {
  let octokit: OctokitType;

  beforeEach(() => {
    return getInstance("mark-notifications-as-read", {
      auth: "token 0000000000000000000000000000000000000001",
    }).then((instance) => {
      octokit = instance;
    });
  });

  it("octokit.rest.activity.markNotificationsAsRead()", () => {
    return octokit.rest.activity.markNotificationsAsRead();
  });
});
