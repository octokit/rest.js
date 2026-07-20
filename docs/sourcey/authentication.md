# Authentication

Create a client with a token supplied through the environment:

```js
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const { data } = await octokit.rest.users.getAuthenticated();
console.log(data.login);
```

Use least-privilege tokens, never log authorization headers, and rotate credentials according to your organization policy.
