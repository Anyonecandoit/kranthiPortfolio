import { NextRequest } from "next/server";
import { getServiceClient, bearerToken } from "@/lib/supabase-admin";

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

/**
 * Device push-token registration (Firebase Cloud Messaging).
 *
 * Body: { token: string, platform: "android" | "ios", topics?: string[] }
 *
 * Stores/upserts the device token in the `device_tokens` table. When the
 * request carries a Supabase session token, the device is linked to that user.
 * Called from the mobile app on first launch and whenever FCM refreshes the
 * token. Requires the `device_tokens` table — see MOBILE_APP.md.
 */
export async function POST(req: NextRequest) {
  let body: { token?: string; platform?: string; topics?: string[] };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const token = body.token?.trim();
  if (!token) return json({ error: "token is required." }, 400);
  const platform =
    body.platform === "ios"
      ? ("ios" as const)
      : body.platform === "android"
        ? ("android" as const)
        : null;
  if (!platform) {
    return json({ error: "platform must be 'android' or 'ios'." }, 400);
  }

  // Optional: link to the signed-in Supabase user.
  const auth = bearerToken(req.headers.get("authorization"));
  let userId: string | null = null;
  if (auth) {
    try {
      const service = getServiceClient();
      const { data, error } = await service.auth.getUser(auth);
      if (!error && data.user) userId = data.user.id;
    } catch {
      /* token invalid — register anonymously */
    }
  }

  try {
    const service = getServiceClient();
    const { error } = await service.from("device_tokens").upsert(
      {
        token,
        platform,
        user_id: userId,
        topics: body.topics ?? [],
        last_seen: new Date().toISOString(),
      },
      { onConflict: "token" }
    );
    if (error) {
      console.error("[notifications] upsert failed", error.message);
      return json({ error: "Failed to store device token." }, 500);
    }
    return json({ ok: true }, 200);
  } catch (e) {
    console.error("[notifications] registration failed", e);
    return json({ error: "Service unavailable." }, 500);
  }
}
