# ---- Stage 1: Build Frontend ----
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy package files and install dependencies
COPY frontend/package.json frontend/package-lock.json* frontend/pnpm-lock.yaml* ./
# Choose your package manager (npm, yarn, or pnpm)
RUN npm ci
# RUN yarn install --frozen-lockfile
# RUN corepack enable && pnpm install --frozen-lockfile


# Copy the rest of the frontend source code
COPY frontend/ ./

# Build the frontend
RUN npm run build
# Assuming vite builds to 'dist' inside frontend/

# ---- Stage 2: Build Backend ----
FROM node:18-alpine AS backend-builder
WORKDIR /app/backend

# Copy package files and install dependencies
COPY backend/package.json backend/package-lock.json* backend/pnpm-lock.yaml* ./
# Choose your package manager
RUN npm ci
# RUN yarn install --frozen-lockfile
# RUN corepack enable && pnpm install --frozen-lockfile

# Copy the rest of the backend source code
COPY backend/ ./

# Build the backend (compile TypeScript to JavaScript)
RUN npm run build
# Assuming your build script outputs to 'dist' inside backend/

# ---- Stage 3: Production Image ----
FROM node:18-alpine
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy built backend from backend-builder stage
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/package.json ./package.json
# If you have other necessary files from backend (like templates), copy them too
# COPY --from=backend-builder /app/backend/src/templates ./dist/templates

# Copy built frontend from frontend-builder stage
COPY --from=frontend-builder /app/frontend/dist ./frontend_build

# Create data directory and set permissions (if backend creates db here)
RUN mkdir -p /app/data && chown appuser:appgroup /app/data

# Switch to non-root user
USER appuser

# Expose the application port
EXPOSE 10000

# Command to run the application
# Adjust if your entry point is different, e.g., dist/server.js
CMD ["node", "dist/index.js"]

# Optional: Add a healthcheck
# HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
#   CMD curl -f http://localhost:10000/api/health || exit 1