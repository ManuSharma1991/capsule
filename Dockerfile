# ---- Stage 1: Build Frontend ----
FROM node:24-alpine AS frontend-builder
WORKDIR /app/frontend
ENV NODE_ENV=development

RUN echo "--- [FRONTEND] Stage 1: Starting Frontend Build ---"

RUN echo "--- [FRONTEND] Copying package files ---"
COPY frontend/package.json frontend/package-lock.json ./

RUN echo "--- [FRONTEND] Installing dependencies (npm ci) ---"
# If frontend had native dependencies, add build tools here too
RUN npm ci

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

# Install build tools needed for native modules (like sqlite3, better-sqlite3)
RUN echo "--- [BACKEND] Installing build tools (python3, make, g++) ---"
RUN apk add --no-cache python3 make g++

RUN echo "--- [BACKEND] Copying package files ---"
COPY backend/package.json backend/package-lock.json ./

RUN echo "--- [BACKEND] Installing dependencies (npm ci) ---"
RUN npm ci --prefer-offline --no-audit --progress=false

# Optional: Remove build tools if they are not needed for the `npm run build` step itself
# and you want to keep this stage slightly leaner.
# If `npm run build` in backend *also* triggers compilation of native modules, keep them.
# For a typical `tsc` build, they are not needed.
RUN echo "--- [BACKEND] Removing build tools ---"
RUN apk del python3 make g++

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

# Install curl for the HEALTHCHECK.
# Build tools are needed again for runtime dependencies if they are native.
RUN echo "--- [PROD] Installing OS dependencies (curl, python3, make, g++) ---"
RUN apk add --no-cache curl python3 make g++

# Install runtime dependencies only (npm ci --omit=dev)
COPY backend/package.json backend/package-lock.json ./
RUN echo "--- [PROD] Installing backend runtime dependencies ---"
RUN npm ci --omit=dev --prefer-offline --no-audit --progress=false

# Remove build tools after dependencies are installed to keep image small
RUN echo "--- [PROD] Removing build tools ---"
RUN apk del python3 make g++

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy built backend from backend-builder stage
RUN echo "--- [PROD] Copying built backend artifacts ---"
COPY --from=backend-builder --chown=appuser:appgroup /app/backend/dist ./dist

# Create the target directory for the frontend build *inside* the backend's dist directory
RUN mkdir -p /app/dist/frontend_build && chown appuser:appgroup /app/dist/frontend_build

RUN echo "--- [PROD] Copying built frontend artifacts to /app/dist/frontend_build/ ---"
COPY --from=frontend-builder --chown=appuser:appgroup /app/frontend/dist/ ./dist/frontend_build/

RUN echo "--- [PROD] Creating data directory ---"
RUN mkdir -p /app/data && chown appuser:appgroup /app/data

RUN echo "--- [PROD] Creating log directory ---"
RUN mkdir -p /app/logs && chown appuser:appgroup /app/logs

# Change to non-root user
USER appuser

EXPOSE 10000
CMD ["node", "dist/index.js"]

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:10000/api/health || exit 1

# Final echo to indicate the Dockerfile parsing is complete (for build log, not runtime)
RUN echo "--- Dockerfile build definition complete ---"