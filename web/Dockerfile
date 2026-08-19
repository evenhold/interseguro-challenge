# ---- Build stage ----
FROM node:24-slim AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --config.minimum-release-age=0 || pnpm install --config.minimum-release-age=0
COPY . .
RUN pnpm build

# ---- Runtime stage ----
FROM node:24-slim
RUN addgroup --system appgroup && adduser --system --ingroup appgroup --home /app appuser
WORKDIR /app
COPY --from=builder --chown=appuser:appgroup /app/.next ./.next
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/package.json ./
COPY --from=builder --chown=appuser:appgroup /app/next.config.js ./
USER appuser
EXPOSE 3000
CMD ["npx", "next", "start"]
