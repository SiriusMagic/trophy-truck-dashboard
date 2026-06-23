#!/usr/bin/env bash
# ==========================================================
# setup.sh — Instala dependencias.
#
#   ./setup.sh              -> frontend + backend opcional
#   ./setup.sh --front-only -> solo frontend (app frontend-only)
#
# ==========================================================
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

FRONT_ONLY=false
[ "${1:-}" = "--front-only" ] && FRONT_ONLY=true

echo "==> Configurando FRONTEND (React) — requerido"
cd frontend
if command -v yarn >/dev/null 2>&1; then
  echo "    Usando yarn"
  yarn install
else
  echo "    Usando npm"
  npm install
fi
if [ ! -f ".env" ]; then
  echo "    Creando frontend/.env desde .env.example"
  cp .env.example .env
fi
cd "$ROOT_DIR"

if [ "$FRONT_ONLY" = true ]; then
  echo ""
  echo "✅ Frontend listo (modo frontend-only)."
  echo "   Ejecuta: ./run-dev.sh --front-only"
  exit 0
fi

echo "==> Configurando BACKEND (FastAPI) — opcional (healthcheck)"
cd backend
if [ ! -d ".venv" ]; then
  echo "    Creando entorno virtual en backend/.venv"
  python3 -m venv .venv
fi
# shellcheck disable=SC1091
source .venv/bin/activate
python -m pip install --upgrade pip >/dev/null
pip install -r requirements.txt
if [ ! -f ".env" ]; then
  echo "    Creando backend/.env desde .env.example"
  cp .env.example .env
fi
deactivate
cd "$ROOT_DIR"

echo ""
echo "✅ Instalación completa (frontend + backend opcional)."
echo "   Siguiente paso: ./run-dev.sh   (o  docker compose up --build)"
