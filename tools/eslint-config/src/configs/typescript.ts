import { GLOB_TS } from "../globs";
import { pluginTs } from "../plugins";
import { type ExtraFilesOptions, type FlatConfigItem } from "../types";

export const typescript = (options: ExtraFilesOptions): FlatConfigItem[] => {
  return [
    ...(pluginTs.configs.recommendedTypeChecked as FlatConfigItem[]),
    {
      name: "threatmap/typescript",
      files: [GLOB_TS, ...options.extraFiles.map((file) => `**/*.${file}`)],
      languageOptions: {
        parserOptions: {
          projectService: true,
          extraFileExtensions: [
            ...options.extraFiles.map((file) => `.${file}`),
          ],
        },
      },
      rules: {
        // Disabled
        "@typescript-eslint/no-unsafe-enum-comparison": "off",
        "@typescript-eslint/ban-ts-ignore": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-implied-eval": "off",
        "@typescript-eslint/unbound-method": "off",
        "@typescript-eslint/no-unused-expressions": "off",
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/strict-boolean-expressions": "error",
        "@typescript-eslint/consistent-type-imports": [
          "error",
          {
            fixStyle: "inline-type-imports",
          },
        ],
        "@typescript-eslint/switch-exhaustiveness-check": [
          "error",
          {
            considerDefaultExhaustiveForUnions: true,
          },
        ],

        // Disable no-unused-vars and uses noUnusedLocals: true in tsconfig.json instead
        // Reference: https://github.com/johnsoncodehk/volar/issues/47
        "@typescript-eslint/no-unused-vars": "off",

        "@typescript-eslint/no-restricted-types": [
          "error",
          {
            types: {
              null: "Use 'undefined' instead of 'null'",
            },
          },
        ],
      },
    },
  ];
};
