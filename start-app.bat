@echo off
:: Iniciar backend minimizado y sin consola persistente
start "" /min cmd /c "cd /d C:\LMGroup\IncidenceEditor\backend && node server.js"

:: Esperar un poco antes del frontend
timeout /t 2 > nul

:: Iniciar frontend minimizado y sin consola persistente
start "" /min cmd /c "cd /d C:\LMGroup\IncidenceEditor\frontend && node server.js"