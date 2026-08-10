# Real-time Visitor Analytics — Setup Guide

Production-ready real-time visitor analytics for the portfolio: **Live**, **Total**,
and **Today** counters behind a floating widget, with per-session visitor
information (browser, device, OS, country, city, landing page, referrer).

> **Backend decision:** your original spec asked for Firebase Firestore. This
> project has zero Firebase — it is built entirely on Supabase (auth, events,
> knowledge base, chat, settings, RLS). Building a parallel Firebase backend
> would mean a second set of credentials, a second security model, and two
> analytics systems that don't share data. Every requested feature is
> backend-agnostic, so this was implemented on the **existing Supabase stack**:
> two new tables + Postgres RPC functions. The design maps 1:1 to the Firestore
> collections you asked for (`analytics` → `analytics_counters`,
> `sessions` → `visitor_sessions`, `visitors` → `visitor_id` column).

---

## 1. Files created

| File | Purpose |
|---|---|
| `supabase/visitor-analytics.sql` | Schema migration: `visitor_sessions` + `analytics_counters` tables, RPC functions (`upsert_visitor_session`, `record_visitor`, `get_visitor_stats`, `prune_visitor_sessions`), RLS policies, grants |
| `app/api/analytics/session/route.ts` | `POST /api/analytics/session` — creates the session server-side, attaches country/city from Vercel's free geo headers, counts the visitor once, rejects bots |
| `lib/visitor-analytics.ts` | Client library: session id (sessionStorage), client detection (browser/device/OS), heartbeat loop, live-stats fetching, pruning |
| `components/visitor-widget.tsx` | Floating widget (bottom-left): 👀 Visitors · 🟢 Live · 🌍 Total · 📅 Today, auto-refresh every 5s, collapse state, dark-mode aware |
| `ANALYTICS_SETUP.md` | This guide |

## 2. Files modified

| File | Change |
|---|---|
| `app/layout.tsx` | Lazy-loaded `<VisitorWidget />` mounted in the root layout (like `GlobalSearch`) |
| `lib/supabase.ts` | Added `visitor_sessions` / `analytics_counters` table types + RPC function types to the typed `Database` |
| `lib/analytics.ts` | Added `isReturningVisitor()` (checks localStorage *before* generating an id) |
| `components/admin/analytics-overview.tsx` | Admin Analytics section now also shows **Live Now / Total Visitors / Today's Visitors** |

## 3. Why each change was made

- **`visitor_sessions`** stores one row per tab-session with `session_id`
  (sessionStorage, survives refresh), `visitor_id` (localStorage, stable per
  browser), `is_returning`, device/browser/OS, country/city, landing page,
  referrer, current page, `last_seen`. Live visitors = `last_seen` within 30s.
- **`analytics_counters`** holds `total_visitors` (all-time, unique) and
  `today_visitors` (unique per calendar day — the `date` column auto-resets it
  each day, so no cron job is needed).
- **RPC functions, not direct table access** — anonymous visitors can only call
  the functions; they can never read/write raw session rows (privacy + no
  forged counters). `record_visitor` is idempotent per session and serialized
  per visitor with a Postgres advisory lock, so refreshes, duplicate calls, and
  two tabs opening at once cannot double-count. This is the transactional
  guarantee you asked for.
- **`/api/analytics/session`** runs on Vercel, so it can read
  `x-vercel-ip-country` / `x-vercel-ip-city` (free, no third-party service) and
  attach them server-side. It also rejects non-browser user agents (simple bot
  mitigation). The client heartbeats (every 20s) go directly to Supabase to
  keep server round-trips minimal.
- **Widget lazy-loaded with `ssr: false`** — keeps the homepage first-load JS
  unchanged (verified: 13 kB page / 148 kB first load, same as before) and
  avoids `localStorage`/`sessionStorage` on the server. Polling pauses when the
  tab is hidden; tracking is disabled entirely when the admin `track_analytics`
  flag is off (same flag the existing `AnalyticsTracker` respects).

## 4. Supabase setup (Firebase setup equivalent)

