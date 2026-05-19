#!/bin/bash
echo "============================================="
echo " UniApply SA - APK Builder"
echo "============================================="
echo ""

echo "[1/4] Installing dependencies..."
npm install || { echo "npm install failed. Is Node.js installed?"; exit 1; }

echo "[2/4] Building web app..."
npm run build || { echo "Build failed"; exit 1; }

echo "[3/4] Syncing with Capacitor Android..."
npx cap sync android 2>/dev/null || {
  echo "Adding Android platform..."
  npx cap add android
  npx cap sync android
}

echo "[4/4] Opening Android Studio..."
echo ""
echo "============================================="
echo " In Android Studio:"
echo " 1. Wait for Gradle sync"
echo " 2. Build > Build APK(s)"  
echo " 3. Click Locate for your APK"
echo "============================================="
npx cap open android
