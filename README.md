# Interseguro Challenge — Microservicios Go + Express + Next.js

> Rotación de matrices con Clean Architecture, Fiber (Go) y Express (Node.js), consumidos por un frontend Next.js.

🔗 **Demo:** https://p01--web--k6n44sy2c8kg.code.run/

## Arquitectura

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   web        │────▶│   api-go     │────▶│  api-express │
│  Next.js 16  │     │  Fiber v2    │     │  Express v5  │
│  :3000       │────▶│  :3001       │────▶│  :3002       │
└─────────────┘     └──────────────┘     └─────────────┘
```

| Servicio      | Stack                              | Puerto |
| ------------- | ---------------------------------- | ------ |
| `web`         | Next.js 16, React 19, TypeScript 7 | 3000   |
| `api-go`      | Go 1.22, Fiber v2, Zap             | 3001   |
| `api-express` | Node.js 24, Express v5, Pino, Zod  | 3002   |

## Quick Start

```bash
# Desarrollo (hot reload)
docker compose up -d

# Producción
docker compose -f compose.yml build && docker compose -f compose.yml up -d

# Verificar
curl http://localhost:3000        # Frontend
curl http://localhost:3001/health # API Go
curl http://localhost:3002/health # API Express
```

## Documentación

| Archivo                                      | Descripción                     |
| -------------------------------------------- | ------------------------------- |
| [docs/architecture.md](docs/architecture.md) | Arquitectura y flujo completo   |
| [docs/api-go.md](docs/api-go.md)             | API Go — endpoints y estructura |
| [docs/api-express.md](docs/api-express.md)   | API Express — estadísticas      |
| [docs/web.md](docs/web.md)                   | Frontend Next.js                |
| [docs/environment.md](docs/environment.md)   | Variables de entorno            |
| [docs/development.md](docs/development.md)   | Guía de desarrollo              |

## Tecnologías

- **Go 1.22** + Fiber v2 + Zap + godotenv
- **Node.js 24** + Express v5 + Pino + Zod
- **Next.js 16** + React 19 + TypeScript 7
- **Docker** multi-stage builds
- **pnpm** como gestor de paquetes
- **Biome** para linting/formateo (api-express)
- **Vitest** para testing (api-express)
