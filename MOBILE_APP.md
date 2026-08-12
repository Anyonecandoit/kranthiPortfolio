# Kranthi Portfolio — Mobile App (Android & iOS)

The website is packaged as a real, installable mobile app with **Capacitor**
(https://capacitorjs.com). One codebase → native app shells for **both** Android
and iOS; all the web UI, chat, TTS, tools, and admin panels are reused as-is.

## How it works

- The Next.js app is built as a **static export** (`out/`) and bundled *inside*
  the app — the app loads instantly and the portfolio pages work offline.
- The server-only pieces (`app/api/*` + the Supabase auth callback) cannot exist
  in a static export, so `scripts/build-mobile.sh` moves them aside for the
  build and restores them afterwards. They still run on the deployed site.
- All client-side `fetch()` calls go through `lib/api.ts`. In the app build they
  point at the deployed backend (`https://www.kranthikumarkatta.in`) via
  `NEXT_PUBLIC_API_URL`; on the web the base is empty (same-origin), so nothing
  changes for the live site.
- The deployed `/api/*` routes now send CORS headers (see `next.config.js`) so
  the app's WebView origin (`https://localhost` / `capacitor://localhost`) may
  call them.

## Prerequisites (not yet installed on this machine)

| Tool | Why | Install |
|---|---|---|
| Node ≥ 18 | already present (v22) | — |
| **Android Studio** | Gradle build + Android SDK for the APK | https://developer.android.com/studio |
| **Xcode** (macOS only) | iOS simulator/device builds | Mac App Store |

You do **not** need Android Studio/Xcode to *scaffold* — the `android/` and
`ios/` folders are already generated.

> ⚠️ **Before testing the app, redeploy the website** (Vercel) after pulling
> these changes — the CORS headers live in `next.config.js` and only take effect
> once deployed. Without them the app's AI/analytics calls are blocked.

## Quick start

```bash
npm install          # if not done already
npm run build:app    # static export + copy web assets into android/ and ios/
```

Then open the native project and run it:

```bash
npm run cap:open:android   # opens Android Studio → Run ▶ (device or emulator)
npm run cap:open:ios       # opens Xcode → set your signing team → Run
```

### Build a standalone Android APK (no IDE needed)

```bash
npm run build:app
cd android && ./gradlew assembleDebug
# APK: android/app/build/outputs/apk/debug/app-debug.apk
```

Install on a phone via `adb install app-debug.apk` (enable USB debugging), or
just drag the APK onto the device / share it.

## Development workflow (live reload)

During development it's much faster to point the app at a running dev server
instead of rebuilding the static export each time:

1. Start the site: `npm run dev` (it listens on `http://localhost:3000`).
2. Point the app at it by setting the server URL in `capacitor.config.ts`:
   ```ts
   server: { url: "http://192.168.1.23:3000" }   // your machine's LAN IP
   ```
3. `npx cap sync && npx cap run android` (or open in Xcode for iOS).

Because the app then loads from the dev server, API calls stay same-origin and
hot-reload works. **Remove the `server.url` and re-run `npm run build:app`
before shipping** so the app bundles the site again.

## Icons & splash screen

Branded icon + splash are generated from `assets/` (violet gradient + "K"
monogram). To change the branding: replace the PNGs in `assets/` (icon-only =
1024×1024, splash = 2732×2732) or tweak `scripts/generate-app-assets.mjs`, then:

```bash
npm run assets   # regenerates every platform size + copies into android/ & ios/
```

## Publishing

### Play Store (Android)

1. `cd android && ./gradlew assembleRelease`
2. Generate a signing key once:
   `keytool -genkey -v -keystore upload-keystore.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000`
3. Create `android/keystore.properties` with `storeFile`, `storePassword`,
   `keyAlias`, `keyPassword`, then `./gradlew bundleRelease` → `.aab` file.
4. Upload the `.aab` to https://play.google.com/console → **Create app**.

### App Store (iOS)

1. In Xcode: set the **Team** (Signing & Capabilities) and a unique bundle id.
2. Product → **Archive** → **Distribute App** → App Store Connect.
3. Fill in metadata at https://appstoreconnect.apple.com.

## Known limitations

- **Voice input** (Web Speech API) is not available inside Android/iOS WebViews,
  so the mic button won't appear in the app. **Reading replies aloud** (cloud
  TTS) and text chat work fine.
