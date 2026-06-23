#!/usr/bin/env bash
# ==========================================================
# run-dev.sh — Levanta backend (:8001) y frontend (:3000)
# Uso: ./run-dev.sh   (Ctrl+C detiene ambos)
# ==========================================================
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

if [ ! -d "backend/.venv" ]; then
  echo "❌ No se encontró backend/.venv. Ejecuta primero ./setup.sh"
  exit 1
fi

cleanup() {
  echo ""
  echo "==> Deteniendo servicios..."
  kill 0 2>/dev/null || true
}
trap cleanup EXIT INT TERM

echo "==> Iniciando BACKEND en http://localhost:8001"
(
  cd backend
  # shellcheck disable=SC1091
  source .venv/bin/activate
  uvicorn server:app --host 0.0.0.0 --port 8001 --reload
) &

echo "==> Iniciando FRONTEND en http://localhost:3000"
(
  cd frontend
  if command -v yarn >/dev/null 2>&1; then
    yarn start
  else
    npm start
  fi
) &

wait
