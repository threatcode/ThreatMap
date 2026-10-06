import { pluginJs, pluginNoUnsanitized } from "../plugins";
import { type FlatConfigItem } from "../types";

export const javascript = (): FlatConfigItem[] => {
  return [
    pluginJs.configs.recommended,
    pluginNoUnsanitized.configs.recommended,
    {
      name: "threatmap/javascript",
      rules: {
        eqeqeq: "error",
        "no-empty-pattern": "off",
        "sort-imports": [
          "warn",
          {
            ignoreCase: true,
            ignoreDeclarationSort: true,
          },
        ],
      },
    },
  ];
};