- All AI features need internet. Static content (portfolio pages) works offline.
- Email/password login works fully in-app. OAuth (Google, if configured)
  redirects through the deployed site (`/auth/callback`) — the app returns to
  itself afterwards.
- App stores review apps, not wrappers. The app bundles real functionality
  (portfolio, AI chat, tools, notes), which satisfies "more than a bookmark",
  but plan for a review round.

## Project layout

```
capacitor.config.ts          # app id/name, webDir
scripts/build-mobile.sh      # static export + cap sync (moves/restores app/api)
scripts/generate-app-assets.mjs  # icon/splash generation
lib/api.ts                   # API base URL for the bundled app
lib/api-types.ts             # shared response types (safe for static builds)
assets/                      # icon/splash source PNGs
android/                     # generated Android project (regenerate: npx cap add android)
ios/                         # generated iOS project (regenerate: npx cap add ios)
out/                         # static export (gitignored)
```

## Push notifications (Firebase Cloud Messaging)

The app ships with full FCM client code (`lib/push.ts`, `components/push-service.tsx`,
`components/push-toast.tsx`): permission flow, token registration + refresh,
foreground in-app banners, notification-tap navigation, backend token sync, and
topic subscriptions. **No Firebase project exists yet — you must create one and
add two files before notifications work.** The Android build stays green either
way (the `google-services` gradle plugin is applied conditionally).

### Manual steps (once)

1. Create a Firebase project: https://console.firebase.google.com
   - **Android app**: package `in.kranthikumarkatta.portfolio` → download
     `google-services.json` → place it at `android/app/google-services.json`.
   - **iOS app**: bundle id `in.kranthikumarkatta.portfolio` → download
     `GoogleService-Info.plist` → place it at `ios/App/App/GoogleService-Info.plist`
     (add it to the Xcode project, target membership: App).
2. iOS only: upload an **APNs key** to Firebase (Cloud Messaging → Apple app
   configuration) and enable the Push Notifications capability in Xcode.
3. Create the Supabase table (SQL editor):

```sql
create table if not exists public.device_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  token text unique not null,
  platform text not null check (platform in ('android','ios')),
  topics text[] not null default '{}',
  last_seen timestamptz not null default now(),
  created_at timestamptz not null default now()
);
alter table public.device_tokens enable row level security;
-- Admins read all tokens; anonymous users can insert their own device token.
create policy "device_tokens insert" on public.device_tokens for insert with check (true);
create policy "device_tokens select" on public.device_tokens for select using (
  auth.uid() = user_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);
```

4. Rebuild the app (`npm run build:app`). Tokens self-register on first launch
   and are stored in `device_tokens` via `POST /api/notifications/register`.
5. Send a test notification: in the Firebase console → Cloud Messaging → send a
test message to the registered token, or use `admin.messaging().send()` from a
server script with the service-account key.

Topic subscriptions are stored per device (`topics` column) and sent to the
backend on registration; a server job can target devices by topic directly.

## Offline support

The app is fully offline-capable for its static content: the site is bundled
inside the app, so every page renders without a connection. On top of that:

- `lib/offline.ts` + `lib/use-network-status.ts` detect connectivity via
  `@capacitor/network` (native) / browser events (web) and drive a persistent
  **retry queue**. Fire-and-forget API calls (analytics sessions) made while
  offline are stored and replayed automatically when the connection returns
  (also on app foreground, and every 60 s while online).
- Interactive API calls get a friendly “You're offline” message instead of a
  cryptic network error (all call sites use `apiFetch`).
