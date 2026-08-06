import { NextRequest } from "next/server";
import { randomUUID, createHash } from "crypto";
import { WebSocket } from "ws";

/**
 * Cloud text-to-speech via Microsoft Edge's consumer speech service —
 * keyless, free, natural neural voices. Implements the same WebSocket
 * protocol as the open-source `edge-tts` tool (incl. the Sec-MS-GEC
 * signature Microsoft requires). Returns audio/mpeg.
 *
 * The client splits long replies into chunks and falls back to the
 * browser's speechSynthesis if this ever fails.
 */

const WSS_URL =
  "wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1";
const TRUSTED_CLIENT_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
const SEC_MS_GEC_VERSION = "1-143.0.3650.75";
const WIN_EPOCH = 11644473600; // seconds between Unix epoch and Windows file time
const OUTPUT_FORMAT = "audio-24khz-48kbitrate-mono-mp3";

const VOICES: Record<string, string> = {
  "en-US-JennyNeural": "Female · US (natural)",
  "en-US-GuyNeural": "Male · US (natural)",
  "en-IN-NeerjaNeural": "Female · Indian English",
  "en-IN-PrabhatNeural": "Male · Indian English",
  "en-GB-SoniaNeural": "Female · British",
  "en-AU-NatashaNeural": "Female · Australian",
};

const DEFAULT_VOICE = "en-US-JennyNeural";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Time-based HMAC signature Microsoft requires in the connection URL. */
function generateSecMsGec(): string {
  const ticks = (Date.now() / 1000 + WIN_EPOCH) * 1e7; // 100-ns units
  const rounded = Math.floor(ticks / (5 * 60 * 1e7)) * (5 * 60 * 1e7); // 5-min window
  const message = `${Math.round(rounded)}${TRUSTED_CLIENT_TOKEN}`;
  return createHash("sha256").update(message, "ascii").digest("hex").toUpperCase();
}

/** Make text speakable: strip markdown, collapse whitespace, cap length. */
function toSpeechText(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, "Code block omitted. ")
    .replace(/[*#`>_~|]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 2000);
}

function buildSpeechConfig(): string {
  return (
    `X-Timestamp:${new Date().toUTCString()}\r\n` +
    `Content-Type:application/json; charset=utf-8\r\n` +
    `Path:speech.config\r\n\r\n` +
    JSON.stringify({
      context: {
        synthesis: {
          audio: {
            metadataoptions: {
              sentenceBoundaryEnabled: "false",
              wordBoundaryEnabled: "false",
            },
            outputFormat: OUTPUT_FORMAT,
          },
        },
      },
    })
  );
}

function buildSsmlMessage(text: string, voice: string): string {
  return (
    `X-RequestId:${randomUUID()}\r\n` +
    `Content-Type:application/ssml+xml\r\n` +
    `X-Timestamp:${new Date().toUTCString()}\r\n` +
    `Path:ssml\r\n\r\n` +
    `<speak version='1.0' xml:lang='en-US'>` +
    `<voice name='${voice}'><prosody pitch='+0Hz' rate='+0%' volume='+0%'>${escapeXml(text)}</prosody></voice>` +
    `</speak>`
  );
}

function synthesize(text: string, voice: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const connectionId = randomUUID();
    const ws = new WebSocket(
      `${WSS_URL}?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}&ConnectionId=${connectionId}` +
        `&Sec-MS-GEC=${generateSecMsGec()}&Sec-MS-GEC-Version=${SEC_MS_GEC_VERSION}`,
      {
        headers: {
          Pragma: "no-cache",
          "Cache-Control": "no-cache",
          Origin: "chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0",
          "Accept-Encoding": "gzip, deflate, br, zstd",
          "Accept-Language": "en-US,en;q=0.9",
        },
      }
    );
    ws.binaryType = "nodebuffer";

    const chunks: Buffer[] = [];
    let settled = false;

    const finish = (err?: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try {
        ws.close();
      } catch {
        /* ignore */
      }
      if (err) reject(err);
      else if (!chunks.length) reject(new Error("No audio received"));
      else resolve(Buffer.concat(chunks));
    };

    // Safety timeout so a stalled connection never hangs the request.
    const timer = setTimeout(() => finish(new Error("TTS timeout")), 15000);

    ws.on("open", () => {
      ws.send(buildSpeechConfig());
      ws.send(buildSsmlMessage(text, voice));
    });

    ws.on("message", (data, isBinary) => {
      if (!isBinary) {
        if (data.toString().includes("Path:turn.end")) finish();
        return;
      }
      let frame = data as Buffer;
      // Edge prefixes each audio frame with an ASCII header block
      // ([len]X-RequestId:..\r\nContent-Type:..\r\nPath:audio\r\n). If left
      // in, the MP3 is undecodable in browsers. Find the first MP3 frame
      // sync word (0xFF + 0xE0..0xFF) and keep the audio from there.
      for (let i = 0; i < Math.min(frame.length - 1, 700); i++) {
        if (frame[i] === 0xff && (frame[i + 1] & 0xe0) === 0xe0) {
          if (i > 0) frame = frame.subarray(i);
          break;
        }
      }
      if (frame.length) chunks.push(frame);
    });

    ws.on("error", () => finish(new Error("TTS websocket error")));
    ws.on("close", () => finish());
  });
}

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const requestedVoice = String(body?.voice ?? DEFAULT_VOICE);
  const voice = VOICES[requestedVoice] ? requestedVoice : DEFAULT_VOICE;
  const text = toSpeechText(String(body?.text ?? ""));
  if (!text) return json({ error: "Nothing to speak." }, 400);

  try {
    const audio = await synthesize(text, voice);
    return new Response(new Uint8Array(audio), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
        "X-Voice": voice,
      },
    });
  } catch (err) {
    console.error("[tts] Edge synthesis failed:", err);
    return json({ error: "TTS synthesis failed." }, 502);
  }
}
