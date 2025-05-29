#!/bin/bash

# Script to scaffold the backend directory structure for TCMS
# IMPORTANT: Run this script from the root of your monorepo (e.g., where 'packages/' directory is)
# MAKE SURE TO BACKUP YOUR PROJECT OR COMMIT CHANGES BEFORE RUNNING!

BACKEND_DIR="backend"
SRC_DIR="$BACKEND_DIR/src"

echo "Starting scaffolding for backend structure in $BACKEND_DIR..."
echo "This script will NOT overwrite existing files or directories."
echo "You will need to manually move/integrate your existing code into the new structure."
echo ""

# Helper function to create directory if it doesn't exist
create_dir_if_not_exists() {
  if [ ! -d "$1" ]; then
    mkdir -p "$1"
    echo "Created directory: $1"
  else
    echo "Directory already exists: $1"
  fi
}

# Helper function to create file if it doesn't exist
create_file_if_not_exists() {
  if [ ! -f "$1" ]; then
    # Add a simple // placeholder comment to new .ts files
    if [[ "$1" == *.ts ]]; then
      echo "// Placeholder for $1 - Created by scaffold script" > "$1"
    else
      touch "$1"
    fi
    echo "Created file: $1"
  else
    echo "File already exists: $1"
  fi
}

# --- Ensure base backend and src directories exist (they should from your image) ---
create_dir_if_not_exists "$BACKEND_DIR"
create_dir_if_not_exists "$SRC_DIR"

# --- Create directories and files within $SRC_DIR ---

# Main src level files (app.ts is new)
create_file_if_not_exists "$SRC_DIR/app.ts"
# Your server.ts, index.ts, db.ts, swaggerConfig.ts already exist in src/ - leave them for manual integration.

# api/ directory and its feature modules
create_dir_if_not_exists "$SRC_DIR/api"
api_modules=("cases" "hearings" "auth" "import" "staging" "reports" "lookups")
for module in "${api_modules[@]}"; do
  create_dir_if_not_exists "$SRC_DIR/api/$module"
  create_file_if_not_exists "$SRC_DIR/api/$module/$module.controller.ts"
  create_file_if_not_exists "$SRC_DIR/api/$module/$module.routes.ts"
  create_file_if_not_exists "$SRC_DIR/api/$module/$module.service.ts"
  # Add validation stubs for modules where it's more likely needed first
  if [[ "$module" == "cases" || "$module" == "hearings" || "$module" == "auth" ]]; then
    create_file_if_not_exists "$SRC_DIR/api/$module/$module.validation.ts"
  fi
done

# config/ directory
create_dir_if_not_exists "$SRC_DIR/config"
create_file_if_not_exists "$SRC_DIR/config/index.ts"
create_file_if_not_exists "$SRC_DIR/config/db.config.ts"
create_file_if_not_exists "$SRC_DIR/config/jwt.config.ts"
create_file_if_not_exists "$SRC_DIR/config/server.config.ts"

# db/ directory structure (you have src/db/ and src/schema/)
# This script will add the new proposed structure within src/db/
# It will create src/db/index.ts (you currently have src/db.ts at the src/ level)
create_file_if_not_exists "$SRC_DIR/db/index.ts" # New index.ts inside db/

# Schema subdirectories (you currently have src/schema/schema.ts)
create_dir_if_not_exists "$SRC_DIR/db/schema" # This should already exist from your structure
create_file_if_not_exists "$SRC_DIR/db/schema/index.ts" # To export all schemas
create_dir_if_not_exists "$SRC_DIR/db/schema/main"
create_file_if_not_exists "$SRC_DIR/db/schema/main/case.schema.ts"
create_file_if_not_exists "$SRC_DIR/db/schema/main/hearing.schema.ts"
create_file_if_not_exists "$SRC_DIR/db/schema/main/user.schema.ts"
create_dir_if_not_exists "$SRC_DIR/db/schema/staging"
create_file_if_not_exists "$SRC_DIR/db/schema/staging/stagedCase.schema.ts"
create_file_if_not_exists "$SRC_DIR/db/schema/staging/stagedHearing.schema.ts"

