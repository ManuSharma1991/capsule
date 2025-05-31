# ---- Stage 1: Build Frontend ----
FROM node:24-alpine AS frontend-builder
WORKDIR /app/frontend
ENV NODE_ENV=development 

RUN echo "--- [FRONTEND] Stage 1: Starting Frontend Build ---"

RUN echo "--- [FRONTEND] Copying package files ---"
COPY frontend/package.json frontend/package-lock.json ./
# If using pnpm: COPY frontend/pnpm-lock.yaml ./
# If using yarn: COPY frontend/yarn.lock ./

RUN echo "--- [FRONTEND] Installing dependencies (npm ci) ---"
RUN npm ci
# If using pnpm: RUN corepack enable && pnpm install --frozen-lockfile
# If using yarn: RUN yarn install --frozen-lockfile

RUN echo "--- [FRONTEND] Listing node_modules/.bin to check for vite and tsc ---"
RUN ls -l node_modules/.bin || echo "node_modules/.bin not found or empty"
RUN test -f node_modules/.bin/vite && echo "Vite CLI found" || echo "Vite CLI NOT FOUND"
RUN test -f node_modules/.bin/tsc && echo "TSC CLI found" || echo "TSC CLI NOT FOUND"

RUN echo "--- [FRONTEND] Copying rest of frontend source code ---"
COPY frontend/ ./

RUN echo "--- [FRONTEND] Running build script: npm run build (tsc -b && vite build) ---"
RUN npm run build
RUN echo "--- [FRONTEND] Listing frontend build output (dist directory) ---"
RUN ls -R dist || echo "Frontend dist directory not found"
RUN echo "--- [FRONTEND] Stage 1: Frontend Build Complete ---"


# ---- Stage 2: Build Backend ----
FROM node:24-alpine AS backend-builder
WORKDIR /app/backend
ENV NODE_ENV=development 

RUN echo "--- [BACKEND] Stage 2: Starting Backend Build ---"

# Install build tools needed for native modules even in the builder if they are dev dependencies
# or if you want to ensure they build correctly here.
# However, the primary issue is in the production stage.
# If you have native devDependencies, you'd add them here too.
# RUN apk add --no-cache python3 make g++

RUN echo "--- [BACKEND] Copying package files ---"
COPY backend/package.json backend/package-lock.json ./
# If using pnpm: COPY backend/pnpm-lock.yaml ./
# If using yarn: COPY backend/yarn.lock ./

RUN echo "--- [BACKEND] Installing dependencies (npm ci) ---"
# If backend also has native modules that need building during dev dep install, add build tools here.
# For now, assuming only runtime native modules matter for the error.
RUN npm ci
# If using pnpm: RUN corepack enable && pnpm install --frozen-lockfile
# If using yarn: RUN yarn install --frozen-lockfile

RUN echo "--- [BACKEND] Listing node_modules/.bin to check for tsc ---"
RUN ls -l node_modules/.bin || echo "node_modules/.bin not found or empty"
RUN test -f node_modules/.bin/tsc && echo "TSC CLI found" || echo "TSC CLI NOT FOUND in backend"

RUN echo "--- [BACKEND] Copying rest of backend source code ---"
COPY backend/ ./

RUN echo "--- [BACKEND] Running build script: npm run build (tsc) ---"
RUN npm run build
RUN echo "--- [BACKEND] Listing backend build output (dist directory) ---"
RUN ls -R dist || echo "Backend dist directory not found"
RUN echo "--- [BACKEND] Stage 2: Backend Build Complete ---"


# ---- Stage 3: Production Image ----
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production

RUN echo "--- [PROD] Stage 3: Starting Production Image Setup ---"

# Install curl for the HEALTHCHECK and any other OS-level dependencies
# Also install build tools temporarily for native module compilation
RUN apk add --no-cache curl python3 make g++

# Install runtime dependencies only (npm ci --omit=dev)
# Need to copy package.json and package-lock.json first for this stage as well
COPY backend/package.json backend/package-lock.json ./
RUN echo "--- [PROD] Installing backend runtime dependencies ---"
RUN npm ci --omit=dev --prefer-offline --no-audit --progress=false
# If you had frontend runtime dependencies that weren't bundled (rare for Vite), handle similarly.

# Remove build tools after dependencies are installed
RUN apk del python3 make g++

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy built backend from backend-builder stage
# We copy the whole dist, not just specific files from node_modules, because npm ci handled runtime deps
RUN echo "--- [PROD] Copying built backend artifacts ---"
COPY --from=backend-builder --chown=appuser:appgroup /app/backend/dist ./dist
# Now /app/dist contains your backend build

# Create the target directory for the frontend build *inside* the backend's dist directory
# Ensure it's owned by the appuser
RUN mkdir -p /app/dist/frontend_build && chown appuser:appgroup /app/dist/frontend_build

RUN echo "--- [PROD] Copying built frontend artifacts to /app/dist/frontend_build/ ---"
COPY --from=frontend-builder --chown=appuser:appgroup /app/frontend/dist/ ./dist/frontend_build/

RUN echo "--- [PROD] Creating data directory ---"
RUN mkdir -p /app/data && chown appuser:appgroup /app/data

RUN echo "--- [PROD] Creating log directory ---"
RUN mkdir -p /app/logs && chown appuser:appgroup /app/logs # Corrected this line

# Change to non-root user
USER appuser

# Expose the application port
EXPOSE 10000

# Command to run the application
# Assumes your backend's compiled entry point is dist/index.js
CMD ["node", "dist/index.js"]
RUN echo "--- [PROD] Stage 3: Production Image Setup Complete ---" # This RUN echo won't execute at runtime, but during build

# Optional: Add a healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:10000/api/health || exit 1