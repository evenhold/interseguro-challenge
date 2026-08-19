# Arquitectura del Proyecto

## Visión general

Tres servicios independientes comunicándose por HTTP:

```
Next.js (Frontend) → Go API (Fiber) → NestJS API (Node.js 24+)
   Puerto 3001          Puerto 8080          Puerto 3000
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

## API NestJS (Node.js 24+) — Feature-Based

### Estructura

```
api-nest/
├── src/
│   ├── matrix/                        # Feature: operaciones con matrices
│   │   ├── dto/
│   │   │   ├── matrix-statistics.dto.ts
│   │   │   └── matrix-response.dto.ts
│   │   ├── matrix.controller.ts       # Endpoints HTTP
│   │   ├── matrix.service.ts          # Lógica de estadísticas
│   │   └── matrix.module.ts           # Registro del módulo
│   │
│   ├── common/
│   │   └── filters/
│   │       └── all-exceptions.filter.ts
│   │
│   ├── app.module.ts
│   └── main.ts                        # Bootstrap + ValidationPipe
│
├── Dockerfile
├── package.json
├── tsconfig.json
└── nest-cli.json
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

NestJS usa DI nativa por constructor:

```typescript
@Controller("matrix")
export class MatrixController {
  constructor(private readonly matrixService: MatrixService) {}
  // NestJS resuelve esto automáticamente
}
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
│  │   POST /api/matrix/rotate                    │              │
│  │   ┌──────────────────────────────────────┐   │              │
│  │   │ 1. Recibe matriz + degrees           │   │              │
│  │   │ 2. Rotar matriz (Clean Architecture) │   │              │
│  │   │ 3. Enviar rotada a NestJS            │───┼──────►       │
│  │   └──────────────────────────────────────┘   │              │
│  │                                              │              │
│  └──────────────────────────────────────────────┘              │
│                                                                 │
│  ┌──────────────────────────────────────────────┐              │
│  │                                              │              │
│  │   API NestJS (Node.js 24+)                   │              │
│  │   Puerto 3000                                │              │
│  │                                              │              │
│  │   POST /api/matrix/statistics                │              │
│  │   ┌──────────────────────────────────────┐   │              │
│  │   │ 1. Recibe matriz rotada              │   │              │
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
| API 2        | NestJS                  | Node.js 24+ / NestJS 11+ |
| Frontend     | Next.js                 | Next.js 15+ (App Router) |
| Comunicación | HTTP (REST)             | -                        |
| Contenedores | Docker + Docker Compose | -                        |
| Lenguajes    | Go, TypeScript          | -                        |
