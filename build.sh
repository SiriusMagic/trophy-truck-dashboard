#!/usr/bin/env bash
# ==========================================================
# build.sh — Genera la build de producción del frontend
# Uso: ./build.sh   (resultado en frontend/build/)
# ==========================================================
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR/frontend"

echo "==> Generando build de producción del FRONTEND"
if command -v yarn >/dev/null 2>&1; then
  yarn install
  yarn build
else
  npm install
  npm run build
fi

echo ""
echo "✅ Build generada en frontend/build/"
echo "   Para servirla localmente:  cd frontend && npm run serve"
echo ""
echo "ℹ️  El backend FastAPI no requiere build; se ejecuta con:"
echo "    cd backend && source .venv/bin/activate && uvicorn server:app --host 0.0.0.0 --port 8001"
