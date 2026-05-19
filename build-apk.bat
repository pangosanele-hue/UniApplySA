@echo off
echo =============================================
echo  UniApply SA - APK Builder
echo =============================================
echo.

echo [1/4] Installing dependencies...
call npm install
if errorlevel 1 goto error

echo [2/4] Building web app...
call npm run build
if errorlevel 1 goto error

echo [3/4] Syncing with Capacitor Android...
call npx cap sync android
if errorlevel 1 (
  echo Adding Android platform first...
  call npx cap add android
  call npx cap sync android
)

echo [4/4] Opening Android Studio...
echo.
echo =============================================
echo  When Android Studio opens:
echo  1. Wait for Gradle sync to finish
echo  2. Build ^> Build APK(s)
echo  3. Click Locate to find your APK
echo =============================================
echo.
call npx cap open android
goto end

:error
echo.
echo BUILD FAILED. Check error above.
echo Make sure Node.js is installed: https://nodejs.org
pause
exit /b 1

:end
pause
