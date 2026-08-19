# Multi-service Dockerfile for Interseguro Challenge
# Usage: docker build --target <service> -t interseguro-<service> .
# Targets: api-go, api-express, web

# ---- Shared base for Node.js services ----
FROM node:24-slim AS node-base
RUN corepack enable && corepack prepare pnpm@10.15.1 --activate

# ---- api-go ----
FROM golang:1.22-bookworm AS api-go-builder
WORKDIR /app
COPY api-go/go.mod api-go/go.sum ./
RUN go mod download
COPY api-go/ .
RUN go mod tidy
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server ./cmd/api

FROM debian:bookworm-slim AS api-go
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl && rm -rf /var/lib/apt/lists/*
RUN addgroup --system appgroup && adduser --system --ingroup appgroup --home /app appuser
WORKDIR /app
COPY --from=api-go-builder --chown=appuser:appgroup /app/server /app/server
USER appuser
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:8080/health || exit 1
CMD ["/app/server"]

# ---- api-express ----
FROM node-base AS api-express-builder
WORKDIR /app
COPY api-express/package.json api-express/pnpm-lock.yaml* ./
RUN CI=true pnpm install --frozen-lockfile --ignore-scripts --config.minimum-release-age=0
COPY api-express/ .
RUN pnpm exec tsc
RUN rm -rf node_modules && CI=true pnpm install --frozen-lockfile --ignore-scripts --config.minimum-release-age=0 --prod

FROM node:24-slim AS api-express
ENV NODE_ENV=production CI=true COREPACK_ENABLE=0
RUN corepack disable 2>/dev/null && addgroup --system appgroup && adduser --system --ingroup appgroup --home /app appuser
WORKDIR /app
COPY --from=api-express-builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=api-express-builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=api-express-builder --chown=appuser:appgroup /app/package.json ./
USER appuser
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD node -e "fetch('http://localhost:3000/health').then(r=>{if(!r.ok)process.exit(1)})"
CMD ["node", "dist/server.js"]

# ---- web ----
FROM node-base AS web-builder
WORKDIR /app
COPY web/package.json web/pnpm-lock.yaml ./
RUN CI=true pnpm install --frozen-lockfile --ignore-scripts --config.minimum-release-age=0
COPY web/ .
ARG NEXT_PUBLIC_API_GO_URL=http://localhost:3001
ARG NEXT_PUBLIC_API_EXPRESS_URL=http://localhost:3002
ENV NEXT_PUBLIC_API_GO_URL=$NEXT_PUBLIC_API_GO_URL
ENV NEXT_PUBLIC_API_EXPRESS_URL=$NEXT_PUBLIC_API_EXPRESS_URL
RUN pnpm build

FROM node:24-slim AS web
RUN addgroup --system appgroup && adduser --system --ingroup appgroup --home /app appuser
WORKDIR /app
COPY --from=web-builder --chown=appuser:appgroup /app/.next/standalone ./
COPY --from=web-builder --chown=appuser:appgroup /app/.next/static ./.next/static
COPY --from=web-builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=web-builder --chown=appuser:appgroup /app/package.json ./
USER appuser
EXPOSE 3000
ENV PORT=3000 HOSTNAME="0.0.0.0"
HEALTHCHECK --interval=30s --timeout=3s CMD node -e "fetch('http://localhost:3000').then(r=>{if(!r.ok)process.exit(1)})"
CMD ["node", "server.js"]
