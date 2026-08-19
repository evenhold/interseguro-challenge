# API Go (Fiber)

Puerto: `:3001` (host) / `:8080` (container)

## Stack

- Go 1.22
- Fiber v2
- Zap (logger)
- godotenv

## Endpoints

| Método | Ruta                    | Descripción                 |
| ------ | ----------------------- | --------------------------- |
| GET    | `/health`               | Estado del servicio         |
| GET    | `/`                     | Hola mundo                  |
| POST   | `/api/v1/matrix/rotate` | Rotar matriz + estadísticas |

## `POST /api/v1/matrix/rotate`

Rota una matriz de enteros y retorna la matriz rotada con estadísticas calculadas por api-express.

### Request Body

```json
{
  "matrix": [
    [1, 2, 3],
    [4, 5, 6]
  ],
  "degrees": 90
}
```

| Campo     | Tipo      | Requerido | Descripción                |
| --------- | --------- | --------- | -------------------------- |
| `matrix`  | `int[][]` | Sí        | Matriz rectangular enteros |
| `degrees` | `int`     | Sí        | `90`, `180` o `270`        |

### Response 200

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

### Response 400

```json
{ "error": "degrees must be 90, 180 or 270" }
```

### Algoritmo de rotación

| Grados | Operación                                   |
| ------ | ------------------------------------------- |
| 90°    | `result[j][rows-1-i] = matrix[i][j]`        |
| 180°   | `result[rows-1-i][cols-1-j] = matrix[i][j]` |
| 270°   | `result[cols-1-j][i] = matrix[i][j]`        |

### Validaciones

- Matriz no vacía
- Todas las filas misma longitud (rectangular)
- Degrees debe ser 90, 180 o 270

## Ejemplos curl

```bash
# Rotar 90°
curl -X POST http://localhost:3001/api/v1/matrix/rotate \
  -H "Content-Type: application/json" \
  -d '{"matrix": [[1,2,3],[4,5,6]], "degrees": 90}'

# Rotar 180°
curl -X POST http://localhost:3001/api/v1/matrix/rotate \
  -H "Content-Type: application/json" \
  -d '{"matrix": [[1,2,3],[4,5,6],[7,8,9]], "degrees": 180}'

# Rotar 270°
curl -X POST http://localhost:3001/api/v1/matrix/rotate \
  -H "Content-Type: application/json" \
  -d '{"matrix": [[1,2,3],[4,5,6]], "degrees": 270}'
```

## Desarrollo local

```bash
cd api-go
cp .env.example .env
/usr/local/go/bin/go run ./cmd/api
# → http://localhost:8080
```

## Estructura

```
api-go/
├── cmd/api/main.go                         # Composition root (DI)
├── internal/
│   ├── config/                             # Env + Logger
│   ├── domain/matrix.go                    # Entidades puras
│   ├── usecase/matrix_usecase.go           # Lógica de rotación
│   ├── usecase/matrix_usecase_test.go      # 13 tests unitarios
│   ├── infrastructure/express_client.go    # Cliente HTTP → api-express
│   ├── delivery/http/                      # Handlers + routes
│   │   ├── matrix_handler.go
│   │   ├── matrix_handler_test.go          # 5 tests HTTP
│   │   └── routes.go
│   ├── handlers/                           # Health endpoints
│   └── middlewares/                         # Error handler
├── pkg/dto/                                # Request/response DTOs
├── Dockerfile
└── Makefile
```
