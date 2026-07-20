import { defineConfig, markdown } from "sourcey";

export default defineConfig({
  name: "Octokit REST.js",
  theme: { preset: "default", colors: { primary: "#24292f" } },
  repo: "https://github.com/octokit/rest.js",
  editBranch: "main",
  editBasePath: "docs/sourcey",
  navigation: {
    tabs: [{
      tab: "Guides",
      slug: "",
      source: markdown({
        groups: [
          { group: "Start Here", pages: ["introduction", "installation", "authentication"] },
          { group: "Core Usage", pages: ["requests", "pagination", "plugins", "configuration", "examples"] },
          { group: "Reference", pages: ["endpoints", "errors", "security"] },
        ],
      }),
    }],
  },
});
