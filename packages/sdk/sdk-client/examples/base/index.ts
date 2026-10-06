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

  const viewer = await client.user.viewer();
  console.log("Viewer: ", JSON.stringify(viewer, null, 2));
}

main().catch((error: unknown) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
