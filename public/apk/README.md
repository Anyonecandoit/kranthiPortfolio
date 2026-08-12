# APK downloads

The navbar's **GET APK** button downloads `kranthi-portfolio.apk` from this
folder (served by Next/Vercel at `/apk/kranthi-portfolio.apk`).

## Publish a new build

```bash
cd android && ./gradlew assembleDebug   # needs Android Studio / Android SDK
cd ..
npm run copy:apk                         # copies the APK into this folder
git add public/apk && git commit && git push   # deploy to Vercel as usual
```

The button shows a friendly hint (instead of a 404) until the file is present,
so the site can be deployed at any time — even before the first APK build.

For production releases, prefer a signed release build — see
`STORE_CHECKLIST.md`.
