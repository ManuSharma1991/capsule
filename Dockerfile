# ---- Stage 1: Build Frontend ----
FROM node:24-alpine AS frontend-builder
WORKDIR /app/frontend
ENV NODE_ENV=development

RUN echo "--- [FRONTEND] Stage 1: Starting Frontend Build ---"
# Alpine typically comes with python3 (3.12 in this base). If frontend needed specific python for node-gyp,
# it would need similar treatment as backend. Assuming frontend build is fine.
RUN echo "--- [FRONTEND] Copying package files ---"
COPY frontend/package.json frontend/package-lock.json ./

RUN echo "--- [FRONTEND] Installing dependencies (npm ci) ---"
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

# Install specific Python version (3.11) and build tools
RUN echo "--- [BACKEND] Installing build tools (python3.11, make, g++) ---"
RUN apk add --no-cache python3.11 python3.11-dev make g++
# Create symlinks so 'python' and 'python3' point to python3.11
RUN ln -sf /usr/bin/python3.11 /usr/bin/python
RUN ln -sf /usr/bin/python3.11 /usr/bin/python3

RUN echo "--- [BACKEND] Copying package files ---"
COPY backend/package.json backend/package-lock.json ./

RUN echo "--- [BACKEND] Installing dependencies (npm ci) ---"
RUN npm ci --prefer-offline --no-audit --progress=false

# Remove build tools once dependencies are installed
RUN echo "--- [BACKEND] Removing build tools ---"
RUN apk del python3.11 python3.11-dev make g++

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

# Install curl for HEALTHCHECK and specific Python version (3.11) + build tools for runtime native deps
RUN echo "--- [PROD] Installing OS dependencies (curl, python3.11, make, g++) ---"
RUN apk add --no-cache curl python3.11 python3.11-dev make g++
# Create symlinks so 'python' and 'python3' point to python3.11
RUN ln -sf /usr/bin/python3.11 /usr/bin/python
RUN ln -sf /usr/bin/python3.11 /usr/bin/python3

# Install runtime dependencies only
COPY backend/package.json backend/package-lock.json ./
RUN echo "--- [PROD] Installing backend runtime dependencies ---"
RUN npm ci --omit=dev --prefer-offline --no-audit --progress=false

# Remove build tools after dependencies are installed to keep image small
RUN echo "--- [PROD] Removing build tools ---"
RUN apk del python3.11 python3.11-dev make g++

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy built backend from backend-builder stage
RUN echo "--- [PROD] Copying built backend artifacts ---"
COPY --from=backend-builder --chown=appuser:appgroup /app/backend/dist ./dist

# Create the target directory for the frontend build
RUN mkdir -p /app/dist/frontend_build && chown appuser:appgroup /app/dist/frontend_build

RUN echo "--- [PROD] Copying built frontend artifacts to /app/dist/frontend_build/ ---"
COPY --from=frontend-builder --chown=appuser:appgroup /app/frontend/dist/ ./dist/frontend_build/

RUN echo "--- [PROD] Creating data directory ---"
RUN mkdir -p /app/data && chown appuser:appgroup /app/data

RUN echo "--- [PROD] Creating log directory ---"
RUN mkdir -p /app/logs && chown appuser:appgroup /app/logs

USER appuser
EXPOSE 10000
CMD ["node", "dist/index.js"]

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:10000/api/health || exit 1

RUN echo "--- Dockerfile build definition complete ---"