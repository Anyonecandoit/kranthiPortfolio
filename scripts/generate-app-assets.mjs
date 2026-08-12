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

const ACCENT = "#7c3aed"; // violet
const NAVY = "#0f172a";
const NAVY_DARK = "#07070f";

/** White "K" monogram as rounded strokes. `stroke` = stroke width. */
function kSvg(size, opts = {}) {
  const { stroke = size * 0.125, x = 0, y = 0 } = opts;
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
        `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="white" stroke-width="${s}" stroke-linecap="round"/>`
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

function splashSvg(size, bg) {
  // Solid background + centered monogram (kept modest so it reads on any screen).
  const k = kSvg(size * 0.42, { x: size * 0.29, y: size * 0.29 });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="${bg}"/>
    ${k}
  </svg>`;
}

const tasks = [
  ["icon-only.png", tileSvg(1024, ACCENT, NAVY)],
  ["icon-background.png", tileSvg(1024, NAVY, NAVY_DARK, false)],
  ["icon-foreground.png", kSvg(1024)],
  ["splash.png", splashSvg(2732, NAVY)],
  ["splash-dark.png", splashSvg(2732, NAVY_DARK)],
];

for (const [name, svg] of tasks) {
  await sharp(Buffer.from(svg)).png().toFile(`${OUT}/${name}`);
  console.log(`  wrote assets/${name}`);
}
console.log("Next: npx capacitor-assets generate --assetPath assets");
