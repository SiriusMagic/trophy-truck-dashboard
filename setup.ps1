# ==========================================================
# setup.ps1 — Instala dependencias de backend y frontend
# Uso (PowerShell):  ./setup.ps1
# ==========================================================
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

Write-Host "==> Configurando BACKEND (Python / FastAPI)" -ForegroundColor Cyan
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

Write-Host "==> Configurando FRONTEND (React)" -ForegroundColor Cyan
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
Write-Host ""
Write-Host "Instalacion completa." -ForegroundColor Green
Write-Host "   Siguiente paso: ./run-dev.ps1  (o  docker compose up --build)"
