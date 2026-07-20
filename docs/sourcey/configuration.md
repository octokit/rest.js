# Configuration

A client can be configured with authentication, a custom base URL, request media types, and transport options:

```js
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  baseUrl: "https://api.github.com",
  userAgent: "my-service/1.0",
});
```

Keep configuration deterministic across environments and inject secrets at runtime.
