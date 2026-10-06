# PAT Authentication Example

This example demonstrates how to authenticate with a Threatmap instance using a Personal Access Token (PAT).

## Usage

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Set the required environment variables:

   ```bash
   export THREATMAP_PAT=threatmap_xxxxx
   export THREATMAP_INSTANCE_URL=http://localhost:8080  # optional, defaults to localhost:8080
   ```

3. Run the example:

   ```bash
   pnpm start
   ```

## Environment Variables

- `THREATMAP_PAT` - Your Personal Access Token (required)
- `THREATMAP_INSTANCE_URL` - The URL of your Threatmap instance (default: `http://localhost:8080`)

## Getting a PAT

Follow [our guide](https://docs.threatmap.io/dashboard/guides/create_pat.html) to learn how to create a Personal Access Token.
