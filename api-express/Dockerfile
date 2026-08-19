# ---- Build stage ----
FROM node:24-slim AS builder
RUN corepack enable && corepack prepare pnpm@10.15.1 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./

RUN CI=true pnpm install --frozen-lockfile --ignore-scripts --config.minimum-release-age=0

COPY . .
RUN pnpm exec tsc

# ---- Dev target (para compose.override.yml) ----
# Se detiene aquí: tiene todas las dependencias (dev + prod)
FROM builder AS dev

# ---- Production: solo dependencias de producción ----
FROM builder AS prod
RUN rm -rf node_modules && \
    CI=true pnpm install --frozen-lockfile --ignore-scripts --config.minimum-release-age=0 --prod

# ---- Runtime stage ----
FROM node:24-slim

ENV NODE_ENV=production \
    CI=true \
    COREPACK_ENABLE=0

RUN corepack disable 2>/dev/null && \
    addgroup --system appgroup && \
    adduser --system --ingroup appgroup --home /app appuser

WORKDIR /app

COPY --from=prod --chown=appuser:appgroup /app/dist ./dist
COPY --from=prod --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=prod --chown=appuser:appgroup /app/package.json ./

USER appuser
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s CMD node -e "fetch('http://localhost:3000/health').then(r=>{if(!r.ok)process.exit(1)})"

CMD ["node", "dist/server.js"]
