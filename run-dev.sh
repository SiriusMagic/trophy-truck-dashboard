#!/usr/bin/env bash
# ==========================================================
# run-dev.sh — Levanta el FRONTEND (:3000) y, si existe, el
# BACKEND opcional (:8001).
#
#   ./run-dev.sh              -> frontend + backend (si hay venv)
#   ./run-dev.sh --front-only -> solo frontend
#
# Ctrl+C detiene todo.
# ==========================================================
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

FRONT_ONLY=false
[ "${1:-}" = "--front-only" ] && FRONT_ONLY=true

cleanup() {
  echo ""
  echo "==> Deteniendo servicios..."
  kill 0 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# Backend OPCIONAL: solo si existe el venv y no se pidió front-only.
if [ "$FRONT_ONLY" = false ] && [ -d "backend/.venv" ]; then
  echo "==> Iniciando BACKEND (opcional) en http://localhost:8001"
  (
    cd backend
    # shellcheck disable=SC1091
    source .venv/bin/activate
    uvicorn server:app --host 0.0.0.0 --port 8001 --reload
  ) &
else
  echo "==> Modo FRONTEND-ONLY (backend no se inicia)."
fi

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
