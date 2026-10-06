import { type FlatConfigItem } from "src/types";

import { pluginImport } from "../plugins";

/**
 * Config for the import plugin
 * @returns FlatConfigItem[] - The import plugin config
 */
export const imports = (): FlatConfigItem[] => {
  return [
    pluginImport.flatConfigs["recommended"],
    {
      name: "import/typescript",
      ...pluginImport.flatConfigs["typescript"],
    },
    {
      name: "threatmap/imports",
      rules: {
        // Disabled for performance issues
        // Reference: https://typescript-eslint.io/linting/troubleshooting/performance-troubleshooting/#eslint-plugin-import
        "import/namespace": "off",

        "import/first": "error",

        // Disabled since this is already handled by Typescript
        "import/no-unresolved": "off",
        "import/order": [
          "warn",
          {
            "newlines-between": "always",
            warnOnUnassignedImports: true,
            groups: [
              "builtin",
              "external",
              "internal",
              "parent",
              "sibling",
              "index",
            ],
            alphabetize: {
              order: "asc",
              caseInsensitive: true,
            },
          },
        ],
      },
    },
  ];
};
