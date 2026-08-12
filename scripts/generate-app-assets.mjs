#!/usr/bin/env node
/**
 * Generates the Capacitor app icon + splash PNG sources under assets/.
 *
 * The design is a violet→navy gradient tile with a white "K" monogram built
 * from rounded strokes (pure SVG geometry — no font dependencies). Re-run
 * `npm run assets` (node scripts/generate-app-assets.mjs) then
 * `npx capacitor-assets generate` whenever you want to change the branding,
 * or simply drop your own 1024×1024 PNGs into assets/ and re-run.
 */
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const OUT = "assets";
await mkdir(OUT, { recursive: true });
await mkdir(`${OUT}/store`, { recursive: true });

const ACCENT = "#e65800"; // site accent (terracotta)
const NAVY = "#0f172a";
const NAVY_DARK = "#07070f";
const LIGHT = "#f2f0ee"; // light-theme page background

/** "K" monogram as rounded strokes. `stroke` = stroke width, `color` = stroke color. */
function kSvg(size, opts = {}) {
  const { stroke = size * 0.125, x = 0, y = 0, color = "white" } = opts;
  // Geometry kept inside the central ~50% so the mark also fits Android's
  // adaptive-icon circular mask (safe zone = central 66%).
  const cx = x + size / 2;
  const cy = y + size / 2;
  const s = stroke;
  const h = size * 0.185; // half-height of the vertical stem
  const wx = size * 0.082; // x offset of the stem from center
  const armX = size * 0.25; // horizontal reach of the diagonals
  const lines = [
    // vertical stem
    [cx - wx, cy - h, cx - wx, cy + h],
    // upper arm (slants up-right)
    [cx - wx * 0.5, cy - h * 0.72, cx + armX, cy - h * 0.92],
    // lower leg (slants down-right)
    [cx - wx * 0.5, cy + h * 0.25, cx + armX, cy + h * 0.95],
  ];
  const strokes = lines
    .map(
      ([x1, y1, x2, y2]) =>
        `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${s}" stroke-linecap="round"/>`
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${strokes}</svg>`;
}

function tileSvg(size, from, to, withK = true) {
  const gradient = `<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${from}"/>
    <stop offset="1" stop-color="${to}"/>
  </linearGradient>`;
  const k = withK ? kSvg(size) : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs>${gradient}</defs>
    <rect width="${size}" height="${size}" fill="url(#g)"/>
    ${k}
  </svg>`;
}

function splashSvg(size, bg, kColor) {
  // Solid background + centered monogram (kept modest so it reads on any screen).
  const k = kSvg(size * 0.42, { x: size * 0.29, y: size * 0.29, color: kColor });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="${bg}"/>
    ${k}
  </svg>`;
}

/* ------------------------------------------------------------------ */
/* Store marketing assets (feature graphic + screenshot placeholders)   */
/* ------------------------------------------------------------------ */

function featureGraphicSvg() {
  const w = 1024;
  const h = 500;
  const k = kSvg(300, { x: 80, y: 100, color: "white" });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="fg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${ACCENT}"/>
        <stop offset="1" stop-color="${NAVY}"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#fg)"/>
    ${k}
    <text x="470" y="220" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="bold" fill="white">Kranthi Kumar Katta</text>
    <text x="470" y="275" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#f2f0ee">AI-Powered Portfolio · SDET &amp; Test Automation</text>
    <rect x="470" y="310" width="220" height="46" rx="23" fill="white"/>
    <text x="580" y="340" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="bold" fill="${ACCENT}" text-anchor="middle">Get the app</text>
  </svg>`;
}

function screenshotSvg(index, title, subtitle) {
  const w = 1080;
  const h = 1920;
  const k = kSvg(320, { x: (w - 320) / 2, y: 360, color: "white" });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <rect width="${w}" height="${h}" fill="${LIGHT}"/>
    <!-- top nav bar -->
    <rect width="${w}" height="180" fill="white"/>
    <rect x="60" y="70" width="72" height="72" fill="${ACCENT}" rx="14"/>
    <text x="150" y="120" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="bold" fill="#202020">Kranthi Kumar Katta</text>
    <circle cx="960" cy="105" r="18" fill="#d9d6d1"/>
    <circle cx="1010" cy="105" r="18" fill="#d9d6d1"/>
    <!-- content card -->
    <rect x="60" y="260" width="960" height="820" rx="28" fill="white"/>
    <text x="120" y="350" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="bold" fill="${ACCENT}" letter-spacing="6">SCREEN ${index + 1} · PLACEHOLDER</text>
    ${k}
    <text x="540" y="900" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="bold" fill="#202020" text-anchor="middle">${title}</text>
    <text x="540" y="970" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#616060" text-anchor="middle">${subtitle}</text>
    <!-- bottom action bar -->
    <rect x="60" y="1700" width="960" height="120" rx="60" fill="${NAVY}"/>
    <text x="540" y="1772" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="bold" fill="white" text-anchor="middle">AI-Powered Portfolio</text>
  </svg>`;
}

const tasks = [
  ["icon-only.png", tileSvg(1024, ACCENT, NAVY)],
  ["icon-background.png", tileSvg(1024, NAVY, NAVY_DARK, false)],
  ["icon-foreground.png", kSvg(1024)],
  // Light splash matches the light theme (no white/navy flash); dark splash
  // matches the dark theme. Colors mirror capacitor.config.ts SplashScreen.
  ["splash.png", splashSvg(2732, LIGHT, "#171717")],
  ["splash-dark.png", splashSvg(2732, NAVY, "white")],
  // Store marketing assets (written under store/)
  ["store/feature-graphic.png", featureGraphicSvg()],
  ["store/screenshot-1.png", screenshotSvg(0, "Chat with the AI assistant", "Answers about skills, projects and experience")],
  ["store/screenshot-2.png", screenshotSvg(1, "Automation tools on tap", "Run engineering tools right in the app")],
  ["store/screenshot-3.png", screenshotSvg(2, "Estimate any project", "AI-powered project estimates in seconds")],
];

for (const [name, svg] of tasks) {
  await sharp(Buffer.from(svg)).png().toFile(`${OUT}/${name}`);
  console.log(`  wrote assets/${name}`);
}
console.log("Next: npx capacitor-assets generate --assetPath assets");
