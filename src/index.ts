import { Octokit as Core } from "@octokit/core";
import { requestLog } from "@octokit/plugin-request-log";
import {
  paginateRest,
  type PaginateInterface,
} from "@octokit/plugin-paginate-rest";
import { legacyRestEndpointMethods } from "@octokit/plugin-rest-endpoint-methods";
export type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

import { VERSION } from "./version.js";

type Constructor<T> = new (...args: any[]) => T;

export const Octokit: typeof Core &
  Constructor<
    ReturnType<typeof legacyRestEndpointMethods> & {
      paginate: PaginateInterface;
    }
  > = Core.plugin(requestLog, legacyRestEndpointMethods, paginateRest).defaults(
  {
    userAgent: `octokit-rest.js/${VERSION}`,
  },
);

export type Octokit = InstanceType<typeof Octokit>;
