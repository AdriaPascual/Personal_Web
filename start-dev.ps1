$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Arrancando API..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\PersonalWebAPI'; dotnet run"

Write-Host "Arrancando frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\frontend'; npm run dev"

Write-Host ""
Write-Host "Listo. Abriendo en 8 segundos (espera a que Vite arranque)..." -ForegroundColor Green
Start-Sleep -Seconds 8
Start-Process "http://localhost:5173"
