---
title: "Plugins"
---

You can customize and extend Octokit’s functionality using plugins

```js
// index.js
import { Octokit } from "@octokit/rest";
import myPlugin from "./lib/my-plugin.js";
import octokitPluginExample from "octokit-plugin-example";

const MyOctokit = Octokit.plugin(
  myPlugin,
  octokitPluginExample,
);

// lib/my-plugin.js
const plugin = (octokit, options = { greeting: "Hello" }) => {
  // hook into the request lifecycle
  octokit.hook.wrap("request", async (request, options) => {
    const time = Date.now();
    const response = await request(options);
    octokit.log.info(
      `${options.method} ${options.url} – ${response.status} in ${
        Date.now() - time
      }ms`,
    );
    return response;
  });

  // add a custom method: octokit.helloWorld()
  return {
    helloWorld: () => console.log(`${options.greeting}, world!`),
  };
};
export default plugin;
```

`.plugin` accepts a function or an array of functions.

We recommend using [Octokit’s log methods](#logging) to help users of your plugin with debugging.

You can add new methods to the `octokit` instance passed as the first argument to
the plugin function. The 2nd argument is the options object passed to the
constructor when instantiating the `octokit` client.

```js
const octokit = new MyOctokit({ greeting: "Hola" });
octokit.helloWorld();
// Hola, world!
```
