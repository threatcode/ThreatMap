import { type Linter } from "eslint";

export type FlatConfigItem = Linter.Config;

export type ESLintConfigOptions = {
  javascript: boolean;
  typescript: boolean;
  vue: boolean;
  prettier: boolean;
  compat: boolean;
  imports: boolean;
  node: boolean;
};

export type ExtraFilesOptions = {
  extraFiles: string[];
};
