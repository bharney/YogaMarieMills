# Build stage
FROM node:20-bookworm AS builder

WORKDIR /app

# Copy package files first for better layer caching.
COPY package*.json ./
COPY tools/nodeVersionCheck.js ./tools/nodeVersionCheck.js

# Install all deps for build/transpile tooling.
RUN npm ci --legacy-peer-deps

# Copy source code.
COPY . .

# Build static assets without starting a server.
RUN npx babel-node tools/build.js

# Transpile server/runtime files for plain Node execution.
RUN npx babel tools --out-dir dist-tools && \
  npx babel secrets.js --out-file dist-secrets.js

# Production stage
FROM node:20-bookworm-slim

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Install dumb-init to handle signals properly.
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init && rm -rf /var/lib/apt/lists/*

# Copy production artifacts and runtime dependencies.
COPY --from=builder /app/dist-server ./dist-server
COPY --from=builder /app/dist-tools ./dist-tools
COPY --from=builder /app/dist-secrets.js ./secrets.js
COPY --from=builder /app/src/images ./src/images
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Create upload directory.
RUN mkdir -p uploaded-images

# Expose port.
EXPOSE 3000

# Health check.
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Use dumb-init to handle signals.
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Run the production server.
CMD ["node", "-r", "babel-polyfill", "dist-tools/distServer.js"]
