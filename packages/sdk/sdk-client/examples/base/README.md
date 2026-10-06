# Base Example

A simple example demonstrating how to connect to a Threatmap instance and fetch user information using the SDK.

## What it does

This example:

1. Creates a Threatmap client with Personal Access Token (PAT) authentication
2. Connects to the Threatmap instance
3. Fetches and displays the current viewer's information

## Prerequisites

- Node.js installed
- A Threatmap instance running (default: `http://localhost:8080`)
- A Personal Access Token (PAT) from your Threatmap instance

## Setup

1. Set the `THREATMAP_INSTANCE_URL` environment variable (optional, defaults to `http://localhost:8080`):

   ```bash
   export THREATMAP_INSTANCE_URL=http://localhost:8080
   ```

2. Set the `THREATMAP_PAT` environment variable with your Personal Access Token:

   ```bash
   export THREATMAP_PAT=threatmap_xxxxx
   ```

## Running

```bash
pnpm start
```
