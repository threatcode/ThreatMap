import type { EngineConfig } from "./config-schema.js";
import { engineConfigSchema } from "./config-schema.js";
import type { Result } from "./result.js";
import type { EngineLearnInput, EngineRunInput } from "./types.js";

export function parseEngineConfig(input: unknown): Result<EngineConfig> {
  const parsed = engineConfigSchema.safeParse(input);
  if (parsed.success) return { kind: "Ok", value: parsed.data };
  return {
    kind: "Error",
    error: parsed.error.issues[0]?.message ?? "Invalid engine config.",
  };
}

export function parseEngineRunInput(
  input: EngineRunInput,
): Result<EngineRunInput> {
  const config = parseEngineConfig(input.engineConfig);
  if (config.kind === "Error") return config;
  if (!Array.isArray(input.words) || input.words.length === 0) {
    return { kind: "Error", error: "At least one word is required." };
  }
  return { kind: "Ok", value: { ...input, engineConfig: config.value } };
}

export function parseEngineLearnInput(
  input: EngineLearnInput,
): Result<EngineLearnInput> {
  const config = parseEngineConfig(input.engineConfig);
  if (config.kind === "Error") return config;
  return { kind: "Ok", value: { ...input, engineConfig: config.value } };
}
