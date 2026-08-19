# Web (Next.js)

Puerto: `:3000`

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript 7
- Tailwind CSS v4

## Rutas

| Ruta         | Descripción                                   |
| ------------ | --------------------------------------------- |
| `/`          | Login + formulario de rotación/QR de matrices |
| `/dashboard` | Health status de servicios                    |

## `/` — Página Principal

### Autenticación (JWT)

- Formulario de login (`LoginForm.tsx`) con usuario y contraseña
- Credenciales: `admin` / `matrix123`
- Al hacer login, se almacena el JWT en `localStorage`
- Header `Authorization: Bearer <jwt>` en todas las llamadas a la API

### Formulario de Matrices

- Textarea para ingresar matriz en JSON
- Botones de modo:
  - **"Rotar"** → `POST /api/v1/matrix/rotate`
  - **"QR"** → `POST /api/v1/matrix/qr`
- Selector de grados (90°, 180°, 270°) — solo visible cuando no está en modo QR
- Estado `activeOp` controla qué botón está activo (`"rotate"` | `"qr"` | `null`)
- Se resetea a `null` cuando cambia la matriz o los grados

### Resultado

- **Rotación**: Muestra matriz original vs rotada + estadísticas
- **QR**: Muestra Q (ortogonal) y R (triangular superior) + estadísticas de cada una
- Grid visual interactivo (`MatrixGrid.tsx`) con celdas de tamaño dinámico

### Interseguro Branding

- Botones con degradado rosa/magenta (`.btn-interseguro`)
- Logo en azul Interseguro (#0066FF)
- Fuente Inter
- Bordes cuadrados

## `/dashboard` — Health Status

- Grid de cards con estado de cada servicio
- Indicador verde/rojo por servicio
- Health check público (sin autenticación)
- Auto-refresh cada 30 segundos

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
├── src/
│   ├── app/
│   │   ├── page.tsx                             # Login + formulario principal
│   │   ├── dashboard/page.tsx                   # Health status
│   │   ├── layout.tsx                           # Root layout
│   │   └── globals.css                          # Tailwind CSS + Interseguro theme
│   └── components/
│       ├── LoginForm.tsx                        # Formulario de login
│       └── MatrixGrid.tsx                       # Grid visual de matriz
├── .env.local                                    # Variables de entorno
├── postcss.config.mjs
├── next.config.js
├── Dockerfile
└── package.json
```