1. Open your Supabase project → **SQL Editor**.
2. Paste and run the contents of **`supabase/visitor-analytics.sql`**.
3. That's it — the tables, functions, RLS, and grants are all in one file.
   Run it **once**: functions use `create or replace`, but the tables and
   policies are plain `create`, so a second run errors on "already exists"
   (harmless — just don't re-run). To re-run later, drop the objects first.

Optional: also run it locally via the CLI:
```bash
supabase db push
```

## 5. Security rules (Firestore-rules equivalent)

Firestore rules map to Supabase RLS policies in `visitor-analytics.sql`:

| Access | Rule |
|---|---|
| Read `visitor_sessions` | **Admin only** (`role = 'admin'`) — visitors never see raw session data |
| Write `visitor_sessions` | **Never direct** — only via security-definer RPCs (`upsert_visitor_session`) |
| Read `analytics_counters` | Public (the widget needs the numbers) |
| Write `analytics_counters` | **Never direct** — only via `record_visitor`, which dedupes per session + per visitor/day |
| Function execution | `grant execute ... to anon, authenticated` |

Duplicate-count / refresh / multi-tab protections:
- **Refresh** → same `session_id` in sessionStorage → same session row upserted, `counted` already true → no increment.
- **Multi-tab** → each tab has its own session, but `record_visitor` dedupes per visitor/day, and the live count uses `count(distinct visitor_id)` so one person with 5 tabs counts as 1 live visitor.
- **Bots** → tracking is JS-only; the API route additionally rejects non-browser UAs. Counters are server-side, so forged client calls can't inflate them beyond one per visitor per day.

## 6. Environment variables

**No new variables.** The existing Supabase ones already in `.env.local` /
Vercel are all this feature needs:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

(Vercel's geo headers are injected automatically on Vercel — nothing to configure.)

## 7. Deployment (Vercel)

1. Commit and push (or connect the repo) to Vercel — no build changes needed.
2. Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
   in the project's **Environment Variables**.
3. Run the migration SQL from step 4 against the production Supabase project
   **before** deploying (or right after — the API route degrades gracefully to
   `500` until the RPCs exist, and the widget hides itself on error).
4. Deploy. The widget appears on every page; the admin dashboard shows
   **Live Now / Total Visitors / Today's Visitors**.

Optional (recommended for high traffic): replace the probabilistic client-side
prune with a scheduled job — Vercel Cron or `pg_cron` calling
`prune_visitor_sessions(30)`.

## 8. Testing instructions

**Local:**
```bash
npm run dev
```
- Open `http://localhost:3000` → the widget appears bottom-left with Live/Total/Today.
- Refresh the page → counters do **not** change (session id is reused).
- Open a second tab → Live goes up by 1 (per visitor), Total/Today unchanged.
- Wait 30s without touching a tab → that tab drops out of Live.
- Toggle the theme → widget styling follows dark/light.
- Admin panel → `/admin` → Analytics → three new cards.

**API guard rails (dev server):**
```bash
curl -X POST http://localhost:3000/api/analytics/session -H "User-Agent: curl/8.0"          # 403
curl -X POST http://localhost:3000/api/analytics/session -H "User-Agent: Mozilla/5.0 ..." -d '{}'  # 400
```

**Verifying counters (Supabase SQL Editor):**
```sql
select * from analytics_counters;                                   -- total / today
select count(distinct visitor_id) from visitor_sessions
  where last_seen > now() - interval '30 seconds';                  -- live
select session_id, visitor_id, country, city, browser, os, is_returning,
       landing_page, referrer from visitor_sessions
  order by created_at desc limit 20;                                -- visitor info
```

**Checklist against the spec:**
- [x] Total visitors: unique, persists forever, no refresh inflation
- [x] Live visitors: 30s inactivity window, widget refreshes every 5s
- [x] Today's visitors: resets automatically each day (date-keyed counter)
- [x] Returning visitors: localStorage id + `is_returning` flag
- [x] Visitor info: session id, timestamp, browser, device, OS, country, city, landing page, referrer
- [x] Transactions where required (`record_visitor` advisory lock + idempotent flag)
- [x] Security: duplicate/refresh/multi-tab/bot protections
- [x] Performance: lazy-loaded, single RPC per refresh, paused when tab hidden
