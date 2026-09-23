@echo off
echo Starting Community Chat Application...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "npm run server"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd client && npm start"

echo.
echo Both servers are starting up!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul




