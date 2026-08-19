# Guía de Desarrollo

## Requisitos

- **Docker** ≥ 24 + **Docker Compose** v2
- **pnpm** ≥ 10 (solo sin Docker)
- **Go** ≥ 1.22 (solo sin Docker)
- **Node.js** ≥ 24 (solo sin Docker)

## Docker (recomendado)

### Desarrollo (hot reload)

```bash
docker compose up -d
docker compose logs -f
```

`docker compose up` carga automáticamente `compose.override.yml`:

- Monta código fuente como volumen (hot reload)
- Usa `target: dev` (dependencias de desarrollo)
- Carga variables de entorno desde `.env`

### Producción

```bash
docker compose -f compose.yml build
docker compose -f compose.yml up -d
```

### Comandos útiles

```bash
docker compose logs -f              # Logs de todos
docker compose logs -f api-go       # Logs de un servicio
docker compose -f compose.yml build --no-cache  # Rebuild
docker compose down                 # Detener
docker compose down -v              # Detener + eliminar volúmenes
docker compose ps                   # Ver estado
```

## Sin Docker

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

## Tests

### api-go

```bash
cd api-go
/usr/local/go/bin/go test ./... -v
```

### api-express

```bash
cd api-express
pnpm test -- --run
```