- `components/offline-banner.tsx` shows an Offline pill and a “Back online”
  confirmation.
- The web/PWA version gets a **service worker** (`public/sw.js`, registered by
  `components/service-worker-register.tsx`): network-first for pages (keeps
  SEO-safe fresh HTML), stale-while-revalidate for hashed JS/CSS/fonts/images,
  and a cached offline homepage as fallback. It is intentionally *not*
  registered inside the native app (the app bundles its own assets, and WebView
  service workers are unreliable).

## Security

- **Session timeout** — authenticated sessions end after 60 minutes of
  inactivity (configurable at runtime via `setSessionTimeoutMinutes()`); the
  timer also covers time spent backgrounded.
- **Secure storage** — `lib/security.ts` stores sensitive values (e.g. the
  biometric-unlock flag) in the iOS Keychain / Android Keystore-backed
  EncryptedSharedPreferences with a localStorage fallback on the web.
- **Biometric unlock** — after signing in, the auth page offers “Unlock with
  Face ID / fingerprint”. When enabled, the app re-verifies biometrics every
  time it returns to the foreground and signs out on failure. Needs
  `NSFaceIDUsageDescription` (already in the iOS plist).
- **Root / jailbreak detection** — best-effort scan for known root/jailbreak
  apps at startup; a `security:compromised` event is dispatched (no blocking).
- **Certificate pinning** — not possible through web `fetch`. On Android it
  can be layered on with a `network_security_config` (Vercel doesn’t expose
  the CA chain, so pin only if you self-host the backend).
- **Screenshot protection** — iOS exposes no API; on Android it requires
  `FLAG_SECURE`, which conflicts with the WebView; not enabled.

## Performance

- The chat + voice widgets are split out of the initial bundle (dynamic
  imports in `app/layout.tsx`) so they load after first paint instead of
  blocking it. The search modal and visitor widget were already deferred.
- The splash hides on first paint (`markAppReady` in `lib/perf.ts`), so the
  perceived cold start is the time to the first meaningful frame — measured
  and logged as `__KRANTHI_COLD_START_MS` on native (target < 2 s).
- The whole app is a static export with hashed assets, so the WebView serves
  everything from the local bundle — no network round-trips for JS/CSS/fonts.
- API calls are only made on demand; the SW (web) never caches API responses.

## Firebase Analytics (optional)

The app can report analytics to Firebase alongside the existing Supabase
analytics. Everything is env-gated — without config, zero Firebase code is
bundled.

1. In Firebase console → Project settings → *Your apps* → Web app, copy the
   config values into your Vercel environment (and `.env.local` for local
   builds): `NEXT_PUBLIC_FIREBASE_API_KEY`, `_AUTH_DOMAIN`, `_PROJECT_ID`,
   `_APP_ID`, `_MESSAGING_SENDER_ID`, `_STORAGE_BUCKET`.
2. Redeploy. Every existing event now also flows to Firebase Analytics
   (`lib/analytics.ts` mirrors them), screen views are auto-tracked, and
   uncaught errors report as `app_error` (`components/error-tracker.tsx`).
3. Remote Config is available via `firebaseRemoteConfigValue()` in
   `lib/analytics-firebase.ts`.

**Crashlytics / Performance Monitoring** need the *native* Firebase SDKs. If
you add `google-services.json`/`GoogleService-Info.plist` for push
notifications, you can also add `@capacitor-firebase/crashlytics` and
`@capacitor-firebase/performance` and follow their setup docs — they are
intentionally not pre-installed so builds keep working without the Firebase
project.

## Troubleshooting

- **`app/api` missing after a failed build** — the script restores it on exit;
  if a build was killed, run `npm run build:app` again (it recovers leftovers)
  or `mv .mobile-build/api.bak app/api`.
- **App calls fail with CORS errors** — the site hasn't been redeployed with the
  new `next.config.js` headers yet. Redeploy and retry.
- **`npx cap sync` can't find `out/`** — run `npm run build:app` first.
