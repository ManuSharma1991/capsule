#!/bin/sh
set -e # Exit immediately if a command exits with a non-zero status.

# Drizzle config expects PRODUCTION_DB_FILE_NAME, but our persistent DB is at DATABASE_FILE_PATH
# We will tell drizzle-kit to use the DATABASE_FILE_PATH by overriding the config
# or by ensuring drizzle.config.ts can use DATABASE_FILE_PATH.

# Modify drizzle.config.ts to prioritize DATABASE_FILE_PATH if present
# This is a bit of a hack for build vs runtime. A better way is to have separate configs
# or make the config more flexible.
# For now, let's assume drizzle.config.ts will use PRODUCTION_DB_FILE_NAME
# and we set that ENV var to point to our volume-mounted path.

export PRODUCTION_DB_FILE_NAME="${DATABASE_FILE_PATH}"

echo "--- Entrypoint: Running Drizzle Migrations (drizzle-kit push) ---"
echo "--- Database file target: $PRODUCTION_DB_FILE_NAME ---"

# Ensure the directory for the SQLite file exists (it should if /app/data was created and mounted)
mkdir -p "$(dirname "$PRODUCTION_DB_FILE_NAME")"

# Run drizzle-kit push
# npx needs to be in the path, or use full path /app/node_modules/.bin/npx
# Using `npm exec` is generally safer in scripts as it resolves from local node_modules
npm exec -- drizzle-kit push # No 'npx' prefix needed with npm exec

echo "--- Entrypoint: Drizzle Migrations Complete ---"
echo "--- Entrypoint: Starting Application ---"

# Execute the CMD passed to the docker run command, or the Dockerfile's CMD
exec "$@"