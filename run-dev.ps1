# ==========================================================
# run-dev.ps1 — Levanta backend (:8001) y frontend (:3000)
# Uso (PowerShell):  ./run-dev.ps1
# ==========================================================
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path

if (-Not (Test-Path "$Root/backend/.venv")) {
    Write-Host "No se encontro backend/.venv. Ejecuta primero ./setup.ps1" -ForegroundColor Red
    exit 1
}

Write-Host "==> Iniciando BACKEND en http://localhost:8001" -ForegroundColor Cyan
$backend = Start-Process -PassThru -NoNewWindow -WorkingDirectory "$Root/backend" `
    -FilePath ".venv/Scripts/python.exe" `
    -ArgumentList "-m","uvicorn","server:app","--host","0.0.0.0","--port","8001","--reload"

Write-Host "==> Iniciando FRONTEND en http://localhost:3000" -ForegroundColor Cyan
$useYarn = [bool](Get-Command yarn -ErrorAction SilentlyContinue)
$frontCmd = if ($useYarn) { "yarn" } else { "npm" }
$frontend = Start-Process -PassThru -NoNewWindow -WorkingDirectory "$Root/frontend" `
    -FilePath $frontCmd -ArgumentList "start"

Write-Host ""
Write-Host "Presiona Ctrl+C para detener ambos servicios." -ForegroundColor Yellow

try {
    Wait-Process -Id $backend.Id, $frontend.Id
} finally {
    Write-Host "==> Deteniendo servicios..." -ForegroundColor Cyan
    if (-Not $backend.HasExited)  { Stop-Process -Id $backend.Id  -Force -ErrorAction SilentlyContinue }
    if (-Not $frontend.HasExited) { Stop-Process -Id $frontend.Id -Force -ErrorAction SilentlyContinue }
}
