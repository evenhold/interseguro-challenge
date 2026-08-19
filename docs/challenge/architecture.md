# Arquitectura del Proyecto

## Visión general

Tres servicios independientes comunicándose por HTTP:

```
Next.js (Frontend) → Go API (Fiber) → Express API (Node.js 24+)
   Puerto 3000          Puerto 8080          Puerto 3000
```

---

## API Go (Fiber) — Clean Architecture

### Estructura

```
api-go/
├── cmd/
│   └── api/
│       └── main.go                    # Composition root (DI manual)
│
├── internal/
│   ├── domain/
│   │   └── matrix.go                 # Entidad Matrix (sin dependencias)
│   │
│   ├── repository/
│   │   └── matrix_repository.go      # Interface (contrato)
│   │
│   ├── usecase/
│   │   └── matrix_usecase.go         # Lógica de rotación (depende de interfaces)
│   │
│   ├── delivery/
│   │   └── http/
│   │       ├── matrix_handler.go     # Handlers Fiber (parse → usecase)
│   │       └── routes.go             # Registro de rutas
│   │
│   └── infrastructure/
│       └── httpclient/
│           └── nestjs_client.go      # HTTP client → NestJS API
│
├── pkg/
│   └── dto/
│       ├── matrix_dto.go             # Request/response DTOs
│       └── response.go               # Respuesta genérica
│
├── Dockerfile
├── go.mod
└── go.sum
```

### Flujo de datos

```
HTTP Request
    │
    ▼
Delivery (handler)  ──>  Parsea body a DTO
    │
    ▼
Usecase             ──>  Aplica lógica de rotación
    │
    ▼
Repository (interfaz) ──>  (No aplica — sin BD)
    │
    ▼
Infrastructure      ──>  HTTP client → NestJS
    │
    ▼
API NestJS
```

### Dependencias

| Capa           | Depende de                   |
| -------------- | ---------------------------- |
| Domain         | Nada (puro)                  |
| Repository     | Domain (interfaces)          |
| Usecase        | Repository (interfaces)      |
| Delivery       | Usecase + DTOs               |
| Infrastructure | Domain + interfaces externas |

---

## API Express (Node.js 24+) — Feature-Based

### Estructura

```
api-express/
├── src/
│   ├── features/
│   │   └── matrix/                        # Feature: estadísticas
│   │       ├── statistics.service.ts       # Lógica: max, min, avg, sum, isDiagonal
│   │       └── statistics.route.ts         # POST /api/v1/matrix/statistics
│   │
│   ├── middlewares/
│   │   ├── error-handler.ts
│   │   └── internal-auth.ts
│   │
│   ├── config/
│   │   ├── env.ts
│   │   ├── logger.ts
│   │   ├── secrets.ts
│   │   └── graceful-shutdown.ts
│   │
│   └── server.ts                          # Entry point
│
├── Dockerfile
├── package.json
├── tsconfig.json
└── biome.json
```

### Endpoints

| Método | Ruta                     | Descripción                                |
| ------ | ------------------------ | ------------------------------------------ |
| POST   | `/api/matrix/statistics` | Recibe matriz rotada, retorna estadísticas |

### Estadísticas calculadas

- Valor máximo
- Valor mínimo
- Promedio
- Suma total
- Verificar si es diagonal

### Dependencias

Express.js no usa DI nativa; las dependencias se resuelven manualmente:

```typescript
// En statistics.route.ts
import { calculateStatistics } from "./statistics.service.js";

router.post("/api/v1/matrix/statistics", internalAuth, (req, res) => {
  const stats = calculateStatistics(req.body.matrix);
  res.json({ data: stats });
});
```

---

## Frontend Next.js (App Router) — Feature-Based

### Estructura

