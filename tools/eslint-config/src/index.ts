import {
  compat,
  ignore,
  imports,
  javascript,
  node,
  prettier,
  typescript,
  vue,
} from "./configs";
import { type ESLintConfigOptions, type ExtraFilesOptions } from "./types";

const DEFAULT_OPTIONS: ESLintConfigOptions = {
  javascript: true,
  typescript: true,
  vue: true,
  compat: true,
  imports: true,
  prettier: true,
  node: false,
};

export const defaultConfig = (options: Partial<ESLintConfigOptions> = {}) => {
  const finalOptions: ESLintConfigOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const extraFilesOptions: ExtraFilesOptions = {
    extraFiles: [],
  };

  if (finalOptions.typescript) {
    extraFilesOptions.extraFiles.push("vue");
    extraFilesOptions.extraFiles.push("tsx");
  }

  return [
    ...ignore(),
    ...(finalOptions.javascript ? javascript() : []),
    ...(finalOptions.typescript ? typescript(extraFilesOptions) : []),
    ...(finalOptions.vue ? vue(extraFilesOptions) : []),
    ...(finalOptions.imports ? imports() : []),
    ...(finalOptions.compat ? compat() : []),
    ...(finalOptions.prettier ? prettier() : []),
    ...(finalOptions.node ? node() : []),
  ];
};
