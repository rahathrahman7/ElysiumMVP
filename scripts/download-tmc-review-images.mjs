#!/usr/bin/env node
/**
 * Download the TMC configurator's Top renders for selected handles.
 *
 * The /tmc-review configurator shows Shopify CDN "Top" images stored in
 * public/data/tmc-review-catalog.json as images.{yellow|white|rose}. This
 * script pulls those exact URLs to
 *   exports/tmc-ring-catalog/images/<handle>/{yellow|white|rose}.jpg
 * so scripts/import-selected-rings.mjs (copyRenders) can pick them up.
 *
 * Usage:
 *   node scripts/download-tmc-review-images.mjs --only=<handle>[,<handle>...]
 *   node scripts/download-tmc-review-images.mjs            # all kept-with-images
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CATALOG_PATH = path.join(ROOT, 'public/data/tmc-review-catalog.json');
const OUT_ROOT = path.join(ROOT, 'exports/tmc-ring-catalog/images');
const DRY_RUN = process.argv.includes('--dry-run');
const ONLY = (() => {
  const raw = process.argv.find((a) => a.startsWith('--only='))?.split('=')[1];
  if (!raw) return null;
  return new Set(raw.split(',').map((s) => s.trim()).filter(Boolean));
})();

const COLORS = ['yellow', 'white', 'rose'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Request the largest render available from the Shopify CDN URL. */
function atFullWidth(src) {
  try {
    const url = new URL(src);
    url.searchParams.set('width', '1600');
    return url.toString();
  } catch {
    return src;
  }
}

async function download(src, dest) {
  const res = await fetch(atFullWidth(src), {
    headers: { 'User-Agent': 'ELYSIUM-tmc-images/1.0' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buffer);
  return buffer.length;
}

async function main() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
  const byHandle = new Map(catalog.map((r) => [r.handle, r]));

  const handles = ONLY ? [...ONLY] : catalog.map((r) => r.handle);
  let total = 0;

  for (const handle of handles) {
    const entry = byHandle.get(handle);
    if (!entry) {
      console.log(`! ${handle}: not found in review catalog — skipping`);
      continue;
    }
    const images = entry.images || {};
    const present = COLORS.filter((c) => images[c]);
    if (present.length === 0) {
      console.log(`! ${handle}: no yellow/white/rose images — skipping`);
      continue;
    }

    const destDir = path.join(OUT_ROOT, handle);
    if (!DRY_RUN) fs.mkdirSync(destDir, { recursive: true });
    console.log(`\n# ${handle} (${entry.tmcName || ''})`);

    for (const color of present) {
      const dest = path.join(destDir, `${color}.jpg`);
      if (DRY_RUN) {
        console.log(`  ${color}: would download -> ${path.relative(ROOT, dest)}`);
        continue;
      }
      const bytes = await download(images[color], dest);
      total += 1;
      console.log(`  ${color}: ${(bytes / 1024).toFixed(0)} KB`);
      await sleep(150);
    }
  }

  console.log(`\n${DRY_RUN ? '(dry run) ' : ''}Downloaded ${total} image(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
