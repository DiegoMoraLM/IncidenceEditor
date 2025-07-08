@echo off
echo Cerrando servidores...

taskkill /fi "windowtitle eq Backend" /f
taskkill /fi "windowtitle eq Frontend" /f

echo Listo.