import { type FlatConfigItem } from "src/types";

import { pluginNode } from "../plugins";

export const node = (): FlatConfigItem[] => {
  return [
    {
      plugins: {
        n: pluginNode,
      },
      rules: {
        "n/no-unsupported-features/es-builtins": "error",
        "n/no-unsupported-features/es-syntax": "error",
        "n/no-unsupported-features/node-builtins": "error",
      },
    },
  ];
};
