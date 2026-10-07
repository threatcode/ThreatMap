import { z } from "zod";

export const PROVIDERS = [
  "openai",
  "anthropic",
  "google",
  "deepseek",
  "openrouter",
  "xai",
] as const;

export type Provider = (typeof PROVIDERS)[number];

export const ModelCapabilitiesSchema = z.object({
  reasoning: z.boolean(),
});

export type ModelCapabilities = z.infer<typeof ModelCapabilitiesSchema>;

export const ModelItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  provider: z.enum(PROVIDERS),
  capabilities: ModelCapabilitiesSchema,
  contextWindow: z.number().int().positive().optional(),
  isCustom: z.boolean().optional(),
});

export type ModelItem = z.infer<typeof ModelItemSchema>;

export const ModelUserConfigSchema = z.object({
  id: z.string(),
  enabled: z.boolean(),
});

export type ModelUserConfig = z.infer<typeof ModelUserConfigSchema>;

const reasoningDisabledProviders = new Set<Provider>(["openai"]);

export const supportsProviderReasoning = (provider: Provider): boolean =>
  !reasoningDisabledProviders.has(provider);

export const DEFAULT_MODELS: ModelItem[] = [
  {
    id: "openai/gpt-5",
    name: "GPT-5",
    provider: "openai",
    capabilities: { reasoning: false },
    contextWindow: 400_000,
  },
  {
    id: "anthropic/claude-opus-4",
    name: "Claude Opus 4",
    provider: "anthropic",
    capabilities: { reasoning: true },
    contextWindow: 200_000,
  },
  {
    id: "google/gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "google",
    capabilities: { reasoning: true },
    contextWindow: 1_000_000,
  },
  {
    id: "deepseek/deepseek-r1",
    name: "DeepSeek R1",
    provider: "deepseek",
    capabilities: { reasoning: true },
    contextWindow: 128_000,
  },
];
