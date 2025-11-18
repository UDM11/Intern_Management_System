@echo off
echo Starting Intern Management System...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && python run.py"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo.
echo To create admin user, run: cd backend && python create_admin.py
echo.
pause