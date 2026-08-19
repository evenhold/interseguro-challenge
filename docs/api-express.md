# API Express (Node.js)

Puerto: `:3002` (host) / `:3000` (container)

## Stack

- Node.js 24
- Express v5
- TypeScript 7
- Pino (logger)
- Zod (env validation)
- Biome (lint/format)
- Vitest (testing)

## Endpoints

| Método | Ruta                        | Descripción           |
| ------ | --------------------------- | --------------------- |
| GET    | `/health`                   | Estado del servicio   |
| GET    | `/`                         | Hola mundo            |
| POST   | `/api/v1/matrix/statistics` | Calcular estadísticas |

## `POST /api/v1/matrix/statistics`

Recibe una matriz de enteros y calcula estadísticas básicas. Es consumido internamente por api-go para:

| Origen | Descripción |
| ------ | ----------- |
| `POST /api/v1/matrix/rotate` | Estadísticas de la matriz rotada |
| `POST /api/v1/matrix/qr` | Estadísticas de Q y R por separado (2 llamadas) |

> **Nota:** api-express no tiene un endpoint `/qr`. El endpoint `/qr` vive en api-go, que calcula la factorización QR y luego llama dos veces a `/statistics` de api-express: una con Q y otra con R.

### Request Body

```json
{
  "matrix": [
    [1, 5],
    [3, 2]
  ]
}
```

| Campo    | Tipo      | Requerido | Descripción                   |
| -------- | --------- | --------- | ----------------------------- |
| `matrix` | `int[][]` | Sí        | Matriz rectangular de enteros |

### Response 200

```json
{
  "data": {
    "max": 5,
    "min": 1,
    "average": 2.75,
    "sum": 11,
    "isDiagonal": false
  },
  "message": "statistics calculated successfully"
}
```

### Campos de respuesta

| Campo        | Tipo      | Descripción                                            |
| ------------ | --------- | ------------------------------------------------------ |
| `max`        | `int`     | Valor máximo en la matriz                              |
| `min`        | `int`     | Valor mínimo en la matriz                              |
| `average`    | `float64` | Promedio de todos los elementos                        |
| `sum`        | `int`     | Suma total de todos los elementos                      |
| `isDiagonal` | `bool`    | `true` si es cuadrada y solo ≠ 0 en diagonal principal |

### Response 400

```json
{ "error": "matrix must be a non-empty 2D array" }
```

## Ejemplos curl

```bash
# Matriz simple
curl -X POST http://localhost:3002/api/v1/matrix/statistics \
  -H "Content-Type: application/json" \
  -d '{"matrix": [[1, 5], [3, 2]]}'

# Matriz diagonal
curl -X POST http://localhost:3002/api/v1/matrix/statistics \
  -H "Content-Type: application/json" \
  -d '{"matrix": [[5, 0, 0], [0, 3, 0], [0, 0, 7]]}'
```

## Desarrollo local

```bash
cd api-express
cp .env.example .env
pnpm install
pnpm dev
# → http://localhost:3000
```

## Tests

```bash
pnpm test           # watch mode
pnpm test -- --run  # una vez
```

## Estructura

```
api-express/
├── src/
│   ├── config/                             # Env + Logger + Shutdown
│   ├── features/matrix/                    # Estadísticas
│   │   ├── statistics.service.ts           # Lógica: max, min, avg, sum, isDiagonal
│   │   ├── statistics.service.test.ts      # 9 tests unitarios
│   │   ├── statistics.route.ts             # POST /api/v1/matrix/statistics
│   │   └── statistics.route.test.ts        # 4 tests HTTP
│   ├── server.ts                           # Entry point
│   └── middlewares/                         # Error handler
├── Dockerfile
├── vitest.config.ts
└── biome.json
```
