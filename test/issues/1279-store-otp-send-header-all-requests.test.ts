import { describe, it, expect } from "vitest";
import nock from "nock";
import { Octokit } from "../../src/index.ts";

// TODO: Basic Auth is not accepted by GitHub anymore
describe("https://github.com/octokit/rest.js/issues/1279", () => {
  it.skip("2fa code gets stored and passed as header to listAuthorizations", () => {
    nock("https://authentication-test-host.com", {
      reqheaders: {
        authorization: "Basic dXNlcm5hbWU6cGFzc3dvcmQ=",
      },
    })
      .get("/")
      .reply(
        401,
        {},
        {
          "x-github-otp": "required; app",
        },
      );

    nock("https://authentication-test-host.com", {
      reqheaders: {
        authorization: "Basic dXNlcm5hbWU6cGFzc3dvcmQ=",
        "x-github-otp": "123456",
      },
    })
      .get("/")
      .reply(200, {});

    nock("https://authentication-test-host.com", {
      reqheaders: {
        authorization: "Basic dXNlcm5hbWU6cGFzc3dvcmQ=",
        "x-github-otp": "123456",
      },
    })
      .get("/authorizations?per_page=100")
      .reply(200, []);

    const octokit = new Octokit({
      baseUrl: "https://authentication-test-host.com",
      auth: {
        username: "username",
        password: "password",
        on2fa() {
          return Promise.resolve("123456");
        },
      },
    });

    return octokit.request("/").then(() => {
      return octokit.authorization.listAuthorizations({ per_page: 100 });
    });
  });

  it.skip("prompts for OTP again once OTP code becomes invalid", () => {
    nock("https://authentication-test-host.com", {
      reqheaders: {
        authorization: "Basic dXNlcm5hbWU6cGFzc3dvcmQ=",
      },
    })
      .get("/")
      .reply(
        401,
        {},
        {
          "x-github-otp": "required; app",
        },
      );

    nock("https://authentication-test-host.com", {
      reqheaders: {
        authorization: "Basic dXNlcm5hbWU6cGFzc3dvcmQ=",
        "x-github-otp": "123456",
      },
    })
      .get("/")
      .reply(200, {});

    // OTP code now becomes invalid
    nock("https://authentication-test-host.com", {
      reqheaders: {
        authorization: "Basic dXNlcm5hbWU6cGFzc3dvcmQ=",
        "x-github-otp": "123456",
      },
    })
      .get("/authorizations?per_page=100")
      .reply(
        401,
        {},
        {
          "x-github-otp": "required; app",
        },
      );

    nock("https://authentication-test-host.com", {
      reqheaders: {
        authorization: "Basic dXNlcm5hbWU6cGFzc3dvcmQ=",
        "x-github-otp": "123456",
      },
    })
      .get("/authorizations?per_page=100")
      .reply(200, {});

    let on2faCalledCounter = 0;
    const octokit = new Octokit({
      baseUrl: "https://authentication-test-host.com",
      auth: {
        username: "username",
        password: "password",
        on2fa() {
          on2faCalledCounter++;
          return Promise.resolve(123456);
        },
      },
    });

    return octokit.request("/").then(() => {
      expect(on2faCalledCounter).to.equal(1);
      return octokit.authorization
        .listAuthorizations({ per_page: 100 })
        .then(() => {
          expect(on2faCalledCounter).to.equal(2);
        });
    });
  });
});
