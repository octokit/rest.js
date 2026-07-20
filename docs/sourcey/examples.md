# Examples

List open issues:

```js
const issues = await octokit.paginate(octokit.rest.issues.listForRepo, {
  owner: "octokit",
  repo: "rest.js",
  state: "open",
});
```

Create an issue:

```js
await octokit.rest.issues.create({
  owner: "octokit",
  repo: "rest.js",
  title: "Investigate API behaviour",
  body: "Reproduction details go here.",
});
```

Validate user input before using it in endpoint parameters and apply authorization checks in your own service.
