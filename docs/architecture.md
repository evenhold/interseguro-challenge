# Arquitectura

## Diagrama de servicios

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   web        │────▶│   api-go     │────▶│  api-express │
│  Next.js 16  │     │  Fiber v2    │     │  Express v5  │
│  :3000       │────▶│  :3001       │────▶│  :3002       │
└─────────────┘     └──────────────┘     └─────────────┘
```

## Flujo completo

### Rotación + Estadísticas

```
1. Frontend → POST /api/v1/matrix/rotate (matrix, degrees)
       ↓
2. api-go: rota matriz 90°/180°/270°
       ↓
3. api-go → POST /api/v1/matrix/statistics (matriz rotada)
       ↓
4. api-express: calcula {max, min, average, sum, isDiagonal}
       ↓
5. api-go: retorna {rotated, statistics} al frontend
```

### Factorización QR + Estadísticas

```
1. Frontend → POST /api/v1/matrix/qr (matrix)
       ↓
2. api-go: calcula QR (Gram-Schmidt) → Q ortogonal + R triangular
       ↓
3. api-go → POST /api/v1/matrix/statistics (Q como enteros)
4. api-go → POST /api/v1/matrix/statistics (R como enteros)
       ↓
5. api-express: calcula estadísticas de Q y R por separado
       ↓
6. api-go: retorna {q, r, statistics: {q, r}} al frontend
```

## Response completa

```json
{
  "data": {
    "original": [
      [1, 2, 3],
      [4, 5, 6]
    ],
    "rotated": [
      [4, 1],
      [5, 2],
      [6, 3]
    ],
    "degrees": 90,
    "statistics": {
      "max": 6,
      "min": 1,
      "average": 3.5,
      "sum": 21,
      "isDiagonal": false
    }
  },
  "message": "matrix rotated successfully"
}
```

## Estadísticas calculadas

| Estadística  | Descripción                                            |
| ------------ | ------------------------------------------------------ |
| `max`        | Valor máximo en la matriz                              |
| `min`        | Valor mínimo en la matriz                              |
| `average`    | Promedio de todos los elementos                        |
| `sum`        | Suma total de todos los elementos                      |
| `isDiagonal` | `true` si es cuadrada y solo ≠ 0 en diagonal principal |

## Clean Architecture (api-go)

```
domain/        → Entidades puras (Matrix)
usecase/       → Lógica de negocio (Rotate, QRFactorize)
infrastructure/→ Clientes HTTP (ExpressClient)
delivery/http/ → Handlers HTTP (Fiber)
pkg/dto/       → Request/Response DTOs
```

## Puertos

| Servicio      | Puerto (host) | Puerto (container) |
| ------------- | ------------- | ------------------ |
| `web`         | 3000          | 3000               |
| `api-go`      | 3001          | 8080               |
| `api-express` | 3002          | 3000               |
