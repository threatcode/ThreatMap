# Autorize

Type definitions and API specification for the [Autorize](https://github.com/threatcode/threatmap) plugin.

This package is used by the `@threatmap/sdk-client` to provide fully typed access to the Autorize plugin API, enabling automated authorization testing workflows from scripts, CI/CD pipelines, and external tools.

```typescript
import { Client } from "@threatmap/sdk-client";
import type { Spec } from "@threatmap/autorize";

const client = new Client({ url: "http://localhost:8080", auth: { pat } });
await client.connect();

const autorize = await client.plugin.pluginPackage<Spec>("autorize");
const templates = await autorize.getTemplates();
```
