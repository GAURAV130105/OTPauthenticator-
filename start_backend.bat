@echo off
echo Starting OTP Auth Backend...
cd /d d:\otpvalidator\backend
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
) else (
    echo Virtual environment not found.
    echo Please run: python -m venv venv
    echo Then run: venv\Scripts\pip install -r requirements.txt
    pause
    exit /b 1
)
echo Backend starting at http://localhost:8000
uvicorn main:app --reload --host 0.0.0.0 --port 8000
pause
