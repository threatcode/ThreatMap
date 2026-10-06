import { pluginConfigPrettier, pluginPrettier } from "../plugins";
import { type FlatConfigItem } from "../types";

export const prettier = (): FlatConfigItem[] => {
  return [
    {
      name: "prettier/recommended",
      ...pluginPrettier,
    },
    {
      ...pluginConfigPrettier,
      name: "config-prettier/recommended",
    },
  ];
};
