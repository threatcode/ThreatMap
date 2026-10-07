import type { CustomAgent } from "./custom-agents.js";
import type { LearningsConfig } from "./learnings.js";
import type { Model, ModelsConfig } from "./models.js";
import type { Result } from "./result.js";
import type { SettingsConfig } from "./settings.js";
import type { AgentSkillDefinition } from "./skills.js";

export type API = {
  getModels: () => Result<ModelsConfig>;
  setModels: (config: ModelsConfig) => Promise<Result<ModelsConfig>>;
  addModel: (model: Model) => Promise<Result<Model>>;
  removeModel: (modelKey: string) => Promise<Result<void>>;

  getAgents: () => Result<CustomAgent[]>;
  createAgent: (agent: Omit<CustomAgent, "id">) => Promise<Result<CustomAgent>>;
  updateAgent: (
    id: string,
    updates: Partial<Omit<CustomAgent, "id">>,
  ) => Promise<Result<CustomAgent>>;
  deleteAgent: (id: string) => Promise<Result<void>>;

  getSkills: () => Result<AgentSkillDefinition[]>;
  getLearnings: () => Result<LearningsConfig>;
  addLearning: (content: string) => Promise<Result<LearningsConfig>>;
  removeLearnings: (indexes: number[]) => Promise<Result<LearningsConfig>>;

  getSettings: () => Result<SettingsConfig>;
  updateSettings: (
    updates: Partial<SettingsConfig>,
  ) => Promise<Result<SettingsConfig>>;
};
