# ---- Stage 1: Build Frontend ----
# ... (no changes needed here for this specific requirement) ...
FROM node:24-bookworm AS frontend-builder
WORKDIR /app/frontend
ENV NODE_ENV=development
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ---- Stage 2: Build Backend ----
FROM node:24-bookworm AS backend-builder
WORKDIR /app/backend
ENV NODE_ENV=development

# ARG for a TEMPORARY database file name for build-time validation if needed
ARG TEMP_DB_FILE_NAME_ARG="temporary.db"
ENV PRODUCTION_DB_FILE_NAME=$TEMP_DB_FILE_NAME_ARG 

RUN echo "--- [BACKEND] Stage 2: Starting Backend Build ---"
RUN echo "--- [BACKEND] TEMP_DB_FILE_NAME for build is: $PRODUCTION_DB_FILE_NAME ---"

RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 python3-dev build-essential && \
    rm -rf /var/lib/apt/lists/*

COPY backend/package.json backend/package-lock.json ./
COPY backend/drizzle.config.ts ./

RUN npm_config_loglevel=verbose npm ci --prefer-offline --no-audit

COPY backend/ ./

# Optional: Validate schema with drizzle-kit push against a temporary DB during build
# This ensures your drizzle.config.ts and schemas are valid.
# The temp_build_db.sqlite created here is NOT for production persistence.
RUN echo "--- [BACKEND] Validating Drizzle schema (using temporary DB) ---"
RUN npx drizzle-kit push

# If you want to generate SQL migration files and bundle them:
# RUN npx drizzle-kit generate # This would output to your 'out' directory

RUN apt-get purge -y --auto-remove python3 python3-dev build-essential && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

RUN npm run build # Compile your TypeScript, including Drizzle schema code

RUN echo "--- [BACKEND] Stage 2: Backend Build Complete ---"


# ---- Stage 3: Production Image ----
FROM node:24-bookworm
WORKDIR /app
ENV NODE_ENV=production
# This will be the *actual* path to the database file inside the container,
# which will be backed by a Docker Volume.
ENV DATABASE_FILE_PATH="/app/data/production.db"

RUN echo "--- [PROD] Stage 3: Starting Production Image Setup ---"

# Install Drizzle Kit and any other runtime tools needed for migrations at startup
# Also install build tools if any runtime dependencies (like better-sqlite3) need them.
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 python3-dev build-essential curl && \
    rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json to install production deps + drizzle-kit
COPY backend/package.json backend/package-lock.json ./
# We need drizzle-kit and its dependencies at runtime for the entrypoint script.
# So, install all dependencies that are not devDependencies, plus ensure drizzle-kit is there.
# If drizzle-kit is a devDependency, you might need to install it explicitly or ensure
# your `npm ci --omit=dev` still gets what's needed if you are not using `npm prune`.
# For simplicity, let's assume drizzle-kit will be available from a full `npm ci` if we are not careful
# A safer bet is to ensure `drizzle-kit` and `drizzle-orm` are in `dependencies` not `devDependencies`
# if you intend to use them at runtime like this.
# OR, copy node_modules from builder (as discussed before) and then add drizzle-kit if missing.

# Option 1: Copy node_modules and prune (simpler for consistent dependencies)
COPY --from=backend-builder /app/backend/node_modules ./node_modules
RUN npm prune --production --prefer-offline --no-audit --progress=false
# If drizzle-kit was a devDep and got pruned, install it now:
# RUN npm install drizzle-kit drizzle-orm # Add any other ORM packages

# Option 2: Fresh install of production deps (might recompile native modules)
# RUN npm ci --omit=dev --prefer-offline --no-audit --progress=false
# RUN npm install drizzle-kit # Ensure drizzle-kit is present for runtime migrations

# We need the build tools for better-sqlite3 if using Option 2, or if prune/copy doesn't get it right.
# (They are already installed above for this stage)

# After dependencies are set up:
RUN apt-get purge -y --auto-remove python3 python3-dev build-essential && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*


RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

COPY --from=backend-builder --chown=appuser:appgroup /app/backend/dist ./dist
COPY --from=backend-builder --chown=appuser:appgroup /app/backend/drizzle.config.ts ./drizzle.config.ts
# If you generated SQL migrations, copy them too:
# COPY --from=backend-builder --chown=appuser:appgroup /app/backend/drizzle ./drizzle

COPY --from=frontend-builder --chown=appuser:appgroup /app/frontend/dist/ ./dist/frontend_build/

# Create the data directory where the volume will be mounted
RUN mkdir -p /app/data && chown appuser:appgroup /app/data
RUN mkdir -p /app/logs && chown appuser:appgroup /app/logs

# Copy the entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER appuser
EXPOSE 10000

# The entrypoint script will handle migrations and then run the app
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
# CMD is now part of the entrypoint script, but you can provide a default here if needed
CMD ["node", "dist/index.js"]

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:10000/api/health || exit 1