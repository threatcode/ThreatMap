import type { DefinePluginPackageSpec } from "@threatmap/sdk-shared";

import type { API } from "./api.js";
import type { Events } from "./events.js";

export type { API } from "./api.js";
export type { Events } from "./events.js";

export * from "./check.js";
export * from "./config.js";
export * from "./finding.js";
export * from "./queue.js";
export * from "./request.js";
export * from "./result.js";
export * from "./scan.js";
export * from "./session.js";
export * from "./severity.js";
export * from "./utils.js";

export type Spec = DefinePluginPackageSpec<{
  manifestId: "scanner";
  api: API;
  events: Events;
}>;
