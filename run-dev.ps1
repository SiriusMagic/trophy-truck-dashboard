# ==========================================================
# run-dev.ps1 — Levanta el FRONTEND (:3000) y, si existe, el
# BACKEND opcional (:8001).
#
#   ./run-dev.ps1              -> frontend + backend (si hay venv)
#   ./run-dev.ps1 -FrontOnly   -> solo frontend
#
# Ctrl+C detiene todo.
# ==========================================================
param([switch]$FrontOnly)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path

$backend = $null
if (-Not $FrontOnly -and (Test-Path "$Root/backend/.venv")) {
    Write-Host "==> Iniciando BACKEND (opcional) en http://localhost:8001" -ForegroundColor Cyan
    $backend = Start-Process -PassThru -NoNewWindow -WorkingDirectory "$Root/backend" `
        -FilePath ".venv/Scripts/python.exe" `
        -ArgumentList "-m","uvicorn","server:app","--host","0.0.0.0","--port","8001","--reload"
} else {
    Write-Host "==> Modo FRONTEND-ONLY (backend no se inicia)." -ForegroundColor Yellow
}

Write-Host "==> Iniciando FRONTEND en http://localhost:3000" -ForegroundColor Cyan
$useYarn = [bool](Get-Command yarn -ErrorAction SilentlyContinue)
$frontCmd = if ($useYarn) { "yarn" } else { "npm" }
$frontend = Start-Process -PassThru -NoNewWindow -WorkingDirectory "$Root/frontend" `
    -FilePath $frontCmd -ArgumentList "start"

Write-Host ""
Write-Host "Presiona Ctrl+C para detener los servicios." -ForegroundColor Yellow

try {
    $ids = @($frontend.Id)
    if ($backend) { $ids += $backend.Id }
    Wait-Process -Id $ids
} finally {
    Write-Host "==> Deteniendo servicios..." -ForegroundColor Cyan
    if ($backend -and -Not $backend.HasExited) { Stop-Process -Id $backend.Id -Force -ErrorAction SilentlyContinue }
    if (-Not $frontend.HasExited) { Stop-Process -Id $frontend.Id -Force -ErrorAction SilentlyContinue }
}
