# DEPLOY.md — Guía de despliegue

Esta guía explica cómo desplegar el **Trophy Truck Eléctrico** (frontend React + backend FastAPI + MongoDB) en distintos entornos.

---

## 1. Variables de entorno necesarias

| Variable | Servicio | Descripción | Ejemplo producción |
|----------|----------|-------------|--------------------|
| `MONGO_URL` | Backend | Conexión a MongoDB | `mongodb://usuario:pass@host:27017` |
| `DB_NAME` | Backend | Nombre de la base de datos | `trophy_truck` |
| `CORS_ORIGINS` | Backend | Orígenes permitidos (coma) | `https://midominio.com` |
| `REACT_APP_BACKEND_URL` | Frontend (build-time) | URL pública del backend; vacío si se usa proxy mismo-origen | `https://api.midominio.com` o `` |

> ⚠️ `REACT_APP_BACKEND_URL` se incrusta **durante el build** del frontend (Create React App). Si cambia, hay que **reconstruir** el frontend.

---

## 2. Opción A — Docker Compose (recomendado)

La forma más reproducible. Incluye frontend, backend y MongoDB.

```bash
# 1. Clonar y entrar al proyecto
git clone <repo-url> && cd <repo>

# 2. Configurar variables (opcional, hay valores por defecto)
cp .env.example .env

# 3. Construir y levantar todo
docker compose up --build -d
```

- Frontend: `http://localhost:3000`
- Backend:  `http://localhost:8001/api`
- MongoDB:  `localhost:27017` (volumen persistente `mongo_data`)

Nginx del frontend hace **proxy de `/api`** hacia el backend, por eso `REACT_APP_BACKEND_URL` puede ir vacío (mismo origen).

**Comandos útiles:**
```bash
docker compose logs -f          # ver logs
docker compose ps               # estado de servicios
docker compose down             # detener
docker compose down -v          # detener y borrar datos de Mongo
```

---

## 3. Opción B — Servidor Linux (sin Docker)

```bash
# Backend
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
# Producción (varios workers, sin --reload):
uvicorn server:app --host 0.0.0.0 --port 8001 --workers 4
# (Recomendado: gestionar con systemd, supervisor o pm2)

# Frontend
cd ../frontend
yarn install && yarn build      # genera frontend/build/
# Servir los estáticos con Nginx, Caddy o "npx serve -s build"
```

**Ejemplo de bloque Nginx en producción:**
```nginx
server {
    listen 80;
    server_name midominio.com;

    root /var/www/trophy-truck/frontend/build;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }

    location /api/ {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 4. Opción C — Plataformas Cloud

**Frontend (Vercel / Netlify / Cloudflare Pages):**
- Build command: `yarn build` (o `npm run build`)
- Output directory: `build`
- Variable de entorno: `REACT_APP_BACKEND_URL=https://tu-backend.com`

**Backend (Render / Railway / Fly.io / AWS):**
- Usa `backend/Dockerfile`, o
- Start command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
- Variables: `MONGO_URL`, `DB_NAME`, `CORS_ORIGINS`

**Base de datos:** usa **MongoDB Atlas** (gratis) y pon su cadena en `MONGO_URL`.

---

## 5. Comandos resumidos de build y start

| Acción | Comando |
|--------|---------|
| Build frontend | `cd frontend && yarn build` |
| Start backend (prod) | `uvicorn server:app --host 0.0.0.0 --port 8001 --workers 4` |
| Todo con Docker | `docker compose up --build -d` |

---

## 6. Verificar que la app quedó funcionando

```bash
# Backend responde
curl http://localhost:8001/api/
# Esperado: {"message":"Hello World"}

# Docs de la API
# Abrir en navegador: http://localhost:8001/docs

# Frontend responde (200 OK)
curl -I http://localhost:3000

# Con docker compose: todos los servicios "Up"
docker compose ps
```

Si `curl http://localhost:8001/api/` devuelve `{"message":"Hello World"}` y el frontend carga el dashboard en horizontal, el despliegue es correcto. ✅

---

## 7. Checklist de producción

- [ ] `CORS_ORIGINS` restringido a tu dominio real (no `*`).
- [ ] MongoDB con autenticación y backups.
- [ ] HTTPS habilitado (Nginx/Caddy/cloud).
- [ ] `REACT_APP_BACKEND_URL` correcto antes de hacer build del frontend.
- [ ] Backend con `--workers` > 1 y gestor de procesos (systemd/supervisor).
