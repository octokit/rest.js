const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { fetch: undiciFetch, Agent } = require("undici");

const { Octokit } = require("../../..");
const ca = readFileSync(resolve(__dirname, "./ca.crt"));

describe("custom client certificate", () => {
  let server;
  before((done) => {
    server = https.createServer(
      {
        key: readFileSync(resolve(__dirname, "./localhost.key")),
        cert: readFileSync(resolve(__dirname, "./localhost.crt")),
      },
      function (request, response) {
        expect(request.method).to.equal("GET");
        expect(request.url).to.equal("/repos/octokit/rest.js");

        response.writeHead(200);
        response.write("ok");
        response.end();
      },
    );

    server.listen(0, done);
  });

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
      baseUrl: "https://localhost:" + server.address().port,
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
      baseUrl: "https://localhost:" + server.address().port,
      request: {
        fetch: myFetch,
      },
    });

    return octokit.rest.repos.get({
      owner: "octokit",
      repo: "rest.js",
    });
  });

  after((done) => server.close(done));
});
