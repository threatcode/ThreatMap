import {
  AuthClient,
  AuthenticationError,
  PATApprover,
} from "@threatmap/server-auth";

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

  console.log(`Connecting to Threatmap instance at: ${instanceUrl}\n`);

  // Optional: Filter scopes if needed
  // const allowedScopes = ["read:projects", "write:requests"];
  // const approver = new PATApprover({ pat, allowedScopes });

  // Create a PAT approver that automatically approves the device
  const approver = new PATApprover({ pat });

  // Create the auth client
  const auth = new AuthClient({
    instanceUrl,
    approver,
  });

  try {
    console.log("Starting authentication flow...");
    // Start the authentication flow
    const token = await auth.startAuthenticationFlow();

    console.log("\n✅ Authentication successful!");
    console.log(`Access Token: ${token.accessToken.substring(0, 20)}...`);
    console.log(`Expires at: ${token.expiresAt.toISOString()}`);
    console.log(`Refresh Token: ${token.refreshToken.substring(0, 20)}...`);
  } catch (error: unknown) {
    if (error instanceof AuthenticationError) {
      console.error(`❌ Authentication error: ${error.message}`);
      process.exit(1);
    } else {
      console.error("❌ Unexpected error:", error);
      process.exit(1);
    }
  }
}

main().catch((error: unknown) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
