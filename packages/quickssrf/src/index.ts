import type { DefinePluginPackageSpec } from "@threatmap/sdk-shared";

import type { API } from "./api.js";
import type { Events } from "./events.js";

export { type Result, ok, err } from "./result.js";

export {
  PROVIDER_KINDS,
  ProviderKindSchema,
  type ProviderKind,
  ProviderSchema,
  type Provider,
  CreateProviderSchema,
  type CreateProvider,
  UpdateProviderSchema,
  type UpdateProvider,
  DEFAULT_PROVIDERS,
  QUICK_ADD_PRESETS,
  PROVIDER_PROTOCOLS,
  PROVIDER_NOTES,
} from "./provider.js";

export {
  INTERACTION_PROTOCOLS,
  InteractionProtocolSchema,
  type InteractionProtocol,
  InteractionSchema,
  type Interaction,
} from "./interaction.js";

export {
  SESSION_STATUSES,
  SessionStatusSchema,
  type SessionStatus,
  SessionSchema,
  type Session,
} from "./session.js";

export {
  QuickSSRFConfigSchema,
  type QuickSSRFConfig,
  DEFAULT_CONFIG,
  UpdateConfigSchema,
  type UpdateConfig,
} from "./config.js";

export type Spec = DefinePluginPackageSpec<{
  manifestId: "quickssrf";
  api: API;
  events: Events;
}>;
