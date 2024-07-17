import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { readFileSync } from "node:fs";
import { fetch as undiciFetch, Agent } from "undici";
import https from "node:https";

import { Octokit } from "../../../src/index.ts";
import type { AddressInfo } from "node:net";
const ca = readFileSync(new URL("./ca.crt", import.meta.url));

describe("custom client certificate", () => {
  let server: https.Server;
  beforeAll(
    () =>
      new Promise((done) => {
        server = https.createServer(
          {
            key: readFileSync(new URL("./localhost.key", import.meta.url)),
            cert: readFileSync(new URL("./localhost.crt", import.meta.url)),
          },
          function (request, response) {
            expect(request.method).toStrictEqual("GET");
            expect(request.url).toStrictEqual("/repos/octokit/rest.js");

            response.writeHead(200);
            response.write("ok");
            response.end();
          },
        );

        server.listen(0, done);
      }),
  );

  it("undici.Agent({ca})", () => {
    const agent = new Agent({
      keepAliveTimeout: 10,
      keepAliveMaxTimeout: 10,
      connect: { ca: ca },
    });
    const myFetch = (url, opts) => {
      return undiciFetch(url, {
        ...opts,
        dispatcher: agent,
      });
    };
    const octokit = new Octokit({
      baseUrl: "https://localhost:" + (server.address() as AddressInfo).port,
      request: {
        fetch: myFetch,
      },
    });

    return octokit.rest.repos.get({
      owner: "octokit",
      repo: "rest.js",
    });
  });

  it("undici.Agent({ca, rejectUnauthorized})", () => {
    const agent = new Agent({
      keepAliveTimeout: 10,
      keepAliveMaxTimeout: 10,
      connect: {
        ca: "invalid",
        rejectUnauthorized: true,
      },
    });
    const myFetch = (url, opts) => {
      return undiciFetch(url, {
        ...opts,
        dispatcher: agent,
      });
    };
    const octokit = new Octokit({
      baseUrl: "https://localhost:" + (server.address() as AddressInfo).port,
      request: {
        fetch: myFetch,
      },
    });

    return octokit.rest.repos.get({
      owner: "octokit",
      repo: "rest.js",
    });
  });

  afterAll(() => new Promise(() => server.close()));
});
