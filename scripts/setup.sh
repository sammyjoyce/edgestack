#!/bin/bash

# Script to install project dependencies and verify required CLI tools
# Usage: ./scripts/setup.sh

set -euo pipefail

# Install dependencies using Bun
printf "\n📦 Installing dependencies with Bun...\n"
bun install

echo
# Verify wrangler CLI is available
if bunx wrangler --version > /dev/null 2>&1; then
  printf "✅ Wrangler installed: %s\n" "$(bunx wrangler --version)"
else
  echo "❌ Wrangler is not installed. Install it with 'bun add -g wrangler'"
  exit 1
fi

echo
# Verify Biome CLI is available
if bunx biome --version > /dev/null 2>&1; then
  printf "✅ Biome installed: %s\n" "$(bunx biome --version)"
else
  echo "❌ Biome is not installed. Install it with 'bun add -g @biomejs/biome'"
  exit 1
fi

echo "\n🎉 Setup complete."
