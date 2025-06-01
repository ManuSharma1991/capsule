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
ENV DATABASE_FILE_PATH="/app/data/production.db" 
# ---- NPM Configuration for non-root user ----
ENV NPM_CONFIG_CACHE="/app/.npm-cache" 
ENV NPM_CONFIG_PREFIX="/app/.npm-global" 
ENV PATH="/app/.npm-global/bin:${PATH}" 

RUN echo "--- [PROD] Stage 3: Starting Production Image Setup ---"

RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 python3-dev build-essential curl && \
    rm -rf /var/lib/apt/lists/*

COPY backend/package.json backend/package-lock.json ./

# Option 1: Copy node_modules and prune (simpler for consistent dependencies)
COPY --from=backend-builder /app/backend/node_modules ./node_modules
RUN npm prune --production --prefer-offline --no-audit --progress=false
# If drizzle-kit was a devDep and got pruned, install it now into the local node_modules:
# This ensures it's available for `npm exec` without relying on global installs or npm fetching metadata.
# RUN npm install drizzle-kit # Ensure it's in dependencies in package.json to avoid this

# After dependencies are set up:
RUN apt-get purge -y --auto-remove python3 python3-dev build-essential && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# Create a non-root user and group (Debian-style)
# Set HOME directory for the user and ensure it's created
RUN addgroup --system appgroup && \
    adduser --system --ingroup appgroup --home /home/appuser --create-home appuser

# Create app-specific directories and npm cache/global directories and chown them BEFORE switching user
RUN mkdir -p /app/data \
    /app/logs \
    /app/.npm-cache \
    /app/.npm-global \
    && chown -R appuser:appgroup /app

COPY --from=backend-builder --chown=appuser:appgroup /app/backend/dist ./dist
COPY --from=backend-builder --chown=appuser:appgroup /app/backend/drizzle.config.ts ./drizzle.config.ts

COPY --from=frontend-builder --chown=appuser:appgroup /app/frontend/dist/ ./dist/frontend_build/

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Change to non-root user
USER appuser
# ---- Set HOME for the appuser ----
ENV HOME="/home/appuser" 

EXPOSE 10000
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["node", "dist/index.js"]

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:10000/api/health || exit 1