#!/bin/bash

# Script to seed the Lush Constructions database with content and projects
# Usage: ./scripts/seed-database.sh [--remote]
#
# Based on Cloudflare D1 + Wrangler best practices (May 2025)

set -e

# Default to local mode
REMOTE_FLAG="--local"
DB_ID="89bb8c60-84fb-4f13-9320-e5cf623f4963" # Extracted from wrangler.jsonc
LOCAL_DB_DIR=".wrangler/state/v3/d1/${DB_ID}"
LOCAL_DB_FILE_PATH="${LOCAL_DB_DIR}/db.sqlite"

# Check if --remote flag is passed
if [ "$1" = "--remote" ]; then
  REMOTE_FLAG="--remote"
  echo "⚠️  Running in REMOTE mode - this will update the production database!"
  printf "Are you sure you want to continue? (y/n) "
  read -r REPLY_VAL
  case "$REPLY_VAL" in
    [Yy]*) echo "Proceeding with remote seed." ;;
    *)
      echo "Aborting."
      exit 1
      ;;
  esac
else
  # Local mode: Reset local D1 database by deleting its directory
  if [ -d "$LOCAL_DB_DIR" ]; then
    echo "🗑️  Resetting local D1 database by deleting directory $LOCAL_DB_DIR..."
    rm -rf "$LOCAL_DB_DIR"
    if [ $? -eq 0 ]; then
      echo "✅ Local D1 database directory deleted."
    else
      echo "❌ Error deleting local D1 database directory. Please check permissions or delete it manually."
      exit 1
    fi
  else
    echo "ℹ️  Local D1 database directory not found at $LOCAL_DB_DIR. Assuming clean state or first run."
  fi
  # Ensure the directory exists for Wrangler to create the new db.sqlite file
  mkdir -p "$LOCAL_DB_DIR"
fi

# Database name from wrangler.jsonc
DB_NAME="lush-content-db"

echo "🌱 Seeding database with initial content and projects..."
echo "Using mode: ${REMOTE_FLAG}"

# Run our SQL seed file with proper error handling
# For local, this will now run on a clean database if the file was present and deleted.
if npx wrangler d1 execute $DB_NAME --file=./seeds/initial-data.sql $REMOTE_FLAG; then
  echo "✅ Database seeding completed successfully!"
else
  echo "❌ Error seeding database. See above for details."
  exit 1
fi
