import * as readline from "node:readline/promises";

import { type ScaffoldConfig } from "./types.js";

const toPluginId = (packageName: string): string => {
  return packageName
    .toLowerCase()
    .replace(/^@/, "")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

export const prompt = async (): Promise<ScaffoldConfig> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const lines = rl[Symbol.asyncIterator]();

    const ask = async (message: string): Promise<string> => {
      process.stdout.write(message);
      const result = await lines.next();
      return result.done === true ? "" : String(result.value);
    };

    const packageName = await ask("What is the name of your plugin package? ");
    if (packageName.trim().length === 0) {
      throw new Error("Package name is required");
    }

    const description = await ask("What is the description of your plugin? ");

    const targetDirInput = await ask(
      "Target directory (relative to cwd) [packages/plugins]: ",
    );
    const targetDir =
      targetDirInput.trim().length === 0
        ? "packages/plugins"
        : targetDirInput.trim();

    return {
      packageName: packageName.trim(),
      pluginId: toPluginId(packageName.trim()),
      description: description.trim(),
      targetDir,
    };
  } finally {
    rl.close();
  }
};
