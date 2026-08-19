# Seguridad JWT

## Descripción

El sistema implementa autenticación JWT (JSON Web Token) para proteger los endpoints de operaciones de matriz. La arquitectura de seguridad consta de dos capas:

1. **Autenticación de usuario** — API Go valida credenciales y genera JWT
2. **Autenticación interna** — API Express valida requests de API Go via header secreto

## Flujo de Autenticación

```
┌──────────────┐     POST /auth/login      ┌──────────────┐
│   Frontend   │ ──────────────────────── ▶ │   API Go     │
│   (Next.js)  │ ◀ ───────────────────── ─ │   (Fiber)    │
│              │     { token, user }        │              │
└──────┬───────┘                            └──────┬───────┘
       │                                           │
       │  Authorization: Bearer <jwt>              │  X-Internal-Secret: <secret>
       │                                           │
       ▼                                           ▼
┌──────────────┐  POST /matrix/*            ┌──────────────┐
│   API Go     │ ──────────────────────── ▶ │  API Express │
│   (Fiber)    │ ◀ ───────────────────── ─ │  (Express)   │
└──────────────┘     { statistics }         └──────────────┘
```

## Credenciales

| Campo | Valor | Descripción |
|-------|-------|-------------|
| Usuario | `admin` | Nombre de usuario |
| Contraseña | `matrix123` | Contraseña del usuario |
| JWT Secret | `interseguro-jwt-secret-2024` | Secreto para firmar tokens |
| Internal Secret | `internal-service-secret` | Secreto para comunicación interna |
| JWT Expiry | 24 horas | Tiempo de expiración del token |

## Endpoints

### Público (sin autenticación)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/` | Welcome message |
| `POST` | `/api/v1/auth/login` | Login → retorna JWT |

### Protegido con JWT

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/matrix/rotate` | Rotar matriz |
| `POST` | `/api/v1/matrix/qr` | Factorización QR |

### Protegido con Internal Secret

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/matrix/statistics` | Calcular estadísticas |

## Ejemplos de Uso

### Login

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"matrix123"}'

# Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresAt": "2024-12-20T10:00:00Z",
  "user": "admin"
}
```

### Rotar Matriz (con JWT)

```bash
TOKEN="eyJhbGciOiJIUzI1NiIs..."

curl -X POST http://localhost:3001/api/v1/matrix/rotate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"matrix":[[1,2,3],[4,5,6]],"degrees":90}'
```

### Sin Token (falla)

```bash
curl -X POST http://localhost:3001/api/v1/matrix/rotate \
  -H "Content-Type: application/json" \
  -d '{"matrix":[[1,2,3],[4,5,6]],"degrees":90}'

# Response:
{"error":"Authorization header required"}
```

## Variables de Entorno

### API Go

```env
JWT_SECRET=interseguro-jwt-secret-2024
JWT_EXPIRY_HOURS=24
API_ADMIN_USER=admin
API_ADMIN_PASS=matrix123
INTERNAL_SECRET=internal-service-secret
```

### API Express

```env
INTERNAL_SECRET=internal-service-secret
```

## Archivos Implementados

| Archivo | Descripción |
|---------|-------------|
| `api-go/internal/config/env.go` | Configuración de JWT secrets |
| `api-go/internal/middlewares/auth.go` | JWT middleware para Fiber |
| `api-go/internal/delivery/http/auth_handler.go` | Endpoint POST /auth/login |
| `api-go/internal/delivery/http/routes.go` | Rutas protegidas con JWT |
| `api-go/internal/infrastructure/express_client.go` | X-Internal-Secret header |
| `api-express/src/config/secrets.ts` | Internal secret config |
| `api-express/src/middlewares/internal-auth.ts` | Middleware de auth interna |
| `api-express/src/features/matrix/statistics.route.ts` | Ruta protegida |
| `web/src/components/LoginForm.tsx` | Formulario de login |
| `web/src/app/page.tsx` | Integración JWT + Authorization header |
