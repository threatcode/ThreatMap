import { readFileSync } from "node:fs";

import { Client } from "@threatmap/sdk-client";

async function main() {
  // Get the Threatmap instance URL from environment or use default
  const instanceUrl =
    process.env["THREATMAP_INSTANCE_URL"] ?? "http://localhost:8080";

  // Get the Personal Access Token from environment
  const pat = process.env["THREATMAP_PAT"];
  if (pat === undefined || pat === "") {
    console.error("❌ Error: THREATMAP_PAT environment variable is required");
    console.error("   Set it with: export THREATMAP_PAT=threatmap_xxxxx");
    process.exit(1);
  }

  // Get the file path from command line argument or use default
  const filePath = process.argv[2] ?? "test.txt";
  const fileName = process.argv[3] ?? filePath.split("/").pop() ?? "test.txt";

  // Read the file from the filesystem
  let fileBuffer: Buffer;
  try {
    fileBuffer = readFileSync(filePath);
  } catch (error) {
    console.error(`❌ Error: Could not read file "${filePath}"`);
    console.error(
      `   ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }

  // Create a File object from the buffer
  // Convert Buffer to Uint8Array for File constructor compatibility
  const file = new File([new Uint8Array(fileBuffer)], fileName, {
    type: "application/octet-stream",
  });

  const client = new Client({
    url: instanceUrl,
    auth: {
      pat: pat,
      cache: {
        file: ".secrets.json",
      },
    },
  });

  await client.connect();
  console.log("✅ Connected to Threatmap instance");

  // Upload the file
  console.log(`📤 Uploading file "${fileName}"...`);
  const hostedFile = await client.hostedFile.upload({
    name: fileName,
    file: file,
  });

  console.log("✅ File uploaded successfully!");
  console.log(`   ID: ${hostedFile.id}`);
  console.log(`   Name: ${hostedFile.name}`);
  console.log(`   Path: ${hostedFile.path}`);
  console.log(`   Size: ${hostedFile.size} bytes`);
  console.log(`   Status: ${hostedFile.status}`);
}

main().catch((error: unknown) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
