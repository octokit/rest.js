import { describe, it, expect } from "vitest";
import { Octokit } from "../../src/index.ts";

describe("plugins", () => {
  it("gets called in constructor", () => {
    const MyOctokit = Octokit.plugin((octokit) => {
      // @ts-ignore
      octokit.foo = "bar";
    });
    const myClient = new MyOctokit();
    // @ts-ignore
    expect(myClient.foo).to.equal("bar");
  });

  it("does not override plugins of original constructor", () => {
    const MyOctokit = Octokit.plugin((octokit) => {
      // @ts-ignore
      octokit.foo = "bar";
    });
    const myClient = new MyOctokit();
    // @ts-ignore
    expect(myClient.foo).to.equal("bar");

    const octokit = new Octokit();
    // @ts-ignore
    expect(octokit.foo).to.equal(undefined);
  });

  it("receives client options", () => {
    const MyOctokit = Octokit.plugin((octokit, options) => {
      expect(options.foo).to.equal("bar");
    });
    new MyOctokit({ foo: "bar" });
  });

  it("does not load the same plugin more than once", () => {
    const myPlugin = (octokit, options) => {
      if (octokit.customKey) {
        throw new Error("Boom!");
      } else {
        octokit.customKey = true;
      }
    };
    const MyOctokit = Octokit.plugin(myPlugin).plugin(myPlugin);
    expect(() => new MyOctokit()).to.not.throw();
  });
});
