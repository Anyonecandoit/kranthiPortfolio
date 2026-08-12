#!/usr/bin/env node
/**
 * Builds a self-contained preview HTML of the static site (for the Preview
 * tab): inlines the exported CSS so the UI renders without a dev server.
 *
 *   node scripts/build-ui-preview.mjs   →  ui-preview.html (gitignored)
 *
 * The output is static-only: interactions that need JS won't work, but layout,
 * typography, and CSS animations (e.g. the APK robot) render as-is.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const htmlPath = join(OUT, "index.html");
const html = readFileSync(htmlPath, "utf8");

const inlined = html.replace(
  /<link rel="stylesheet"[^>]*href="(\/_next\/static\/css\/[^"]+)"[^>]*>/g,
  (match, href) => {
    try {
      const css = readFileSync(join(OUT, href.replace(/^\//, "")), "utf8");
      return `<style>${css}</style>`;
    } catch {
      return match;
    }
  }
);

// ui-preview only: the app's Preview pane is narrow, so the desktop navbar
// (which holds the GET APK button) is normally hidden there. Force it visible
// so the new button can actually be seen in the preview.
const previewOverrides = `<style>
@media (max-width: 767px) {
  .md\\:flex { display: flex !important; }
  .md\\:hidden { display: none !important; }
}
</style>`;

writeFileSync("ui-preview.html", inlined.replace("</head>", `${previewOverrides}</head>`));
const styles = (inlined.match(/<style>/g) ?? []).length;
console.log(`wrote ui-preview.html (${inlined.length} bytes, ${styles} inline stylesheets)`);
