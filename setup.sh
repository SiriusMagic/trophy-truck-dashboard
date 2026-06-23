#!/usr/bin/env bash
# ==========================================================
# setup.sh — Instala dependencias de backend y frontend
# Uso: ./setup.sh
# ==========================================================
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo "==> Configurando BACKEND (Python / FastAPI)"
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

echo "==> Configurando FRONTEND (React)"
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

echo ""
echo "✅ Instalación completa."
echo "   Siguiente paso: ./run-dev.sh  (o  docker compose up --build)"
