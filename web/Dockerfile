# ---- Build stage ----
FROM node:24-slim AS builder
RUN corepack enable && corepack prepare pnpm@10.15.1 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN CI=true pnpm install --frozen-lockfile --ignore-scripts --config.minimum-release-age=0
COPY . .
ARG NEXT_PUBLIC_API_GO_URL=http://localhost:3001
ARG NEXT_PUBLIC_API_EXPRESS_URL=http://localhost:3002
ENV NEXT_PUBLIC_API_GO_URL=$NEXT_PUBLIC_API_GO_URL
ENV NEXT_PUBLIC_API_EXPRESS_URL=$NEXT_PUBLIC_API_EXPRESS_URL
RUN pnpm build

# ---- Runtime stage ----
FROM node:24-slim
RUN addgroup --system appgroup && adduser --system --ingroup appgroup --home /app appuser
WORKDIR /app
COPY --from=builder --chown=appuser:appgroup /app/.next/standalone ./
COPY --from=builder --chown=appuser:appgroup /app/.next/static ./.next/static
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/package.json ./
USER appuser
EXPOSE 3000
ENV PORT=3000 HOSTNAME="0.0.0.0"
HEALTHCHECK --interval=30s --timeout=3s CMD node -e "fetch('http://localhost:3000').then(r=>{if(!r.ok)process.exit(1)})"
CMD ["node", "server.js"]
