# Proyecto: Sistema de Stock

## Descripción General

Aplicación full-stack para gestión de stock con autenticación de usuarios. Construida como proyecto escolar con Bun como runtime.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Runtime | Bun (v1.3.9) |
| Frontend | React 19 (JSX, client-side) |
| Estilos | Tailwind CSS v4 |
| Base de datos | SQLite (bun:sqlite) |
| ORM | Drizzle ORM |
| Validación | Zod v4 |
| Pruebas | Bun Test |

## Estructura del Proyecto

```
sistema-stock/
├── src/
│   ├── assets/
│   │   ├── index.html          # Entry point HTML (SPA)
│   │   ├── logo.svg
│   │   └── react.svg
│   ├── db.sqlite               # DB de desarrollo (persistente)
│   ├── server/
│   │   ├── main.ts             # Servidor HTTP (Bun.serve) + rutas API
│   │   ├── persistence/
│   │   │   └── database.ts     # Conexión SQLite + esquema (tabla users)
│   │   ├── useCases/
│   │   │   └── userService.ts  # Lógica de negocio (CRUD usuarios, login)
│   │   └── validation/
│   │       └── user.schema.ts  # Esquemas Zod para validación
│   ├── ui/
│   │   ├── App.tsx             # Componente raíz (login)
│   │   ├── init.tsx            # React DOM mount point
│   │   ├── global.css          # Tailwind import
│   │   ├── components/
│   │   │   ├── login.tsx       # Formulario de login
│   │   │   └── register.tsx    # Formulario de registro
│   │   └── pages/
│   │       └── register.tsx    # Página de registro (no usada en ruta principal)
│   └── tests/
│       ├── auth.service.test.ts # Tests de userService
│       └── setup.ts            # Setup de DB en memoria para tests
├── build.ts                    # Script de build personalizado (Bun.build)
├── bunfig.toml                 # Config de Bun (Tailwind plugin, env vars)
├── tsconfig.json               # TypeScript (strict, ESNext, JSX)
└── package.json
```

## Arquitectura

### Patrón: Monolito Full-Stack con Bun

Bun actúa como runtime unificado: servidor HTTP + bundler + test runner. No hay separación entre frontend y backend en procesos distintos — el frontend se sirve como SPA desde el mismo servidor.

### Capa de Servidor (`src/server/`)

- **`main.ts`**: Servidor HTTP con `Bun.serve()`. Define 3 rutas:
  - `'/*'` → sirve `index.html` (SPA fallback)
  - `POST /api/login` → autenticación
  - `POST /api/register` → registro de usuarios
  - Manejo de errores con respuestas JSON estandarizadas (400, 401, 409, 500)

- **`persistence/database.ts`**: Conexión a SQLite via `bun:sqlite` + Drizzle ORM. Define el esquema con la tabla `users` (id, username, password_hash, role, created_at).

- **`useCases/userService.ts`**: Factory function que retorna métodos de negocio:
  - `createUser()` → hash con `Bun.password.hash()`, inserta en DB
  - `login()` → busca usuario, verifica con `Bun.password.verify()`
  - Recibe la DB como inyección de dependencias (facilita testing)

- **`validation/user.schema.ts`**: Esquemas Zod para tipado y validación de inputs.

### Capa de Frontend (`src/ui/`)

- **SPA React** montada desde `init.tsx` en el `<div id="root">` de `index.html`.
- **`App.tsx`**: Componente raíz que renderiza el formulario de Login.
- **`components/login.tsx`**: Formulario con fetch a `/api/login`, estado de loading/error.
- **`components/register.tsx`**: Formulario con fetch a `/api/register`, validación local + select de rol.
- **`pages/register.tsx`**: Componente de registro (existe pero no está en la ruta principal).
- Estilos con Tailwind CSS v4 via `bun-plugin-tailwind`.

### Base de Datos

- **SQLite** embebido (`db.sqlite` en `src/`).
- Tabla `users`: id (autoincrement), username (unique), password_hash, role ('admin' | 'operador'), created_at.
- Para tests: DB en memoria (`:memory:`) con tablas creadas manualmente en `setup.ts`.

### Build

- **`build.ts`**: Script personalizado que usa `Bun.build()` para compilar `index.html` como entrypoint.
  - Plugin Tailwind integrado
  - Minificación, sourcemaps linked
  - Target: browser
  - Soporta flags CLI (outdir, minify, sourcemap, etc.)

### Testing

- **Bun Test** con `bun test`.
- Tests en `auth.service.test.ts` cubren:
  - Creación de usuario (éxito y duplicado)
  - Login (éxito, usuario inexistente, password incorrecto)
- DB aislada por test via `createTestDB()` con `:memory:`.

## Flujo de Datos

```
[Browser] ──fetch──> [Bun Server]
                            │
                    ┌───────┴───────┐
                    │  userService  │
                    │  (business)   │
                    └───────┬───────┘
                            │
                    ┌───────┴───────┐
                    │  Drizzle ORM  │
                    │  → SQLite     │
                    └───────────────┘
```

1. Frontend envía JSON a `/api/login` o `/api/register`
2. `main.ts` recibe la request, extrae body, llama a `userService()`
3. `userService` valida (Zod), ejecuta lógica (hash, query), retorna resultado
4. `main.ts` convierte a Response JSON con status code apropiado
5. Frontend maneja respuesta (éxito → `onSuccess`, error → `setError`)

## Estado Actual

- ✅ Autenticación funcional (login/register)
- ✅ Base de datos con tabla users
- ✅ Tests de servicio pasando
- ⚠️ Solo el Login está en la ruta principal; Register existe como componente pero no como página activa
- ⚠️ Sin gestión de sesiones (cookies/tokens) — el `onSuccess` del login solo hace console.log
- ⚠️ Sin protección de rutas — cualquier usuario accede a la SPA sin autenticar
- ⚠️ Sin manejo de errores de red en el frontend
- ⚠️ `.env` vacío (sin `DB_FILE_NAME` configurado, usa fallback de Bun)

## Scripts Disponibles

| Comando | Descripción |
|---------|------------|
| `bun dev` | Dev server con HMR (`bun --hot`) |
| `bun start` | Producción (`NODE_ENV=production`) |
| `bun run build` | Build con `build.ts` |
| `bun test` | Ejecutar tests |
