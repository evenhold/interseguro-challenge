# Variables de Entorno

## api-go

| Variable          | Default (Docker)          | Default (Local)              | Descripción                   |
| ----------------- | ------------------------- | ---------------------------- | ----------------------------- |
| `PORT`            | `8080`                    | `3001`                       | Puerto del servidor           |
| `APP_ENV`         | `development`             | `development`                | development / production      |
| `API_EXPRESS_URL` | `http://api-express:3000` | `http://localhost:3002`       | URL de api-express para stats |
| `JWT_SECRET`      | `interseguro-jwt-secret-2024` | `interseguro-jwt-secret-2024` | Secreto para firmar tokens |
| `INTERNAL_SECRET` | `internal-service-secret` | `internal-service-secret`    | Secreto para comunicación interna |

> **Nota:** En Docker, `API_EXPRESS_URL` usa el nombre del contenedor (`api-express`). En local, usa `localhost`.

## api-express

| Variable   | Default (Docker) | Default (Local) | Descripción         |
| ---------- | ---------------- | --------------- | ------------------- |
| `PORT`     | `3000`           | `3002`          | Puerto del servidor |
| `NODE_ENV` | `development`    | `development`   | Entorno             |

## web

| Variable                      | Default                 | Descripción                   |
| ----------------------------- | ----------------------- | ----------------------------- |
| `NEXT_PUBLIC_API_GO_URL`      | `http://localhost:3001` | URL de la API Go (build time) |
| `NEXT_PUBLIC_API_EXPRESS_URL` | `http://localhost:3002` | URL de la API Express         |

> Las variables `NEXT_PUBLIC_*` se inyectan en el build de Next.js y quedan embebidas en el bundle del cliente.
