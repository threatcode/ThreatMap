#!/usr/bin/env node
import { parseArgs } from "node:util";

import { parseBurpFile } from "./burp.js";
import { Converter } from "./converter.js";

const main = (): void => {
  const { values } = parseArgs({
    options: {
      burp: { type: "string" },
      threatmap: { type: "string" },
    },
  });

  if (values.burp === undefined || values.threatmap === undefined) {
    console.error(
      "Usage: burp2threatmap --burp <export.xml> --threatmap <project folder>",
    );
    process.exit(1);
  }

  const converter = new Converter(values.threatmap);
  try {
    const items = parseBurpFile(values.burp);
    for (const item of items) {
      converter.convertItem(item);
    }
    console.log(`[*] Imported ${items.length} item(s) into ThreatMap.`);
  } finally {
    converter.close();
  }
};

main();
