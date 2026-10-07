import type { DefinePluginPackageSpec } from "@threatmap/sdk-shared";

import type { API } from "./api.js";
import type { Events } from "./events.js";

export { type Result, ok, err } from "./result.js";

export {
  PROVIDERS,
  type Provider,
  ModelCapabilitiesSchema,
  type ModelCapabilities,
  ModelItemSchema,
  type ModelItem,
  ModelUserConfigSchema,
  type ModelUserConfig,
  supportsProviderReasoning,
  DEFAULT_MODELS,
} from "./model.js";

export {
  CHAT_ROLES,
  type ChatRole,
  TextPartSchema,
  ImagePartSchema,
  MessagePartSchema,
  type MessagePart,
  ChatMessageSchema,
  type ChatMessage,
  ChatSessionSchema,
  type ChatSession,
  CreateSessionSchema,
  type CreateSession,
  SendMessageSchema,
  type SendMessage,
} from "./message.js";

export {
  ChatSettingsSchema,
  type ChatSettings,
  DEFAULT_CHAT_SETTINGS,
  ProviderSettingsSchema,
  type ProviderSettings,
  MAX_FILE_SIZE_BYTES,
  MAX_TOTAL_FILES_SIZE_BYTES,
} from "./settings.js";

export type Spec = DefinePluginPackageSpec<{
  manifestId: "chatio";
  api: API;
  events: Events;
}>;

export type { API } from "./api.js";
export type { Events } from "./events.js";
