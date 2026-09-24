@echo off
echo ==========================================
echo  OTP Auth System - Full Setup
echo ==========================================
echo.

echo [1/4] Creating Python virtual environment...
cd /d d:\otpvalidator\backend
python -m venv venv
echo Done.
echo.

echo [2/4] Installing Python dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt
echo Done.
echo.

echo [3/4] Installing Node.js dependencies...
cd /d d:\otpvalidator\frontend
npm install
echo Done.
echo.

echo [4/4] Setup complete!
echo.
echo ==========================================
echo  IMPORTANT: Configure your .env file!
echo ==========================================
echo Copy backend\.env.example to backend\.env
echo and fill in your SMTP credentials.
echo.
echo To start the application:
echo   1. Run start_backend.bat
echo   2. Run start_frontend.bat
echo   3. Open http://localhost:5173
echo ==========================================
pause
