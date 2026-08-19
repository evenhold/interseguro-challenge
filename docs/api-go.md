# API Go (Fiber)

Puerto: `:3001` (host) / `:8080` (container)

## Stack

- Go 1.22
- Fiber v2
- Zap (logger)
- godotenv

## Endpoints

| Método | Ruta                    | Descripción                      |
| ------ | ----------------------- | -------------------------------- |
| GET    | `/health`               | Estado del servicio              |
| GET    | `/`                     | Hola mundo                       |
| POST   | `/api/v1/matrix/rotate` | Rotar matriz + estadísticas      |
| POST   | `/api/v1/matrix/qr`     | Factorización QR + estadísticas  |

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

## `POST /api/v1/matrix/qr`

Calcula la factorización QR de una matriz y retorna Q, R con estadísticas de cada una.

### Request Body

```json
{
  "matrix": [
    [1, 2, 3],
    [4, 5, 6]
  ]
}
```

| Campo    | Tipo      | Requerido | Descripción                |
| -------- | --------- | --------- | -------------------------- |
| `matrix` | `int[][]` | Sí        | Matriz rectangular enteros |

### Response 200

```json
{
  "data": {
    "original": [[1, 2, 3], [4, 5, 6]],
    "q": [
      [0.2425, 0.9701, 0],
      [0.9701, -0.2425, 0]
    ],
    "r": [
      [4.123, 5.336, 6.548],
      [0, 0.728, 1.455],
      [0, 0, 0]
    ],
    "statistics": {
      "q": {"max": 1, "min": 0, "average": 0.333, "sum": 2, "isDiagonal": false},
      "r": {"max": 7, "min": 0, "average": 2, "sum": 18, "isDiagonal": false}
    }
  },
  "message": "QR factorization completed successfully"
}
```

### Campos de respuesta

| Campo       | Tipo       | Descripción                              |
| ----------- | ---------- | ---------------------------------------- |
| `original`  | `int[][]`  | Matriz de entrada                        |
| `q`         | `float[][]`| Matriz ortogonal (Q)                     |
| `r`         | `float[][]`| Matriz triangular superior (R)           |
| `statistics.q` | `object` | Estadísticas de Q (max, min, avg, sum, isDiagonal) |
| `statistics.r` | `object` | Estadísticas de R (max, min, avg, sum, isDiagonal) |

### Algoritmo QR

Gram-Schmidt modificado:
1. Extraer columnas de A como vectores
2. Orthogonalizar contra columnas anteriores
3. Normalizar para obtener Q
4. Calcular R = Q^T × A

Complejidad: O(m × n²)

### Validaciones

- Matriz no vacía
- Todas las filas misma longitud (rectangular)

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

# Factorización QR
curl -X POST http://localhost:3001/api/v1/matrix/qr \
  -H "Content-Type: application/json" \
  -d '{"matrix": [[1,2,3],[4,5,6]]}'

# QR con matriz cuadrada
curl -X POST http://localhost:3001/api/v1/matrix/qr \
  -H "Content-Type: application/json" \
  -d '{"matrix": [[1,1],[1,-1]]}'
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
│   ├── usecase/matrix_usecase.go           # Lógica de rotación + QR
│   ├── usecase/matrix_usecase_test.go      # Tests unitarios
│   ├── infrastructure/express_client.go    # Cliente HTTP → api-express
│   ├── delivery/http/                      # Handlers + routes
│   │   ├── matrix_handler.go
│   │   ├── matrix_handler_test.go          # Tests HTTP
│   │   └── routes.go
│   ├── handlers/                           # Health endpoints
│   └── middlewares/                         # Error handler
├── pkg/dto/                                # Request/response DTOs
├── Dockerfile
└── Makefile
```
