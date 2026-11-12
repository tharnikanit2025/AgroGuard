@echo off
title AgroGuard AI Server
cd /d "%~dp0backend"

echo =====================================================================
echo           AgroGuard AI - Launching Server
echo   Team: KAIROS - Chennai Institute of Technology, Chennai
echo =====================================================================
echo.
echo [1/2] Opening application in your web browser...
start http://127.0.0.1:8000/

echo [2/2] Starting FastAPI backend on http://127.0.0.1:8000 ...
echo (Press Ctrl+C to stop the server)
echo.

python -m uvicorn main:app --host 127.0.0.1 --port 8000
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [!] 'python' command failed. Trying 'py' launcher...
    py -m uvicorn main:app --host 127.0.0.1 --port 8000
)

pause
