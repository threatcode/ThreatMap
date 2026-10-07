import type { DefinePluginPackageSpec } from "@threatmap/sdk-shared";

import type { API } from "./api.js";
import type { Events } from "./events.js";

export { type Result, ok, err } from "./result.js";

export {
  TOR_STATES,
  type TorState,
  TorSettingsSchema,
  type TorSettings,
  DEFAULT_SETTINGS,
  UpdateTorSettingsSchema,
  type UpdateTorSettings,
  TorStatusSchema,
  type TorStatus,
  TestConnectionResultSchema,
  type TestConnectionResult,
  TorVersionInfoSchema,
  type TorVersionInfo,
} from "./types.js";

export type Spec = DefinePluginPackageSpec<{
  manifestId: "tor";
  api: API;
  events: Events;
}>;

export type { API } from "./api.js";
export type { Events } from "./events.js";
