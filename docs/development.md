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

### Ejecutar servicios independientemente

Cada servicio se puede construir y ejecutar por separado:

#### api-express (standalone)

```bash
docker build -t api-express-test ./api-express
docker run -d -p 3002:3000 --name test-express api-express-test

# Verificar
curl localhost:3002/health

# Probar estadísticas (requiere X-Internal-Secret)
curl -X POST localhost:3002/api/v1/matrix/statistics \
  -H "X-Internal-Secret: internal-service-secret" \
  -H "Content-Type: application/json" \
  -d '{"matrix":[[1,2],[3,4]]}'

# Limpiar
docker rm -f test-express
```

#### api-go (standalone)

```bash
docker build -t api-go-test ./api-go
docker run -d -p 3001:8080 --name test-go api-go-test

# Verificar
curl localhost:3001/health

# Login
curl -X POST localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"matrix123"}'

# Nota: los endpoints de rotación/QR fallarán al llamar a api-express
# (no está corriendo), pero el servicio funciona correctamente.

# Limpiar
docker rm -f test-go
```

#### web (standalone)

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_GO_URL=http://localhost:3001 \
  --build-arg NEXT_PUBLIC_API_EXPRESS_URL=http://localhost:3002 \
  -t web-test ./web

docker run -d -p 3000:3000 --name test-web web-test

# Verificar
curl localhost:3000

# Limpiar
docker rm -f test-web
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

> **Nota:** Si ejecutaste Docker anteriormente, es posible que necesites corregir permisos del directorio `.next/`:
>
> ```bash
> # Opción 1: Cambiar ownership
> sudo chown -R $(whoami) web/.next
>
> # Opción 2: Borrar .next (Next.js lo recrea)
> rm -rf web/.next
> ```
>
> Esto ocurre porque Docker crea archivos como `root` y tu usuario local no tiene permisos de escritura.

## Tests

### api-go

```bash
cd api-go
/usr/local/go/bin/go test ./... -v
```

### api-express

```bash
cd api-express
pnpm test           # watch mode
pnpm test -- --run  # una vez
```

## Troubleshooting

### Puerto en uso

```bash
# Matar proceso en el puerto
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
lsof -ti:3002 | xargs kill -9
```

### Permisos denegados en .next/

Docker monta volúmenes como `root`. Si ves `Permission denied` al correr `pnpm dev`:

```bash
sudo chown -R $(whoami) web/.next
# o
rm -rf web/.next
```

### api-go no puede conectar a api-express

Cuando api-go corre solo (sin Docker Compose), usa `API_EXPRESS_URL`:

```bash
# En desarrollo local
export API_EXPRESS_URL=http://localhost:3002
/usr/local/go/bin/go run ./cmd/api
```

### Variables NEXT_PUBLIC_* no funcionan

Estas variables se graban en build time. Si cambias las URLs, debes reconstruir:

```bash
cd web
pnpm build  # o reiniciar pnpm dev
```
