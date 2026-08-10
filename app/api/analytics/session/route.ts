import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

/**
 * POST /api/analytics/session
 *
 * Creates (or heartbeats) a visitor session server-side. Runs on Vercel so it
 * can attach country/city from Vercel's free geo headers (x-vercel-ip-country,
 * x-vercel-ip-city) that the browser never sees.
 *
 * Counting happens inside `upsert_visitor_session` (it calls the idempotent
 * `record_visitor` for any uncounted session), so a session is counted exactly
 * once no matter how often this route — or a client heartbeat — touches it.
 */
const BOT_UA =
  /bot|crawl|spider|slurp|curl|wget|python-|node-fetch|headless|pingdom|uptimerobot|monitor|scrape/i;

export async function POST(req: Request) {
  // Simple bot mitigation: tracking is JS-only, and we additionally reject
  // requests that don't look like a real browser.
  const ua = req.headers.get("user-agent") ?? "";
  if (!ua || BOT_UA.test(ua)) {
    return NextResponse.json({ ok: false, error: "not allowed" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }

  const sessionId = typeof body.sessionId === "string" ? body.sessionId : "";
  const visitorId = typeof body.visitorId === "string" ? body.visitorId : "";
  if (!sessionId || !visitorId || sessionId.length > 128 || visitorId.length > 128) {
    return NextResponse.json({ ok: false, error: "missing ids" }, { status: 400 });
  }

  const str = (v: unknown, max = 256): string | null => {
    if (typeof v !== "string" || !v.trim()) return null;
    return v.trim().slice(0, max);
  };

  try {
    const db = getSupabase();
    const { error: upsertError } = await db.rpc("upsert_visitor_session", {
      p_session_id: sessionId,
      p_visitor_id: visitorId,
      p_is_returning: body.isReturning === true,
      p_browser: str(body.browser),
      p_device: str(body.device),
      p_os: str(body.os),
      // Vercel geo headers — absent in local dev, so country/city stay null.
      p_country: str(req.headers.get("x-vercel-ip-country")),
      p_city: str(req.headers.get("x-vercel-ip-city")),
      p_landing_page: str(body.landingPage),
      p_referrer: str(body.referrer),
      p_page_path: str(body.pagePath),
    });
    if (upsertError) throw upsertError;

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "tracking failed" }, { status: 500 });
  }
}
