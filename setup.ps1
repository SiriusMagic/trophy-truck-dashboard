# ==========================================================
# setup.ps1 — Instala dependencias.
#
#   ./setup.ps1             -> frontend + backend opcional
#   ./setup.ps1 -FrontOnly  -> solo frontend (app frontend-only)
#
# ==========================================================
param([switch]$FrontOnly)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

Write-Host "==> Configurando FRONTEND (React) — requerido" -ForegroundColor Cyan
Set-Location "$Root/frontend"
if (Get-Command yarn -ErrorAction SilentlyContinue) {
    Write-Host "    Usando yarn"
    yarn install
} else {
    Write-Host "    Usando npm"
    npm install
}
if (-Not (Test-Path ".env")) {
    Write-Host "    Creando frontend/.env desde .env.example"
    Copy-Item ".env.example" ".env"
}
Set-Location $Root

if ($FrontOnly) {
    Write-Host ""
    Write-Host "Frontend listo (modo frontend-only)." -ForegroundColor Green
    Write-Host "   Ejecuta: ./run-dev.ps1 -FrontOnly"
    exit 0
}

Write-Host "==> Configurando BACKEND (FastAPI) — opcional (healthcheck)" -ForegroundColor Cyan
Set-Location "$Root/backend"
if (-Not (Test-Path ".venv")) {
    Write-Host "    Creando entorno virtual en backend/.venv"
    python -m venv .venv
}
& ".venv/Scripts/python.exe" -m pip install --upgrade pip | Out-Null
& ".venv/Scripts/python.exe" -m pip install -r requirements.txt
if (-Not (Test-Path ".env")) {
    Write-Host "    Creando backend/.env desde .env.example"
    Copy-Item ".env.example" ".env"
}
Set-Location $Root

Write-Host ""
Write-Host "Instalacion completa (frontend + backend opcional)." -ForegroundColor Green
Write-Host "   Siguiente paso: ./run-dev.ps1  (o  docker compose up --build)"