```
web/
├── src/
│   ├── app/
│   │   ├── page.tsx                   # Home
│   │   ├── layout.tsx                 # Root layout
│   │   └── matrix/
│   │       └── page.tsx               # Página principal del reto
│   │
│   ├── features/
│   │   └── matrix/
│   │       ├── components/
│   │       │   ├── MatrixInput.tsx     # Formulario de input
│   │       │   ├── MatrixDisplay.tsx   # Muestra matriz rotada
│   │       │   └── StatsPanel.tsx      # Panel de estadísticas
│   │       ├── hooks/
│   │       │   └── useMatrix.ts       # Hook para llamadas API
│   │       └── types.ts
│   │
│   ├── lib/
│   │   └── api/
│   │       ├── go-api.ts              # Cliente API Go
│   │       ├── nest-api.ts            # Cliente API NestJS
│   │       └── client.ts              # Wrapper base fetch
│   │
│   ├── components/
│   │   └── ui/                        # Button, Input, Card genéricos
│   │
│   └── config/
│       └── site.ts                    # URLs de APIs, constants
│
├── Dockerfile
├── package.json
└── next.config.ts
```

### Convenciones Next.js

| Archivo       | Función                        |
| ------------- | ------------------------------ |
| `page.tsx`    | Hace pública una ruta          |
| `layout.tsx`  | UI compartida (header, footer) |
| `loading.tsx` | Skeleton mientras carga        |
| `error.tsx    | Error boundary                 |

### Server vs Client Components

| Server (default)       | Client (`'use client'`)    |
| ---------------------- | -------------------------- |
| Fetch de APIs externas | Formularios interactivos   |
| Acceso a env vars      | `useState`, `useEffect`    |
| SEO-friendly           | Event handlers (`onClick`) |

---

## Diagrama completo de arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                        Docker Compose                           │
│                                                                 │
│  ┌──────────────────┐                                           │
│  │                  │                                           │
│  │   Next.js        │  GET/POST                                 │
│  │   (Frontend)     │ ──────┐                                   │
│  │   Puerto 3001    │       │                                   │
│  │                  │       │                                   │
│  └──────────────────┘       │                                   │
│                             ▼                                   │
│  ┌──────────────────────────────────────────────┐              │
│  │                                              │              │
│  │   API Go (Fiber)                             │              │
│  │   Puerto 8080                                │              │
│  │                                              │              │
│  │   POST /api/v1/matrix/rotate                 │              │
│  │   POST /api/v1/matrix/qr                     │              │
│  │   ┌──────────────────────────────────────┐   │              │
│  │   │ 1. Recibe matriz + degrees           │   │              │
│  │   │ 2. Rotar matriz (Clean Architecture) │   │              │
│  │   │ 3. Enviar a Express para stats       │───┼──────►       │
│  │   └──────────────────────────────────────┘   │              │
│  │                                              │              │
│  └──────────────────────────────────────────────┘              │
│                                                                 │
│  ┌──────────────────────────────────────────────┐              │
│  │                                              │              │
│  │   API Express (Node.js 24+)                  │              │
│  │   Puerto 3000                                │              │
│  │                                              │              │
│  │   POST /api/v1/matrix/statistics             │              │
│  │   ┌──────────────────────────────────────┐   │              │
│  │   │ 1. Recibe matriz                     │   │              │
│  │   │ 2. Calcular estadísticas             │   │              │
│  │   │ 3. Retornar JSON con stats           │   │              │
│  │   └──────────────────────────────────────┘   │              │
│  │                                              │              │
│  └──────────────────────────────────────────────┘              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Stack tecnológico

| Componente   | Tecnología              | Versión                  |
| ------------ | ----------------------- | ------------------------ |
| API 1        | Go + Fiber              | Go 1.22+                 |
| API 2        | Express                 | Node.js 24+ / Express v5 |
| Frontend     | Next.js                 | Next.js 15+ (App Router) |
| Comunicación | HTTP (REST)             | -                        |
| Contenedores | Docker + Docker Compose | -                        |
| Lenguajes    | Go, TypeScript          | -                        |
