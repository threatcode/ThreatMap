import { type FlatConfigItem } from "src/types";

import { pluginCompat } from "../plugins";

export const compat = (): FlatConfigItem[] => {
  return [pluginCompat.configs["flat/recommended"]];
};
