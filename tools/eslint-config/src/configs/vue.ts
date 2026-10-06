import parserVue from "vue-eslint-parser";

import { GLOB_VUE } from "../globs";
import { pluginTs, pluginVue } from "../plugins";
import { type ExtraFilesOptions, type FlatConfigItem } from "../types";

export const vue = (options: ExtraFilesOptions): FlatConfigItem[] => {
  return [
    ...pluginVue.configs["flat/recommended"].map((config) => {
      return {
        ...config,
        files: [GLOB_VUE],
      };
    }),
    {
      name: "threatmap/vue",
      files: [GLOB_VUE],
      rules: {
        // Disabled because clashes with prettier
        "vue/html-closing-bracket-newline": "off",
        "vue/multi-word-component-names": "off",
        "vue/require-v-for-key": "off",
        "vue/no-template-shadow": "off",
        "vue/valid-v-for": "off",
        "vue/max-attributes-per-line": "off",
        // Necessary configuration due to conflict with eslint-config-prettier
        // https://github.com/prettier/eslint-config-prettier?tab=readme-ov-file#vuehtml-self-closing
        "vue/html-self-closing": [
          "error",
          {
            html: {
              void: "any",
            },
          },
        ],
        "vue/define-props-destructuring": [
          "error",
          {
            destructure: "always",
          },
        ],
      },
      languageOptions: {
        parser: parserVue,
        parserOptions: {
          ecmaVersion: "latest",
          // Use different parsers for different languages
          // We do this to improve performance
          // https://github.com/vuejs/vue-eslint-parser/issues/104#issuecomment-875149361
          parser: {
            ts: pluginTs.parser,
            js: pluginTs.parser,
            "<template>": "espree",
          },
          sourceType: "module",
          extraFileExtensions: [
            ...options.extraFiles.map((file) => `.${file}`),
          ],
        },
      },
    },
  ];
};
