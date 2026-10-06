## 👋 Workflow SDK

[![NPM Version](https://img.shields.io/npm/v/@threatmap/sdk-workflow?style=for-the-badge)](https://www.npmjs.com/package/@threatmap/sdk-workflow)

This is repository for the Threatmap workflow SDK.

You usually don't need to use this package directly since typing is already included in the runtime.

But this can be useful if you want to write to code externally in Typescript and built it to JS.

```typescript
import { PassiveInput, SDK, Data } from "./typing";

export async function run(
  input: PassiveInput,
  sdk: SDK,
): Promise<Data | undefined> {
  if (input.request) {
    sdk.console.log(input.request.getMethod());
  }
  return;
}
```
