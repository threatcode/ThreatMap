declare module "eslint-plugin-no-unsanitized" {
  import { type Linter } from "eslint";

  const defaultExport: {
    configs: {
      recommended: Linter.FlatConfig;
    };
  };

  export default defaultExport;
}
