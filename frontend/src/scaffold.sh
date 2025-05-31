#!/bin/bash

# Script to scaffold common frontend directories.
# Ensure you are in your project's 'frontend/src' directory before running this.

echo "Current directory: $(pwd)"
echo "Scaffolding project structure..."

# Define directories to create relative to the current path (.)
DIRECTORIES=(
    "assets/fonts"
    "assets/images"
    "components/common"
    "components/layout"
    "config"
    "features/auth/components"
    "features/auth/services"
    "features/auth/store"
    "features/cases/components"
    "features/cases/services"
    "features/cases/store"
    "hooks"
    "lib"
    "pages"
    "providers"
    "router"
    "services"
    "store"
    "styles"
    "types"
    "utils"
)

for dir in "${DIRECTORIES[@]}"; do
    mkdir -p "${dir}" # -p creates parent directories as needed and doesn't error if exists
    echo "Created ./${dir}"
done

echo ""
echo "Directory scaffolding complete!"
echo "You can now start adding your files to these folders."
echo ""
echo "Generated structure (run 'tree -L 3' for a better view if 'tree' is installed):"

# Attempt to display with tree, otherwise use find
if command -v tree &> /dev/null
then
    tree . -L 3 # Shows directories up to 3 levels deep
else
    echo "'tree' command not found. Listing created top-level directories and some subdirectories:"
    find . -maxdepth 2 -type d -print | sed -e 's;[^/]*/;|____;g;s;____|; |;s;[^\s];&;g' # Basic alternative
    echo "(Install 'tree' for a clearer visual representation: e.g., 'sudo apt install tree' or 'brew install tree')"
fi
