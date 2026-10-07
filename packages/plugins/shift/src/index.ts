import type { DefinePluginPackageSpec } from "@threatmap/sdk-shared";

import type { API } from "./api.js";
import type { Events } from "./events.js";

export { Result } from "./result.js";

export * from "./custom-agents.js";
export * from "./learnings.js";
export * from "./models.js";
export * from "./settings.js";
export * from "./skills.js";
export * from "./feature-flags.js";
export * from "./optional.js";

export type Spec = DefinePluginPackageSpec<{
  manifestId: "shift";
  api: API;
  events: Events;
}>;

export type { API } from "./api.js";
export type { Events } from "./events.js";