# Migrations and Seeds within src/db/
create_dir_if_not_exists "$SRC_DIR/db/migrations"
create_dir_if_not_exists "$SRC_DIR/db/migrations/meta" # For Drizzle Kit if configured here
# You have a 'drizzle' folder at packages/backend/drizzle, Drizzle Kit might be configured to use that.
# This script creates a structure if you want migrations under src/db/
create_file_if_not_exists "$SRC_DIR/db/migrations/0000_placeholder_migration.sql"

create_dir_if_not_exists "$SRC_DIR/db/seeds"
create_file_if_not_exists "$SRC_DIR/db/seeds/seed.ts"

# middleware/ directory
create_dir_if_not_exists "$SRC_DIR/middleware"
create_file_if_not_exists "$SRC_DIR/middleware/isAuthenticated.ts"
create_file_if_not_exists "$SRC_DIR/middleware/errorHandler.ts"
create_file_if_not_exists "$SRC_DIR/middleware/validateRequest.ts"
create_file_if_not_exists "$SRC_DIR/middleware/notFoundHandler.ts"

# services/ directory (top-level, optional)
create_dir_if_not_exists "$SRC_DIR/services"
create_file_if_not_exists "$SRC_DIR/services/queryBuilder.service.ts"

# utils/ directory
create_dir_if_not_exists "$SRC_DIR/utils"
create_file_if_not_exists "$SRC_DIR/utils/logger.ts"
create_file_if_not_exists "$SRC_DIR/utils/helpers.ts"
create_file_if_not_exists "$SRC_DIR/utils/apiError.ts"

# --- Create directories and files within $BACKEND_DIR (outside src) ---
create_dir_if_not_exists "$BACKEND_DIR/data" # For SQLite .db files
create_file_if_not_exists "$BACKEND_DIR/.env.example" # Template for .env

echo ""
echo "---------------------------------------------------------------------"
echo "Backend scaffolding attempt complete."
echo "Please review the output above and your directory structure."
echo ""
echo "MANUAL INTEGRATION STEPS REQUIRED:"
echo "----------------------------------"
echo "1. Your existing code in:"
echo "   - $SRC_DIR/controllers/"
echo "   - $SRC_DIR/routers/"
echo "   Needs to be moved into the new module folders under $SRC_DIR/api/ (e.g., $SRC_DIR/api/cases/)."
echo ""
echo "2. Your existing Drizzle schemas in:"
echo "   - $SRC_DIR/schema/schema.ts"
echo "   Need to be split and moved into the new schema files under:"
echo "   - $SRC_DIR/db/schema/main/"
echo "   - $SRC_DIR/db/schema/staging/"
echo "   And then exported via $SRC_DIR/db/schema/index.ts."
echo ""
echo "3. Your Drizzle client initialization in:"
echo "   - $SRC_DIR/db.ts"
echo "   Should likely be moved to the new $SRC_DIR/db/index.ts."
echo ""
echo "4. Your main Express application setup, likely in:"
echo "   - $SRC_DIR/index.ts (or app.ts if you named it that already)"
echo "   Should be primarily in the new $SRC_DIR/app.ts. Your existing $SRC_DIR/server.ts can continue to import 'app' and start the server."
echo ""
echo "5. Your $SRC_DIR/swaggerConfig.ts can remain or be moved to $SRC_DIR/config/ if preferred."
echo ""
echo "6. Review your drizzle.config.ts to ensure its 'schema' and 'out' paths align with either your existing 'packages/backend/drizzle' folder or the new '$SRC_DIR/db/migrations/' if you choose to use that."
echo ""
echo "7. Populate the newly created .ts files with your logic or placeholder comments."
echo "8. Ensure your .gitignore is correctly set up (e.g., to ignore $BACKEND_DIR/data/*.db and $BACKEND_DIR/.env)."
echo "---------------------------------------------------------------------"