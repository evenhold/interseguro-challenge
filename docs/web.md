# Web (Next.js)

Puerto: `:3000`

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript 7
- Tailwind CSS v4

## Rutas

| Ruta         | Descripción                        |
| ------------ | ---------------------------------- |
| `/`          | Formulario de rotación de matrices |
| `/dashboard` | Health status de servicios         |

## `/` — Formulario de Rotación

- Textarea para ingresar matriz en JSON
- Selector de grados (90°, 180°, 270°)
- Botón "Rotar" que llama a `POST /api/v1/matrix/rotate`
- Muestra resultado: original vs rotada + estadísticas

## `/dashboard` — Health Status

- Grid de cards con estado de cada servicio
- Indicador verde/rojo por servicio
- Health status + puerto de cada API

## Desarrollo local

```bash
cd web
cp .env.example .env.local
pnpm install
pnpm dev
# → http://localhost:3000
```

## Variables de entorno

| Variable                      | Default                 | Descripción                   |
| ----------------------------- | ----------------------- | ----------------------------- |
| `NEXT_PUBLIC_API_GO_URL`      | `http://localhost:3001` | URL de la API Go (build time) |
| `NEXT_PUBLIC_API_EXPRESS_URL` | `http://localhost:3002` | URL de la API Express         |

> Las variables `NEXT_PUBLIC_*` se inyectan en el build y quedan embebidas en el bundle del cliente.

## Estructura

```
web/
├── src/app/
│   ├── page.tsx                             # Formulario de rotación
│   ├── dashboard/page.tsx                   # Health status
│   ├── layout.tsx
│   └── globals.css                          # Tailwind CSS
├── postcss.config.mjs
├── next.config.js
├── Dockerfile
└── package.json
```
