# APK downloads

The navbar's **GET APK** button downloads `kranthi-portfolio.apk` from this
folder (served by Next/Vercel at `/apk/kranthi-portfolio.apk`).

The `.apk` binary itself is **not committed to git** (it's a build artifact).
To publish a new build:

```bash
cd android && ./gradlew assembleDebug   # needs Android Studio / Android SDK
cd ..
npm run copy:apk                         # copies the APK into this folder
git add public/apk && git commit         # then deploy to Vercel as usual
```

The button automatically shows a friendly hint (instead of a 404) until the
file is present. For production releases, prefer a signed release build — see
`STORE_CHECKLIST.md`.
