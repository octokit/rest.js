import nock from "nock";
import { expect, describe, it } from "@jest/globals";

import { Octokit } from "../../pkg/dist-src/index.js";

describe("request errors", () => {
  it("timeout", () => {
    nock("https://request-errors-test.com").get("/").delay(2000).reply(200, {});

    const octokit = new Octokit({
      baseUrl: "https://request-errors-test.com",
      request: {
        timeout: 100,
      },
    });

    return octokit
      .request("/")

      .then(() => {
        throw new Error("should not resolve");
      })

      .catch((error) => {
        expect(error.name).toStrictEqual("HttpError");
        expect(error.status).toStrictEqual(500);
        expect(error.message).toMatch(/timeout/);
      });
  });

  it("500", () => {
    nock("https://request-errors-test.com")
      .get("/orgs/myorg")
      .replyWithError("ooops");

    const octokit = new Octokit({
      baseUrl: "https://request-errors-test.com",
    });

    return octokit.rest.orgs
      .get({ org: "myorg" })

      .catch((error) => {
        expect(error.name).toStrictEqual("HttpError");
        expect(error.status).toStrictEqual(500);
        expect(error.stacl).not.toBeUndefined();
      });
  });

  it("404", () => {
    nock("https://request-errors-test.com")
      .get("/orgs/myorg")
      .reply(404, "not found");

    const octokit = new Octokit({
      baseUrl: "https://request-errors-test.com",
    });

    return octokit.rest.orgs
      .get({ org: "myorg" })

      .catch((error) => {
        expect(error.name).toStrictEqual("HttpError");
        expect(error.status).toStrictEqual(404);
        expect(error.stack).not.toBeUndefined();
      });
  });

  it("401", () => {
    nock("https://request-errors-test.com").get("/orgs/myorg").reply(401);

    const octokit = new Octokit({
      baseUrl: "https://request-errors-test.com",
    });

    return octokit.rest.orgs
      .get({ org: "myorg" })

      .catch((error) => {
        expect(error.name).toStrictEqual("HttpError");
        expect(error.status).toStrictEqual(401);
        expect(error.stack).not.toBeUndefined();
      });
  });

  it("error headers", () => {
    nock("https://request-errors-test.com").get("/orgs/myorg").reply(
      401,
      {},
      {
        "x-foo": "bar",
      },
    );

    const octokit = new Octokit({
      baseUrl: "https://request-errors-test.com",
    });

    return octokit.rest.orgs
      .get({ org: "myorg" })

      .catch((error) => {
        expect(error.name).toStrictEqual("HttpError");
        expect(error.status).toStrictEqual(401);
        expect(error.response.headers).toStrictEqual({
          "content-type": "application/json",
          "x-foo": "bar",
        });
      });
  });

  it("error.request does not include token", () => {
    nock("https://request-errors-test.com").get("/").reply(500);

    const octokit = new Octokit({
      baseUrl: "https://request-errors-test.com",
      auth: "token abc4567",
    });

    return octokit
      .request("/")

      .catch((error) => {
        expect(error.request.headers.authorization).toStrictEqual(
          "token [REDACTED]",
        );
      });
  });
});
