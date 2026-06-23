# DEPLOY.md — Guía de despliegue

La app es **frontend-only** (React + Three.js, datos simulados). El **backend FastAPI es opcional** y solo expone endpoints de verificación. **No hay MongoDB ni autenticación.**

---

## 1. Variables de entorno

| Variable | Servicio | Descripción | Ejemplo |
|----------|----------|-------------|---------|
| `REACT_APP_BACKEND_URL` | Frontend (build-time) | URL del backend; vacío si se usa proxy mismo-origen o no hay backend | `` o `https://api.midominio.com` |
| `CORS_ORIGINS` | Backend (opcional) | Orígenes permitidos | `https://midominio.com` |

> ⚠️ `REACT_APP_BACKEND_URL` se incrusta **durante el build** del frontend. Hoy el frontend no llama al backend, así que puede ir vacío.

---

## 2. Despliegue solo del frontend (caso actual)

El frontend es estático tras el build; se puede desplegar en cualquier hosting estático.

```bash
cd frontend
yarn install && yarn build      # genera frontend/build/
```

- **Vercel / Netlify / Cloudflare Pages**: build command `yarn build`, output `build`.
- **Servidor propio (Nginx/Caddy)**: sirve la carpeta `frontend/build`.
- **Rápido/local**: `npx serve -s build -l 3000`.

Ejemplo Nginx (estático):
```nginx
server {
    listen 80;
    server_name midominio.com;
    root /var/www/trophy-truck/frontend/build;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
}
```

---

## 3. Despliegue con Docker (frontend + backend opcional)

```bash
cp .env.example .env            # opcional
docker compose up --build -d
```
- Frontend: `http://localhost:3000` (Nginx; hace proxy de `/api` al backend)
- Backend opcional: `http://localhost:8001/api`

Comandos: `docker compose logs -f` · `docker compose ps` · `docker compose down`

> Para desplegar **solo el frontend** con Docker, comenta el servicio `backend` en `docker-compose.yml` (Nginx seguirá sirviendo la SPA; el proxy `/api` solo aplica si llamas a la API).

---

## 4. Backend opcional (sin Docker)

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001 --workers 2
```

Plataformas (Render/Railway/Fly.io): usa `backend/Dockerfile` o start command `uvicorn server:app --host 0.0.0.0 --port $PORT`. Variable: `CORS_ORIGINS`.

---

## 5. Verificar que quedó funcionando

```bash
# Frontend (200 OK)
curl -I http://localhost:3000

# Backend opcional
curl http://localhost:8001/api/        # {"message":"Trophy Truck API running"}
curl http://localhost:8001/api/health  # {"status":"ok"}
```

Si el frontend carga el dashboard en horizontal, el despliegue es correcto. ✅
