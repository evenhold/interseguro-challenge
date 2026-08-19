# Interseguro Challenge — Microservicios Go + Express + Next.js

> Rotación de matrices con Clean Architecture, Fiber (Go) y Express (Node.js), consumidos por un frontend Next.js.

## Arquitectura

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   web        │────▶│   api-go     │     │  api-express │
│  Next.js 16  │     │  Fiber v2    │     │  Express v5  │
│  :3000       │────▶│  :3001       │     │  :3002       │
└─────────────┘     └──────────────┘     └─────────────┘
```

| Servicio      | Stack                              | Puerto (host) | Puerto (container) |
| ------------- | ---------------------------------- | ------------- | ------------------ |
| `web`         | Next.js 16, React 19, TypeScript 7 | 3000          | 3000               |
| `api-go`      | Go 1.22, Fiber v2, Zap             | 3001          | 8080               |
| `api-express` | Node.js 24, Express v5, Pino, Zod  | 3002          | 3000               |

## Requisitos

- **Docker** ≥ 24 + **Docker Compose** v2
- **pnpm** ≥ 10 (solo si trabajas sin Docker)

## quick Start

### Desarrollo (hot reload)

```bash
# Levanta los 3 servicios con hot reload
docker compose up -d

# Ver logs
docker compose logs -f

# Verificar que funciona
curl http://localhost:3000        # Frontend
curl http://localhost:3001/health # API Go
curl http://localhost:3002/health # API Express
```

`docker compose up` carga automáticamente `compose.override.yml` que:

- Monta el código fuente como volumen (hot reload)
- Usa `target: dev` / `target: builder` (con dependencias de desarrollo)
- Carga variables de entorno desde `.env.local` / `.env`

### Producción

```bash
# Build de imágenes optimizadas
docker compose -f compose.yml build

# Levantar servicios
docker compose -f compose.yml up -d

# Verificar
curl http://localhost:3000
curl http://localhost:3001/health
curl http://localhost:3002/health
```

`docker compose -f compose.yml` **sin** override:

- Imágenes multi-stage optimizadas (solo producción)
- Sin volumenes montados
- Sin variables de entorno de desarrollo

## Estructura del Proyecto

```
interseguro-challenge/
├── compose.yml           # Producción
├── compose.override.yml  # Desarrollo (se carga automáticamente)
├── api-go/               # Fiber + Clean Architecture
│   ├── cmd/api/main.go
│   ├── internal/
│   │   ├── config/       # Env + Logger
│   │   ├── handlers/     # Endpoints
│   │   └── middlewares/   # Error handler
│   ├── Dockerfile
│   └── Makefile
├── api-express/          # Express v5 + TypeScript 7
│   ├── src/
│   │   ├── config/       # Env + Logger + Shutdown
│   │   ├── handlers/     # (próximamente)
│   │   └── middlewares/   # Error handler
│   ├── Dockerfile
│   └── vitest.config.ts
└── web/                  # Next.js 16 + React 19
    ├── src/app/
    │   ├── page.tsx      # Página principal
    │   └── layout.tsx
    └── Dockerfile
```

## Desarrollo Local (sin Docker)

### api-go

```bash
cd api-go
cp .env.example .env
/usr/local/go/bin/go run ./cmd/api
# → http://localhost:8080
```

### api-express

```bash
cd api-express
cp .env.example .env
pnpm install
pnpm dev
# → http://localhost:3000
```

### web

```bash
cd web
cp .env.example .env.local
pnpm install
pnpm dev
# → http://localhost:3000
```

## Endpoints

### API Go (`:3001`)

| Método | Ruta      | Descripción         |
| ------ | --------- | ------------------- |
| GET    | `/health` | Estado del servicio |
| GET    | `/`       | Hola mundo          |

### API Express (`:3002`)

| Método | Ruta      | Descripción         |
| ------ | --------- | ------------------- |
| GET    | `/health` | Estado del servicio |
| GET    | `/`       | Hola mundo          |

### Web (`:3000`)

| Método | Ruta | Descripción                  |
| ------ | ---- | ---------------------------- |
| GET    | `/`  | Dashboard con estado de APIs |

## Comandos Útiles

```bash
# Logs de todos los servicios
docker compose logs -f

# Logs de un servicio específico
docker compose logs -f api-go

# Rebuild sin cache
docker compose -f compose.yml build --no-cache

# Detener todo
docker compose down

# Detener y eliminar volúmenes
docker compose down -v

# Ver estado
docker compose ps
```

## Variables de Entorno

| Variable                      | Servicio    | Default                 | Descripción                        |
| ----------------------------- | ----------- | ----------------------- | ---------------------------------- |
| `PORT`                        | api-go      | `8080`                  | Puerto del servidor                |
| `APP_ENV`                     | api-go      | `development`           | Entorno (development/production)   |
| `PORT`                        | api-express | `3000`                  | Puerto del servidor                |
| `NODE_ENV`                    | api-express | `development`           | Entorno                            |
| `NEXT_PUBLIC_API_GO_URL`      | web         | `http://localhost:3001` | URL de la API Go (build time)      |
| `NEXT_PUBLIC_API_EXPRESS_URL` | web         | `http://localhost:3002` | URL de la API Express (build time) |

> **Nota:** Las variables `NEXT_PUBLIC_*` se inyectan en el build de Next.js y quedan embebidas en el bundle del cliente.

## Tecnologías

- **Go 1.22** + Fiber v2 + Zap + godotenv
- **Node.js 24** + Express v5 + Pino + Zod
- **Next.js 16** + React 19 + TypeScript 7
- **Docker** multi-stage builds
- **pnpm** como gestor de paquetes
- **Biome** para linting/formateo (api-express)
- **Vitest** para testing (api-express)
