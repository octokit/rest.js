# Errors and retries

Catch request errors and inspect their status and response data:

```js
try {
  await octokit.rest.repos.get({ owner: "octokit", repo: "missing" });
} catch (error) {
  console.error(error.status, error.response?.data);
}
```

Retry only idempotent operations or operations with an explicit idempotency strategy. Respect rate-limit and secondary-rate-limit responses.
