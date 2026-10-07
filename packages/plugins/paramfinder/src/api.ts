import type { EngineConfig } from "./config-schema.js";
import type { Result } from "./result.js";
import type { BaselineProfile, EngineRequest, Finding } from "./types.js";

export type SessionDescriptor = {
  id: string;
  state: string;
  phase: string;
};

export type API = {
  startMining: (
    target: EngineRequest,
    config: EngineConfig,
  ) => Promise<Result<SessionDescriptor>>;
  cancelSession: (id: string) => Promise<Result<void>>;
  learn: (
    request: EngineRequest,
    config: EngineConfig,
  ) => Promise<Result<BaselineProfile>>;
  discover: (
    request: EngineRequest,
    words: string[],
    config: EngineConfig,
  ) => Promise<Result<Finding[]>>;
};
