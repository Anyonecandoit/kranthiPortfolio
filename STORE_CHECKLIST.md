# Store Publishing Checklist — Kranthi Kumar Katta

Everything code-side is done (icons, splash, privacy manifest, store graphics).
What remains is account/signing setup and store-listing metadata. Work through
one section per store.

Assets you already have:

| Asset | Location |
|---|---|
| App icons (all densities, adaptive + iOS) | `android/…/mipmap-*`, `ios/App/App/Assets.xcassets/AppIcon.appiconset` |
| Splash (light + dark, all sizes) | `android/…/drawable*`, `ios/…/Splash.imageset` |
| Feature graphic (1024×500) | `assets/store/feature-graphic.png` |
| Screenshot placeholders (1080×1920 ×3) | `assets/store/screenshot-1..3.png` |
| iOS privacy manifest | `ios/App/App/PrivacyInfo.xcprivacy` |

Regenerate any asset with `npm run assets`.

---

## Play Store (Android)

1. **Create the app**
   - Play Console → Create app → name **Kranthi Kumar Katta**, default language
     English, app type *App*, free, declare ads: **No**.
2. **Production signing (one time)**
   ```bash
   keytool -genkey -v -keystore android/upload-keystore.jks \
     -alias upload -keyalg RSA -keysize 2048 -validity 10000
   ```
   Create `android/keystore.properties`:
   ```
   storeFile=upload-keystore.jks
   storePassword=<password>
   keyAlias=upload
   keyPassword=<password>
   ```
   (File is gitignored — never commit it. Back it up: Play won’t recover it.)
3. **Build the release bundle**
   ```bash
   npm run build:app
   cd android && ./gradlew bundleRelease
   # → android/app/build/outputs/bundle/release/app-release.aab
   ```
4. **Upload** the `.aab` to Play Console → Release → Production → upload.
5. **Store listing**
   - Short description (~80 chars): “AI-powered portfolio of Kranthi Kumar
     Katta — Senior SDET & Test Automation Expert.”
   - Full description: features + the bundled tools/chat/notes.
   - Graphic assets: use `assets/store/feature-graphic.png` (Play Store listing
     graphic) + `assets/store/screenshot-*.png` (replace with real device
     screenshots before launch — placeholders are fine for a closed test).
   - Category: *Productivity* or *Developer Tools*.
6. **Data safety form** (Play Console → Policy → App content → Data safety):
   - **No** data shared.
   - **Collected:** Email address, User ID, Device ID, App interactions,
     Crash/Performance diagnostics (all optional, analytics).
   - Encryption in transit: **Yes** (all traffic is HTTPS).
7. **Testing:** Run an open/closed test track with the APK/AAB first — Play
   requires ~12 testers / 14 days for the “personal use” exemption; otherwise
   full policy review applies.

## App Store (iOS)

1. **Accounts**: Apple Developer Program ($99/yr). Create an **App ID**
   (`in.kranthikumarkatta.portfolio`) with Push Notifications capability.
2. **Signing in Xcode**: open `ios/App/App.xcodeproj` → Signing & Capabilities →
   select your Team, set a unique bundle id if needed, check *Push
   Notifications*.
3. **Archive & upload**: Product → Archive → Distribute App → App Store Connect.
   - **Add `PrivacyInfo.xcprivacy` to the target** (one-time, in Xcode): drag
     `ios/App/App/PrivacyInfo.xcprivacy` into the App target’s *Copy Bundle
     Resources* phase and tick the App target in the file inspector. Xcode
     also offers a built-in Privacy Manifest editor (right-click the file).
4. **App Store Connect**: create the app, set `in.kranthikumarkatta.portfolio`,
   fill metadata (description, keywords, category, support URL = your site).
5. **Privacy** — Apple requires all of these; the manifest is already in the
   build:
   - `PrivacyInfo.xcprivacy` is included (`ios/App/App/PrivacyInfo.xcprivacy`).
   - App Privacy “nutrition label” in App Store Connect: email, user ID,
     device ID, product interaction, crash + performance data (see the
     manifest — keep them in sync).
6. **Screenshots**: 6.7″ + 6.5″ required; use the placeholders from
   `assets/store/` and replace with real device captures before release.
7. **Review notes**: mention it’s a personal portfolio app with AI features and
   email/password login; provide a demo account if you gate any area.
8. **Push**: after adding `GoogleService-Info.plist` (see MOBILE_APP.md), upload
   the APNs key in Firebase; if you skip push, you may still submit without it.

## Pre-submission checks (both stores)

- [ ] `npm run build:app` runs clean and `android/` + `ios/` are synced
- [ ] Website redeployed with the new CORS headers (mobile API calls work)
- [ ] Real-device smoke test: home, chat, tools, notes, auth, theme toggle,
      back button, offline banner
- [ ] Replace placeholder screenshots with real captures
- [ ] Privacy statements match the manifest / data-safety form
- [ ] Version number bumped (`android/app/build.gradle` versionCode/versionName
      and iOS Xcode CURRENT_PROJECT_VERSION/MARKETING_VERSION)
