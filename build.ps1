# ==========================================================
# build.ps1 — Genera la build de produccion del frontend
# Uso (PowerShell):  ./build.ps1
# ==========================================================
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$Root/frontend"

Write-Host "==> Generando build de produccion del FRONTEND" -ForegroundColor Cyan
if (Get-Command yarn -ErrorAction SilentlyContinue) {
    yarn install
    yarn build
} else {
    npm install
    npm run build
}

Write-Host ""
Write-Host "Build generada en frontend/build/" -ForegroundColor Green
Write-Host "   Para servirla localmente:  cd frontend; npm run serve"
Write-Host ""
Write-Host "El backend FastAPI no requiere build; se ejecuta con:"
Write-Host "   cd backend; .venv/Scripts/Activate.ps1; uvicorn server:app --host 0.0.0.0 --port 8001"
