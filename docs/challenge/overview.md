# Objetivos del Reto - Interseguro

## Contexto

Interseguro (División TI, Junio 2024) solicita un Coding Challenge para evaluar
habilidades técnicas en desarrollo de microservicios con comunicación HTTP.

---

## Objetivo General

Desarrollar **dos API RESTful** que se comuniquen entre sí para procesar
matrices y calcular estadísticas, con un frontend para visualizar resultados.

---

## Objetivos Específicos

### 1. API en Go (Fiber)

| #   | Objetivo                  | Descripción                       |
| --- | ------------------------- | --------------------------------- |
| 1.1 | Crear API REST con Go     | Usando el framework **Fiber**     |
| 1.2 | Recibir matriz de entrada | Array de arrays de números        |
| 1.3 | Rotar la matriz           | Implementar rotación de 90°       |
| 1.4 | Enviar resultado a NestJS | Comunicación HTTP entre servicios |

### 2. API en Node.js (NestJS)

| #   | Objetivo                  | Descripción                              |
| --- | ------------------------- | ---------------------------------------- |
| 2.1 | Crear API REST con NestJS | Usando **NestJS** con Node.js 24+        |
| 2.2 | Recibir matriz rotada     | Datos enviados desde la API Go           |
| 2.3 | Calcular estadísticas     | Máximo, mínimo, promedio, suma, diagonal |
| 2.4 | Retornar resultados       | Respuesta JSON con las estadísticas      |

### 3. Operaciones sobre la matriz

| Operación           | Descripción                   | Ejemplo                           |
| ------------------- | ----------------------------- | --------------------------------- |
| **Valor máximo**    | Mayor valor en la matriz      | `[[1,5],[3,2]]` → 5               |
| **Valor mínimo**    | Menor valor en la matriz      | `[[1,5],[3,2]]` → 1               |
| **Promedio**        | Promedio de todos los valores | `[[1,5],[3,2]]` → 2.75            |
| **Suma total**      | Suma de todos los valores     | `[[1,5],[3,2]]` → 11              |
| **Matriz diagonal** | Verificar si es diagonal      | Solo ≠ 0 en la diagonal principal |

### 4. Frontend (Next.js)

| #   | Objetivo                  | Descripción                           |
| --- | ------------------------- | ------------------------------------- |
| 4.1 | Crear app web con Next.js | Usando **Next.js 15+** con App Router |
| 4.2 | Input de matriz           | Formulario para ingresar la matriz    |
| 4.3 | Consumir API Go           | Enviar matriz y mostrar rotación      |
| 4.4 | Consumir API NestJS       | Recibir y mostrar estadísticas        |
| 4.5 | UI responsiva             | Diseño claro y funcional              |

### 5. Infraestructura

| #   | Objetivo          | Descripción                     |
| --- | ----------------- | ------------------------------- |
| 5.1 | Docker            | Contenerizar las 3 aplicaciones |
| 5.2 | docker-compose    | Orquestar todos los servicios   |
| 5.3 | Comunicación HTTP | API Go llama a API NestJS       |

### 6. Funcionalidades Opcionales (puntos extra)

| #   | Objetivo               | Descripción                            |
| --- | ---------------------- | -------------------------------------- |
| 6.1 | JWT                    | Seguridad en las consultas a las APIs  |
| 6.2 | Pruebas unitarias      | Tests para ambas APIs                  |
| 6.3 | Pruebas de integración | Verificar comunicación entre servicios |

---

## Diagrama de arquitectura

```
┌──────────────────┐
│                  │
│   Next.js        │
│   (Frontend)     │
│   Puerto 3001    │
│                  │
└───────┬──────────┘
        │
        │  GET/POST
        ▼
┌──────────────────┐   POST /matrix/rotate   ┌──────────────────────┐
│                  │ ──────────────────────► │                      │
│    API Go        │                         │   API NestJS         │
│    (Fiber)       │ ◄────────────────────── │   (Node.js 24+)     │
│    Puerto 8080   │      Respuesta JSON     │   Puerto 3000        │
│                  │                         │                      │
│ ┌──────────────┐ │                         │ ┌──────────────────┐ │
│ │ Recibe matriz│ │                         │ │ Recibe matriz    │ │
│ │ Rotar 90°    │ │                         │ │ Calcular stats   │ │
│ │ Enviar a     │ │                         │ │ Retornar resultado│ │
│ └──────────────┘ │                         │ └──────────────────┘ │
└──────────────────┘                         └──────────────────────┘
         │                                            │
         └──────────────┬─────────────────────────────┘
                        │
                  ┌─────┴─────┐
                  │  Docker   │
                  │  Compose  │
                  └───────────┘
```

---

## Criterios de evaluación

| Criterio                  | Descripción                                   |
| ------------------------- | --------------------------------------------- |
| **Estructura del código** | Clean Architecture, separación de capas       |
| **Eficiencia**            | Solución óptima para rotación y estadísticas  |
| **Documentación**         | Código documentado, README claro              |
| **Docker**                | Multi-stage builds, compose funcional         |
| **Comunicación**          | HTTP client/server correctamente implementado |
| **Pruebas**               | Cobertura de tests unitarios y de integración |
| **Decisiones técnicas**   | Capacidad de comunicar y defender decisiones  |

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

---

## Estructura del proyecto

```
go-testing/
├── api-go/                    # API en Go (Fiber)
│   ├── cmd/main.go
│   ├── internal/
│   │   ├── domain/
│   │   ├── usecase/
│   │   ├── delivery/http/
│   │   └── infrastructure/
│   ├── Dockerfile
│   ├── go.mod
│   └── go.sum
│
├── api-nest/                   # API en NestJS
│   ├── src/
│   │   ├── matrix/
│   │   │   ├── matrix.controller.ts
│   │   │   ├── matrix.service.ts
│   │   │   ├── matrix.module.ts
│   │   │   └── dto/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── web/                        # Frontend en Next.js
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── components/
│   ├── Dockerfile
│   ├── package.json
│   └── next.config.ts
│
├── docs/                       # Documentación
├── docker-compose.yml
└── README.md
```
