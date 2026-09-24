@echo off
echo Starting OTP Auth Frontend...
cd /d d:\otpvalidator\frontend
if not exist node_modules (
    echo Installing dependencies...
    npm install
)
echo Frontend starting at http://localhost:5173
npm run dev
pause
