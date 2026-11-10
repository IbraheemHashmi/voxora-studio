@echo off
title VOXORA STUDIO PRO - Neural Voice & Video Pacing Engine
echo =========================================================================
echo                       VOXORA STUDIO PRO
echo             Next-Gen Neural Voice & Video Pacing Engine
echo         Featuring Andrew Natural, Ava, Brian, and 322+ Voices
echo =========================================================================
echo.
cd /d "%~dp0"

echo [1/2] Verifying Python & dependencies...
python -m pip install -q -r requirements.txt

echo [2/2] Launching VOXORA Studio on http://localhost:8000 ...
start "" http://localhost:8000

python -m uvicorn server:app --host 0.0.0.0 --port 8000
pause
