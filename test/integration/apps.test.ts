import { describe, beforeEach, it } from "vitest";
import nock from "nock";
import { Octokit } from "../../src/index.ts";

const BEARER_TOKEN =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NTM4MTkzMTIsImV4cCI6MTU1MzgxOTM3MiwiaXNzIjoxfQ.etiSZ4LFQZ8tiMGJVqKDoGn8hxMCgwL4iLvU5xBUqbAPr4pbk_jJZmMQjuxTlOnRxq4e7NouTizGCdfohRMb3R1mpLzGPzOH9_jqSA_BWYxolsRP_WDSjuNcw6nSxrPRueMVRBKFHrqcTOZJej0djRB5pI61hDZJ_-DGtiOIFexlK3iuVKaqBkvJS5-TbTekGuipJ652g06gXuz-l8i0nHiFJldcuIruwn28hTUrjgtPbjHdSBVn_QQLKc2Fhij8OrhcGqp_D_fvb_KovVmf1X6yWiwXV5VXqWARS-JGD9JTAr2495ZlLV_E4WPxdDpz1jl6XS9HUhMuwBpaCOuipw";

describe("apps", () => {
  let octokit: Octokit;

  beforeEach(() => {
    octokit = new Octokit({
      baseUrl: "https://apps-test-host.com",
      auth: `Bearer ${BEARER_TOKEN}`,
    });
  });

  it('adds "machine-man" preview header', () => {
    nock("https://apps-test-host.com", {
      reqheaders: {
        authorization: `bearer ${BEARER_TOKEN}`,
        accept: "application/vnd.github.v3+json",
      },
    })
      .get("/app")
      .reply(200, {});

    return octokit.rest.apps.getAuthenticated();
  });

  it('adds "machine-man" preview header to custom media type', () => {
    nock("https://apps-test-host.com", {
      reqheaders: {
        authorization: `bearer ${BEARER_TOKEN}`,
        accept: "application/vnd.github.v3+json",
      },
    })
      .get("/app")
      .reply(200, {});

    return octokit.rest.apps.getAuthenticated({
      mediaType: {
        previews: ["foo-bar"],
      },
    });
  });
});
