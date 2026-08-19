# Variables de Entorno

## api-go

| Variable          | Default                   | Descripción                   |
| ----------------- | ------------------------- | ----------------------------- |
| `PORT`            | `8080`                    | Puerto del servidor           |
| `APP_ENV`         | `development`             | development / production      |
| `API_EXPRESS_URL` | `http://api-express:3000` | URL de api-express para stats |

## api-express

| Variable   | Default       | Descripción         |
| ---------- | ------------- | ------------------- |
| `PORT`     | `3000`        | Puerto del servidor |
| `NODE_ENV` | `development` | Entorno             |

## web

| Variable                      | Default                 | Descripción                   |
| ----------------------------- | ----------------------- | ----------------------------- |
| `NEXT_PUBLIC_API_GO_URL`      | `http://localhost:3001` | URL de la API Go (build time) |
| `NEXT_PUBLIC_API_EXPRESS_URL` | `http://localhost:3002` | URL de la API Express         |

> Las variables `NEXT_PUBLIC_*` se inyectan en el build de Next.js y quedan embebidas en el bundle del cliente.
