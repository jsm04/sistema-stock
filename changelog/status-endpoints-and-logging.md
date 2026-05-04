# Changelog

### Agregado

- **Nuevo endpoint `GET /status/200`**
  - Devuelve el mensaje `"hola mundo"` con código HTTP 200.
  - Loguea la solicitud con Winston.

- **Nuevo endpoint `GET /status/500`**
  - Devuelve el mensaje `"internal server error"` con código HTTP 500.
  - Loguea la solicitud con Winston.

- **Nuevo endpoint `GET /status/429`**
  - Devuelve el mensaje `"too many requests"` con código HTTP 429.
  - Loguea la solicitud con Winston.

- **Nuevo endpoint `POST /status/save`**
  - Recibe un JSON en el body y lo guarda en una base de datos simulada (array en memoria).
  - Tiene un 50% de probabilidad de devolver error 500 simulando un fallo en la base de datos.
  - Loguea la solicitud y el resultado (éxito o error).

- **Nuevo endpoint `GET /status/save`**
  - Devuelve todos los registros guardados en la base de datos simulada como JSON.
  - Loguea la solicitud con Winston.

- **Sistema de logging con Winston**
  - Archivo: `src/server/utils/logger.ts`
  - Configuración: logs en consola con formato legible que incluye fecha (`YYYY-MM-DD HH:mm:ss`), nivel (`INFO`/`ERROR`) y mensaje.
  - Colores en consola (verde para INFO, rojo para ERROR).
  - Integrado en todos los endpoints existentes (`/api/login`, `/api/register`) y nuevos (`/status/*`).

### Modificado

- **`src/server/main.ts`**
  - Agregados 5 nuevos endpoints bajo la ruta `/status/`.
  - Integrado Winston logging en rutas existentes (`/api/login`, `/api/register`).
  - Agregada variable `savedRecords` como base de datos simulada en memoria.

### Dependencias

- **Agregado:** `winston@3.19.0`
- **Agregado:** `@types/winston@2.4.4` (dev)

### Archivos nuevos

- `src/server/utils/logger.ts` — Configuración del logger con Winston
- `changelog/status-endpoints-and-logging.md` — Este archivo
