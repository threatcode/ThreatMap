#!/usr/bin/env node
import { prompt } from "./prompt.js";
import { scaffold } from "./scaffold.js";

const main = async (): Promise<void> => {
  const config = await prompt();
  await scaffold(config);
};

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
