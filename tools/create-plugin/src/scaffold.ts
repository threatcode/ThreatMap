import fsPromises from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { type ScaffoldConfig } from "./types.js";

export const scaffold = async (config: ScaffoldConfig): Promise<string> => {
  const templatePath = getTemplatePath();
  const destinationPath = path.resolve(
    process.cwd(),
    config.targetDir,
    config.pluginId,
  );

  console.log(`[*] Creating plugin in ${destinationPath}`);
  await fsPromises.cp(templatePath, destinationPath, {
    recursive: true,
    errorOnExist: true,
  });

  await updateTemplateValues(destinationPath, config);

  console.log(`[*] Plugin created in ${destinationPath}`);
  console.log(`[*] Run the following commands to get started:`);
  console.log(`[*] - pnpm install`);
  console.log(`[*] - pnpm --filter @threatmap/${config.pluginId} build`);

  return destinationPath;
};

const getTemplatePath = (): string => {
  const filename = fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);
  return path.join(dirname, "../", "templates", "default");
};

const updateTemplateValues = async (
  destinationPath: string,
  config: ScaffoldConfig,
): Promise<void> => {
  const packageJsonPath = path.join(destinationPath, "package.json");
  const packageJson = JSON.parse(
    await fsPromises.readFile(packageJsonPath, "utf-8"),
  );
  packageJson.name = `@threatmap/${config.pluginId}`;
  packageJson.description =
    config.description.length > 0
      ? config.description
      : `Specification for the ${config.pluginId} plugin`;
  await fsPromises.writeFile(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + "\n",
  );

  const indexPath = path.join(destinationPath, "src", "index.ts");
  let indexContent = await fsPromises.readFile(indexPath, "utf-8");
  indexContent = indexContent.replaceAll(
    '"__plugin_id__"',
    `"${config.pluginId}"`,
  );
  await fsPromises.writeFile(indexPath, indexContent);

  const readmePath = path.join(destinationPath, "README.md");
  let readmeContent = await fsPromises.readFile(readmePath, "utf-8");
  readmeContent = readmeContent.replaceAll("__plugin_id__", config.pluginId);
  await fsPromises.writeFile(readmePath, readmeContent);

  await updateTsconfigExtends(destinationPath);
};

const updateTsconfigExtends = async (
  destinationPath: string,
): Promise<void> => {
  const tsconfigPath = path.join(destinationPath, "tsconfig.json");
  const tsconfig = JSON.parse(await fsPromises.readFile(tsconfigPath, "utf-8"));

  let basePath = path.join(process.cwd(), "tsconfig.json");
  try {
    await fsPromises.access(basePath);
  } catch {
    basePath = path.join(process.cwd(), "..", "..", "tsconfig.json");
    try {
      await fsPromises.access(basePath);
    } catch {
      return;
    }
  }

  let relative = path.relative(destinationPath, basePath);
  if (!relative.startsWith(".")) {
    relative = `./${relative}`;
  }
  tsconfig.extends = relative.split(path.sep).join("/");
  await fsPromises.writeFile(
    tsconfigPath,
    JSON.stringify(tsconfig, null, 2) + "\n",
  );
};
