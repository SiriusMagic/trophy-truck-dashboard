# PRD — Trophy Truck Eléctrico (Panel de Sistemas Inteligente)

## Problema / Objetivo
Interfaz futurista de un trophy truck eléctrico. Frontend React (CRA+CRACO) con dashboard de telemetría, modelo 3D (Three.js) y módulos de control. Backend FastAPI + MongoDB (opcional, preparado para telemetría real). Idioma del usuario: **Español**.

## Arquitectura
- Frontend: React 19, CRACO, Tailwind, Shadcn UI, Three.js. Entrada: `src/App.js` -> `FuturisticInterface`.
- Backend: FastAPI `backend/server.py` (app), Motor/MongoDB, endpoint `/api/assets/proxy`.
- Datos: mock (`src/data/mockData.js`). Frontend hoy NO llama al backend.

## Implementado
- 2026-06: **Repositorio listo para clonar/ejecutar/desplegar desde cero**:
  - `README.md` (requisitos, instalación, ejecución FE/BE/conjunta, puertos, errores comunes).
  - `.env.example` en raíz, `backend/`, `frontend/` (todas las variables documentadas).
  - Scripts: `setup.{sh,ps1}`, `run-dev.{sh,ps1}`, `build.{sh,ps1}` (auto-detectan yarn/npm, crean venv).
  - Docker: `backend/Dockerfile`, `frontend/Dockerfile` (build+nginx), `frontend/nginx.conf`, `docker-compose.yml` (mongo+backend+frontend), `.dockerignore`.
  - `DEPLOY.md` (Docker, servidor Linux, cloud, verificación).
  - `requirements.txt` ahora incluye `uvicorn[standard]`. `package.json` con scripts `dev`/`serve`.
  - Verificado: instalación limpia de backend en venv nuevo + uvicorn sirve `/api/` y `/docs`; build de producción del frontend compila OK.
- Sesiones previas: eliminado módulo BionicCooling; fix compilación `ui/button.jsx`. `NeuronsSystem.jsx` scaffolded (no cableado).

## Backlog priorizado
- **P0**: Integrar `NeuronsSystem.jsx` (NeuronsProvider/Context) para controlar elementos interactivos (sliders/botones) del dashboard. (PENDIENTE — propuesto pero el usuario pivotó a DevOps).
- **P1**: Testing frontend completo de interacciones neuronales.
- **P2**: Backend real + websockets para telemetría en vivo, reemplazar mockData.
- **P2**: CORS_ORIGINS restringido y MongoDB con auth para producción.

## Notas
- Riesgo arquitectónico: prop-drilling profundo; considerar React Context.
- App requiere orientación horizontal (landscape).
