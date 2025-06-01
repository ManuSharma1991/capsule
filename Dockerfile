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
ENV NPM_CONFIG_CACHE="/app/.npm-cache"
ENV NPM_CONFIG_PREFIX="/app/.npm-global"
ENV PATH="/app/.npm-global/bin:${PATH}"

# PUID/PGID are often used by the runtime environment (e.g. docker-compose environment section)
# to tell an entrypoint script what UID/GID to run as or chown files to.
# Your adduser command below creates appuser with a system-assigned UID/GID unless
# you explicitly set it. The fact `id appuser` showed 1000:1000 means it matched your PUID/PGID.
# If PUID/PGID were intended to *dynamically* set appuser's UID/GID, the Dockerfile would be more complex.
# For now, we assume appuser is consistently 1000:1000 based on your `id` output.

RUN apt-get update && \
    apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*
# Removed python3, python3-dev, build-essential assuming better-sqlite3 is fine after prune

COPY backend/package.json backend/package-lock.json ./
COPY --from=backend-builder /app/backend/node_modules ./node_modules
RUN npm prune --production --prefer-offline --no-audit --progress=false

# Create appuser. adduser --system will pick a UID/GID.
# The fact it became 1000:1000 is either coincidence or your base system already had user 1000.
# To be explicit and ensure it's 1000:1000 if PUID/PGID env vars are truly driving this:
# RUN groupadd -g 1000 ibms && useradd -u 1000 -g 1000 -ms /bin/bash -d /home/ibms ibms
# For now, stick with your existing adduser, as it resulted in the correct UID/GID
RUN addgroup --system appgroup && \
    adduser --system --ingroup appgroup --home /home/appuser appuser
RUN echo "--- [PROD] appuser UID/GID (for host chown reference): ---" && id appuser

RUN mkdir -p /app/data \
    /app/logs \
    /app/.npm-cache \
    /app/.npm-global \
    /home/appuser \
    && chown -R appuser:appgroup /app \
    && chown -R appuser:appgroup /home/appuser

COPY --from=backend-builder --chown=appuser:appgroup /app/backend/dist ./dist
COPY --from=backend-builder --chown=appuser:appgroup /app/backend/drizzle.config.ts ./drizzle.config.ts
RUN sed -i "s|'./src/db/schema/main/index.ts'|'./dist/db/schema/main/index.js'|g" /app/drizzle.config.ts

COPY --from=frontend-builder --chown=appuser:appgroup /app/frontend/dist/ ./dist/frontend_build/

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER appuser # Run as appuser

EXPOSE 10000
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["node", "dist/index.js"]

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:10000/api/health || exit 1