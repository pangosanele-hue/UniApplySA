# UniApply SA — Build Instructions
## How to turn this into an APK (Android app)

### What you need on your PC
1. **Node.js** (v18+) → https://nodejs.org
2. **Android Studio** → https://developer.android.com/studio
3. **Java JDK 17** (comes with Android Studio)

---

## STEP 1: Install dependencies
Open a terminal/command prompt inside the `UniApplySA` folder:
```bash
npm install
npx cap init UniApplySA za.uniapply.app --web-dir dist
```

## STEP 2: Build the web app
```bash
npm run build
```

## STEP 3: Add Android platform
```bash
npx cap add android
npx cap sync android
```

## STEP 4: Open in Android Studio
```bash
npx cap open android
```
Android Studio will open. Wait for it to finish syncing (Gradle).

## STEP 5: Build the APK
In Android Studio:
- Go to **Build → Build Bundle(s) / APK(s) → Build APK(s)**
- Wait for the build to finish
- Click **"locate"** when done → your APK is ready!

## STEP 6: Install on your phone
Option A — USB:
- Connect phone via USB, enable USB Debugging
- In Android Studio: **Run → Run 'app'**

Option B — Transfer file:
- Copy the APK to your phone
- On your phone: Settings → Install unknown apps → Allow
- Tap the APK file to install

---

## App details
- App ID: `za.uniapply.app`
- Min Android: 5.1 (API 22)
- Target: Android 14 (API 34)

## Troubleshooting
- **Gradle sync failed** → File → Invalidate Caches → Restart
- **SDK not found** → Android Studio → SDK Manager → Install Android 14
- **Build failed** → Make sure JDK 17 is selected in File → Project Structure → SDK Location
