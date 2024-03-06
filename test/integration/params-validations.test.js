import nock from "nock";

import { Octokit } from "../../pkg/dist-src/index.js";

describe("params validations", () => {
  it("octokit.rest.orgs.get({})", () => {
    const octokit = new Octokit();

    return octokit.rest.orgs
      .get({})

      .then(() => {
        expect.fail("should throw error");
      })

      .catch((error) => {
        expect(error.message).toStrictEqual(
          "Empty value for parameter 'org': undefined",
        );
        expect(error.status).toStrictEqual(400);
      });
  });

  it("request error", () => {
    const octokit = new Octokit({
      baseUrl: "https://127.0.0.1:8", // port: 8 // officially unassigned port. See https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers
    });

    return octokit.rest.orgs
      .get({ org: "foo" })

      .then(() => {
        expect.fail("should throw error");
      })

      .catch((error) => {
        expect(error.status).toStrictEqual(500);
        expect(error.message).toStrictEqual(
          "request to https://127.0.0.1:8/orgs/foo failed, reason: connect ECONNREFUSED 127.0.0.1:8",
        );
      });
  });

  it("invalid value for octokit.rest.issues.list({filter})", () => {
    const octokit = new Octokit();

    return octokit.rest.issues
      .list({ filter: "foo" })

      .then(() => {
        expect.fail("should throw error");
      })

      .catch((error) => {
        expect(error.status).toStrictEqual(400);
        expect(error.message).toStrictEqual(
          "Invalid value for parameter 'filter': \"foo\"",
        );
      });
  });

  it("invalid value for octokit.rest.projects.moveCard({position})", () => {
    const octokit = new Octokit();

    return octokit.rest.projects
      .moveCard({ card_id: 123, position: "foo" })

      .then(() => {
        expect.fail("should throw error");
      })

      .catch((error) => {
        expect(error.status).toStrictEqual(400);
        expect(error.message).toStrictEqual(
          "Invalid value for parameter 'position': \"foo\"",
        );
      });
  });

  it("Not a number for octokit.rest.repos.createCommitComment({..., position})", () => {
    const octokit = new Octokit();

    return octokit.rest.repos
      .createCommitComment({
        owner: "foo",
        repo: "bar",
        commit_sha: "lala",
        body: "Sing with me!",
        position: "Age Ain’t Nothing",
      })

      .catch((error) => {
        expect(error.status).toStrictEqual(400);
        expect(error.message).toStrictEqual(
          "Invalid value for parameter 'position': \"Age Ain’t Nothing\" is NaN",
        );
      });
  });

  it("Not a valid JSON string for octokit.rest.repos.createWebhook({..., config})", () => {
    const octokit = new Octokit();

    return octokit.rest.repos
      .createWebhook({
        owner: "foo",
        repo: "bar",
        name: "captain",
        config: "I’m no Je-Son!",
      })

      .then(() => {
        expect.fail("should throw error");
      })

      .catch((error) => {
        expect(error.status).toStrictEqual(400);
        expect(error.message).toStrictEqual(
          "JSON parse error of value for parameter 'config': \"I’m no Je-Son!\"",
        );
      });
  });

  it("Date object for octokit.rest.issues.createMilestone({..., due_on})", () => {
    const octokit = new Octokit({
      baseUrl: "https://milestones-test-host.com",
    });

    nock("https://milestones-test-host.com")
      .post("/repos/foo/bar/milestones", (body) => {
        expect(body.due_on).toStrictEqual("2012-10-09T23:39:01.000Z");
        return true;
      })
      .reply(201, {});

    return octokit.rest.issues.createMilestone({
      owner: "foo",
      repo: "bar",
      title: "Like a rolling ...",
      due_on: new Date("2012-10-09T23:39:01Z"),
    });
  });

  it("Date is passed in correct format for notifications (#716)", () => {
    const octokit = new Octokit({
      baseUrl: "https://notifications-test-host.com",
    });

    nock("https://notifications-test-host.com")
      .get("/notifications")
      .query((query) => {
        expect(query).toStrictEqual({
          since: "2018-01-21T23:27:31.000Z",
        });
        return true;
      })
      .reply(200, {});

    return octokit.rest.activity.listNotificationsForAuthenticatedUser({
      since: "2018-01-21T23:27:31.000Z",
    });
  });

  it("octokit.rest.gitdata.createTree() with invalid tree[] object", () => {
    const octokit = new Octokit();
    return octokit.rest.git
      .createTree({
        owner: "foo",
        repo: "bar",
        base_tree: "9fb037999f264ba9a7fc6274d15fa3ae2ab98312",
        tree: [
          {
            type: "foo",
          },
        ],
      })

      .then(() => {
        expect.fail("should throw error");
      })

      .catch((error) => {
        expect(error.status).toStrictEqual(400);
        expect(error.message).toStrictEqual(
          "Invalid value for parameter 'tree[0].type': \"foo\"",
        );
      });
  });

  it("octokit.rest.issues.createLabel() with description: null", () => {
    const octokit = new Octokit();
    return octokit.rest.issues
      .createLabel({
        owner: "foo",
        repo: "bar",
        name: "baz",
        color: "#bada55",
        description: null,
      })

      .then(() => {
        expect.fail("should throw error");
      })

      .catch((error) => {
        expect(error.status).toStrictEqual(400);
        expect(error.message).toStrictEqual("'description' cannot be null");
      });
  });

  it("does not alter passed options", () => {
    const octokit = new Octokit({
      baseUrl: "https://params-test-host.com",
    });

    nock("https://params-test-host.com").get("/orgs/foo").reply(200, {});

    const options = {
      org: "foo",
      headers: {
        "x-bar": "baz",
      },
    };
    return octokit.rest.orgs
      .get(options)
      .catch(() => {
        // ignore error
      })
      .then(() => {
        expect(options).toStrictEqual({
          org: "foo",
          headers: {
            "x-bar": "baz",
          },
        });
      });
  });
});
