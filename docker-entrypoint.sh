#!/bin/sh
set -e

export PRODUCTION_DB_FILE_NAME="${DATABASE_FILE_PATH}"
DB_DIR=$(dirname "$PRODUCTION_DB_FILE_NAME")

echo "--- Entrypoint (running as $(whoami) UID: $(id -u) GID: $(id -g)) ---"
echo "--- Database file target for Drizzle: $PRODUCTION_DB_FILE_NAME ---"
echo "--- Directory $DB_DIR permissions on entry: ---"
ls -ld "$DB_DIR" # Should now show ownership mapping to appuser

echo "--- Attempting to touch a test file in $DB_DIR (as $(whoami)) ---"
touch "$DB_DIR/test_writable_as_appuser.txt" && echo "Successfully touched test_writable_as_appuser.txt" || echo "ERROR: Could not write to $DB_DIR"
if [ -f "$DB_DIR/test_writable_as_appuser.txt" ]; then
    rm -f "$DB_DIR/test_writable_as_appuser.txt"
fi

mkdir -p "$DB_DIR" # Should succeed now

echo "--- Running Drizzle Migrations (drizzle-kit push) ---"
npm exec -- drizzle-kit push

echo "--- Drizzle Migrations Complete ---"
echo "--- Starting Application: $@ ---"
exec "$@"