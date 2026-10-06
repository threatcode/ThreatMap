import { Client } from "@threatmap/sdk-client";
import type { Spec as QuickSSRFSpec } from "@threatmap/quickssrf";

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

  const pluginPackage =
    await client.plugin.pluginPackage<QuickSSRFSpec>("quickssrf");
  if (pluginPackage === undefined) {
    console.error("❌ Error: Plugin package not found");
    process.exit(1);
  }

  // Get the providers
  const providers = await pluginPackage.getProviders();
  if (providers.kind === "Error") {
    console.error("❌ Error: Failed to get providers");
    console.error("   Error:", providers.error);
    process.exit(1);
  }
  if (providers.value.length === 0) {
    console.error("❌ Error: No providers found");
    process.exit(1);
  }
  console.log("✅ Providers:", providers.value);

  // Create a session
  const session = await pluginPackage.createSession(providers.value[0]!.id);
  if (session.kind === "Error") {
    console.error("❌ Error: Failed to create session");
    console.error("   Error:", session.error);
    process.exit(1);
  }
  console.log("✅ Session:", session.value);

  // Subscribe to the session events
  console.log("✅ Subscribing to interactions");
  for await (const [event] of pluginPackage.subscribeEvent(
    "interaction:received",
  )) {
    if (event.sessionId === session.value.id) {
      for (const interaction of event.interactions) {
        console.log("✅ Interaction received:", interaction);
      }
    }
  }
}

main().catch((error: unknown) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
