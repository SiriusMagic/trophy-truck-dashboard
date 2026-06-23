# Trophy Truck Eléctrico — Panel de Sistemas Inteligente

Interfaz futurista para un trophy truck eléctrico construida con **React (CRA + CRACO)** en el frontend y **FastAPI + MongoDB** en el backend. El frontend muestra un dashboard con telemetría (velocidad, RPM, torque, batería, temperatura), un modelo 3D interactivo (Three.js) y múltiples módulos de control del vehículo.

> ℹ️ Hoy el frontend funciona de forma autónoma con datos simulados (`src/data/mockData.js`) y un modelo 3D generado por código. El backend es opcional y queda preparado para futura telemetría real.

---

## 1. Requisitos previos

| Herramienta | Versión recomendada | Notas |
|-------------|---------------------|-------|
| **Node.js** | `>= 20.x` (probado en 20.20) | Incluye `npm` y `yarn` (clásico) |
| **npm**     | `>= 10.x`           | Alternativa: `yarn 1.22` |
| **Python**  | `>= 3.11` (probado en 3.11) | Para el backend |
| **pip**     | actualizado         | Instala dependencias Python |
| **MongoDB** | `>= 6.x` (opcional) | Solo si usas el backend con base de datos |
| **Docker**  | `>= 24` (opcional)  | Para despliegue reproducible |

Comprueba tus versiones:

```bash
node --version
npm --version
python3 --version
```

---

## 2. Instalación paso a paso

### Opción A — Un solo comando (recomendado)

**Linux / macOS:**
```bash
./setup.sh
```

**Windows (PowerShell):**
```powershell
./setup.ps1
```

Estos scripts:
1. Crean el entorno virtual de Python en `backend/.venv` e instalan `requirements.txt`.
2. Instalan las dependencias del frontend (usan **yarn** si está disponible, si no **npm**).
3. Crean los `.env` a partir de los `.env.example` si aún no existen.

### Opción B — Manual

```bash
# Backend
cd backend
python3 -m venv .venv
source .venv/bin/activate            # Windows: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
cp .env.example .env                 # ajusta valores si es necesario
cd ..

# Frontend
cd frontend
npm install                          # o: yarn install
cp .env.example .env
cd ..
```

---

## 3. Cómo ejecutar el **frontend**

```bash
cd frontend
npm run dev        # alias de "npm start" (CRACO start)
# o
npm start
```

- Se abre en: **http://localhost:3000**
- Requiere `frontend/.env` con `REACT_APP_BACKEND_URL`.

> La app está optimizada para **orientación horizontal (landscape)**.

## 4. Cómo ejecutar el **backend**

```bash
cd backend
source .venv/bin/activate                 # Windows: .venv\Scripts\Activate.ps1
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

- Archivo de entrada: **`backend/server.py`** (instancia FastAPI llamada `app`).
- API disponible en: **http://localhost:8001/api**
- Documentación interactiva: **http://localhost:8001/docs**
- Requiere `backend/.env` con `MONGO_URL` y `DB_NAME` (y MongoDB corriendo si usas la base de datos).

## 5. Cómo ejecutar **todo junto**

**Linux / macOS:**
```bash
./run-dev.sh
```

**Windows (PowerShell):**
```powershell
./run-dev.ps1
```

Levanta backend (`:8001`) y frontend (`:3000`) a la vez. `Ctrl + C` detiene ambos.

### O con Docker (lo más reproducible):
```bash
docker compose up --build
```
Frontend en **http://localhost:3000**, backend en **http://localhost:8001**, MongoDB en `:27017`.

---

## 6. Generar build de producción

**Linux / macOS:** `./build.sh`  ·  **Windows:** `./build.ps1`

Genera la build estática del frontend en `frontend/build/`. Para servirla localmente:

```bash
cd frontend
npm run serve        # sirve frontend/build en http://localhost:3000
```

---

## 7. Puertos usados

| Servicio  | Puerto | URL |
|-----------|--------|-----|
| Frontend  | `3000` | http://localhost:3000 |
| Backend   | `8001` | http://localhost:8001/api |
| MongoDB   | `27017`| mongodb://localhost:27017 |

---

## 8. Variables de entorno

Consulta los archivos `*.env.example`. Resumen:

**`backend/.env`**
| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `MONGO_URL` | Cadena de conexión a MongoDB | `mongodb://localhost:27017` |
| `DB_NAME` | Nombre de la base de datos | `trophy_truck` |
| `CORS_ORIGINS` | Orígenes permitidos (coma) | `*` |

**`frontend/.env`**
| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `REACT_APP_BACKEND_URL` | URL base del backend | `http://localhost:8001` |
| `WDS_SOCKET_PORT` | Puerto del websocket de dev server | `3000` |

---

## 9. Errores comunes y solución

| Síntoma | Causa probable | Solución |
|---------|----------------|----------|
| `uvicorn: command not found` | venv no activado o deps no instaladas | Activa `.venv` y `pip install -r backend/requirements.txt` |
| Backend arranca y muere al instante | Falta `MONGO_URL`/`DB_NAME` en `backend/.env` | Copia `backend/.env.example` a `.env` |
| `pymongo.errors.ServerSelectionTimeoutError` | MongoDB no está corriendo | Inicia MongoDB o usa `docker compose up` |
| Pantalla "Gira tu dispositivo" | La app exige orientación horizontal | Usa una ventana más ancha que alta |
| `Port 3000 is already in use` | Otro proceso ocupa el puerto | Mata el proceso o cambia `PORT` antes de `npm start` |
| Frontend no carga estilos | Dependencias incompletas | Reinstala con `npm install` (o `yarn install`) |
| Conflicto npm/yarn | Existen `package-lock.json` y `yarn.lock` | Usa un solo gestor; el proyecto trae `yarn.lock` |

---

## 10. Estructura del proyecto

```
/
├── README.md              · esta guía
├── DEPLOY.md              · guía de despliegue
├── docker-compose.yml     · orquesta frontend + backend + mongo
├── .env.example           · variables para docker-compose
├── setup.sh / setup.ps1   · instalación
├── run-dev.sh / run-dev.ps1 · ejecutar todo en desarrollo
├── build.sh / build.ps1   · build de producción
├── backend/
│   ├── server.py          · entrada FastAPI (app)
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
└── frontend/
    ├── src/               · React (CRA + CRACO)
    ├── package.json
    ├── Dockerfile
    ├── nginx.conf
    └── .env.example
```

Para despliegue en servidor/cloud, lee **[DEPLOY.md](./DEPLOY.md)**.
