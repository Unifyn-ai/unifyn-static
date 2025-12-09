@echo off
echo.
echo 🧪 Launching Chrome for Local Testing...
echo.

echo Closing existing Chrome instances...
taskkill /F /IM chrome.exe 2>nul

timeout /t 2 /nobreak >nul

echo Starting Chrome with security flags disabled...
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" ^
  --user-data-dir="C:\temp\chrome-test-profile" ^
  --disable-web-security ^
  --disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure ^
  --allow-insecure-localhost ^
  --ignore-certificate-errors ^
  http://localhost:3000

echo.
echo ✅ Chrome launched with test flags!
echo 🌐 Opening http://localhost:3000
echo 🔗 API calls will go to https://unifyn.ai/api
echo.
echo ⚠️  WARNING: This Chrome instance has disabled security features!
echo    Only use for testing. Close it when done.
echo.
echo 📋 To test:
echo    1. Login with production credentials
echo    2. Go to /trade page
echo    3. Open DevTools (F12) - Network tab
echo    4. Test broker integration
echo.
pause

