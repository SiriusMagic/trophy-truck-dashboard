# Trophy Truck Eléctrico — Panel de Sistemas Inteligente

Interfaz futurista para un trophy truck eléctrico construida con **React (CRA + CRACO)** y **Three.js**. Muestra un dashboard con telemetría (velocidad, RPM, torque, batería, temperatura), un modelo 3D interactivo y múltiples módulos de control del vehículo.

> ⚡ **Estado actual: la app es _frontend-only_.** Funciona de forma autónoma con datos simulados (`src/data/mockData.js`) y un modelo 3D generado por código. **No requiere backend ni base de datos.**
>
> Existe un **backend opcional** (FastAPI) reducido a un esqueleto con endpoints de verificación, pensado para una API futura (ver sección [Backend futuro](#11-backend-futuro)).

---

## 1. Requisitos previos

| Herramienta | Versión recomendada | Necesario para |
|-------------|---------------------|----------------|
| **Node.js** | `>= 20.x` (probado en 20.20) | Frontend (incluye `npm` y `yarn`) |
| **npm**     | `>= 10.x`           | Frontend (alternativa: `yarn 1.22`) |
| **Python**  | `>= 3.11`           | Backend **opcional** |
| **Docker**  | `>= 24` (opcional)  | Despliegue reproducible |

> MongoDB **ya no es necesario**: se eliminó la dependencia.

Comprueba versiones: `node --version` · `npm --version` · `python3 --version`

---

## 2. Instalación paso a paso

### Opción A — Un solo comando

**Solo frontend (recomendado para la app actual):**
```bash
./setup.sh --front-only          # Linux/macOS
./setup.ps1 -FrontOnly           # Windows PowerShell
```

**Frontend + backend opcional:**
```bash
./setup.sh                       # Linux/macOS
./setup.ps1                      # Windows PowerShell
```

Los scripts instalan dependencias (usan **yarn** si está disponible, si no **npm**) y crean los `.env` desde los `.env.example`.

### Opción B — Manual (solo frontend)
```bash
cd frontend
npm install            # o: yarn install
cp .env.example .env
```

---

## 3. Cómo ejecutar el **frontend** (modo principal)

```bash
cd frontend
npm run dev        # alias de "npm start" (CRACO)
# o: npm start
```
- URL: **http://localhost:3000**
- Optimizado para **orientación horizontal (landscape)**.
- No necesita backend.

## 4. Cómo ejecutar el **backend opcional** (healthcheck)

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001
```
- Entrada: **`backend/server.py`** (instancia FastAPI `app`).
- Endpoints: `GET /api/` y `GET /api/health`.
- Docs: **http://localhost:8001/docs**

## 5. Cómo ejecutar **todo junto / por separado**

```bash
./run-dev.sh                # frontend + backend (si existe el venv)
./run-dev.sh --front-only   # solo frontend

# Windows
./run-dev.ps1
./run-dev.ps1 -FrontOnly
```

Con Docker:
```bash
docker compose up --build   # frontend (:3000) + backend opcional (:8001)
```

---

## 6. Generar build de producción

**Linux/macOS:** `./build.sh` · **Windows:** `./build.ps1`

Genera `frontend/build/`. Servir localmente: `cd frontend && npm run serve`.

---

## 7. Puertos usados

| Servicio | Puerto | URL |
|----------|--------|-----|
| Frontend | `3000` | http://localhost:3000 |
| Backend (opcional) | `8001` | http://localhost:8001/api |

---

## 8. Variables de entorno

**`frontend/.env`**
| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `REACT_APP_BACKEND_URL` | URL base del backend (no usada hoy por el frontend) | `http://localhost:8001` |
| `WDS_SOCKET_PORT` | Puerto del websocket del dev server | `3000` |

**`backend/.env`** (solo si usas el backend)
| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `CORS_ORIGINS` | Orígenes permitidos (coma) | `*` |

---

## 9. Errores comunes y solución

| Síntoma | Causa | Solución |
|---------|-------|----------|
| Pantalla "Gira tu dispositivo" | La app exige horizontal | Usa una ventana más ancha que alta |
| `Port 3000 is already in use` | Puerto ocupado | Mata el proceso o cambia `PORT` |
| Frontend no carga estilos | Dependencias incompletas | Reinstala con `npm install` (o `yarn install`) |
| `uvicorn: command not found` | venv no activado | Activa `.venv` y `pip install -r backend/requirements.txt` |
| Conflicto npm/yarn | Existen ambos lockfiles | Usa un solo gestor; el proyecto trae `yarn.lock` |

---

## 10. Estructura del proyecto

```
/
├── README.md / DEPLOY.md
├── docker-compose.yml      · frontend + backend opcional (sin Mongo)
├── .env.example
├── setup.{sh,ps1} · run-dev.{sh,ps1} · build.{sh,ps1}
├── backend/                · FastAPI esqueleto (opcional)
│   ├── server.py           · /api/  y  /api/health
│   ├── requirements.txt    · fastapi, uvicorn, python-dotenv
│   ├── Dockerfile
│   └── .env.example
└── frontend/               · React (CRA + CRACO) — app principal
    ├── src/
    ├── package.json
    ├── Dockerfile · nginx.conf
    └── .env.example
```

---

## 11. Backend futuro

El backend actual es un **esqueleto intencional** (solo `/api/` y `/api/health`). Está preparado para crecer cuando el producto lo requiera, sin implementarse todavía:

- **Telemetría real**: WebSockets/SSE para alimentar el dashboard con datos en vivo en lugar de `mockData.js`.
- **Persistencia**: base de datos (p. ej. MongoDB) para guardar configuraciones del vehículo y perfiles de conducción.
- **Usuarios y autenticación**: login/registro, sesiones y roles (conductor, técnico, admin).
- **Historial**: registro de viajes, diagnósticos y métricas.

> Hasta que se decida implementar lo anterior, **no se configura MongoDB, auth ni CORS avanzado**.

Para despliegue, lee **[DEPLOY.md](./DEPLOY.md)**.

## Licencia

Copyright 2026 SiriusMagic

Este proyecto se distribuye bajo la **Licencia Apache 2.0**. Consulta el archivo [`LICENSE`](./LICENSE) para ver el texto completo.

En resumen: cualquiera puede usar, copiar, modificar y distribuir este código, siempre que conserve el aviso de copyright y la licencia. El software se entrega **"tal cual", sin garantías de ningún tipo**, y los autores no se hacen responsables de daños derivados de su uso.
