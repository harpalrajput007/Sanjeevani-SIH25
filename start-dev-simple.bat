@echo off
echo Starting Frontend and Backend (No Blockchain)...

echo Starting Backend Server (Dev Mode)...
start "Backend Server" cmd /k "cd backend && npm run dev-no-blockchain"

timeout /t 3 /nobreak > nul

echo Starting Frontend Development Server...
start "Frontend Server" cmd /k "cd web-app && npm run dev"

echo.
echo Servers starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
pause