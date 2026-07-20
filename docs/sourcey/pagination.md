# Pagination

Use `paginate` for collection endpoints instead of manually managing `Link` headers:

```js
const issues = await octokit.paginate(octokit.rest.issues.listForRepo, {
  owner: "octokit",
  repo: "rest.js",
  per_page: 100,
});
```

For bounded memory usage, pass a map function or an async iterator pattern and impose application-specific limits.
