#!/bin/bash

# Script to seed the Lush Constructions database with content and projects
# Usage: ./scripts/seed-database.sh [--remote]
#
# Based on Cloudflare D1 + Wrangler best practices (May 2025)

set -e

# Default to local mode
REMOTE_FLAG="--local"

# Check if --remote flag is passed
if [ "$1" = "--remote" ]; then
  REMOTE_FLAG="--remote"
  echo "⚠️  Running in REMOTE mode - this will update the production database!"
  read -p "Are you sure you want to continue? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborting."
    exit 1
  fi
fi

# Database name from wrangler.jsonc
DB_NAME="lush-content-db"

echo "🌱 Seeding database with initial content and projects..."
echo "Using mode: ${REMOTE_FLAG}"

# Run our SQL seed file with proper error handling
if npx wrangler d1 execute $DB_NAME --file=./seeds/initial-data.sql $REMOTE_FLAG; then
  echo "✅ Database seeding completed successfully!"
else
  echo "❌ Error seeding database. See above for details."
  exit 1
fi
