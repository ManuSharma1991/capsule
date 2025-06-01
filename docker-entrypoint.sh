#!/bin/sh
set -e

export PRODUCTION_DB_FILE_NAME="${DATABASE_FILE_PATH}"

echo "--- Entrypoint: Current user: $(whoami) ---"
echo "--- Entrypoint: HOME directory: $HOME ---"
echo "--- Entrypoint: NPM cache: $(npm config get cache) ---"
echo "--- Database file target: $PRODUCTION_DB_FILE_NAME ---"

DB_DIR=$(dirname "$PRODUCTION_DB_FILE_NAME")

echo "--- Entrypoint: Checking permissions for $DB_DIR ---"
ls -ld "$DB_DIR" || echo "Warning: Could not list $DB_DIR"
echo "--- Entrypoint: Checking permissions for parent of $DB_DIR (/app) ---"
ls -ld "$(dirname "$DB_DIR")" || echo "Warning: Could not list parent of $DB_DIR"

echo "--- Entrypoint: Attempting to create directory $DB_DIR (if it doesn't exist) ---"
mkdir -p "$DB_DIR"
echo "--- Entrypoint: Directory $DB_DIR should now exist. Listing again: ---"
ls -ld "$DB_DIR" || echo "Warning: Could not list $DB_DIR after mkdir -p"

echo "--- Entrypoint: Attempting to touch a test file in $DB_DIR ---"
touch "$DB_DIR/test_writable.txt" && echo "Successfully touched test_writable.txt" || echo "ERROR: Could not write to $DB_DIR"
rm -f "$DB_DIR/test_writable.txt"

echo "--- Entrypoint: Running Drizzle Migrations (drizzle-kit push) ---"
npm exec -- drizzle-kit push

echo "--- Entrypoint: Drizzle Migrations Complete ---"
echo "--- Entrypoint: Starting Application ---"

exec "$@"