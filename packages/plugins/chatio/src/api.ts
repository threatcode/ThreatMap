import type { ChatSession, CreateSession, SendMessage } from "./message.js";
import type { ModelItem, ModelUserConfig, Provider } from "./model.js";
import type { Result } from "./result.js";
import type { ChatSettings } from "./settings.js";

export type API = {
  getSessions: () => Result<ChatSession[]>;
  getSession: (sessionId: string) => Result<ChatSession>;
  createSession: (input: CreateSession) => Promise<Result<ChatSession>>;
  deleteSession: (sessionId: string) => Promise<Result<void>>;
  sendMessage: (input: SendMessage) => Promise<Result<ChatSession>>;

  getModels: () => Result<ModelItem[]>;
  setModelConfig: (config: ModelUserConfig) => Result<void>;
  getSettings: () => Result<ChatSettings>;
  updateSettings: (updates: Partial<ChatSettings>) => Result<ChatSettings>;

  getProviderStatuses: () => Result<{ id: Provider; isConfigured: boolean }[]>;
};
