# Requests and responses

Endpoint methods follow the GitHub REST API shape. Parameters are validated by TypeScript when using the generated endpoint types.

```js
const { data, status, headers } = await octokit.rest.repos.get({
  owner: "octokit",
  repo: "rest.js",
});

console.log(status, data.full_name, headers.etag);
```

Handle non-2xx responses explicitly and preserve request identifiers when diagnosing failures.
