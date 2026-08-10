#!/usr/bin/env node
/**
 * Download Top + Front renders per metal colour for a TMC handle straight from
 * the TMC Shopify store (tmcfinejewellers.com), into
 *   exports/tmc-ring-catalog/images/<handle>/{yellow|white|rose}.jpg
 *   exports/tmc-ring-catalog/images/<handle>/{yellow|white|rose}-front.jpg
 *
 * Use when the /tmc-review catalog snapshot is missing a colour (it only stores
 * Top angles from a point-in-time scrape). After running, re-run
 *   node scripts/import-selected-rings.mjs --update --only=<handle>
 * to rebuild the product with the full metal set and front angles.
 *
 * Usage:
 *   node scripts/download-tmc-store-images.mjs --handle=<tmc-handle> [--dry-run]
 */

import fs from 'node:fs';
import path from 'node:path';

const STORE = 'https://tmcfinejewellers.com';
const ROOT = process.cwd();
const OUT_ROOT = path.join(ROOT, 'exports/tmc-ring-catalog/images');
const IMAGE_WIDTH = 1600;
const DRY_RUN = process.argv.includes('--dry-run');
const HANDLE = process.argv.find((a) => a.startsWith('--handle='))?.split('=')[1];

const COLORS = ['yellow', 'white', 'rose'];
const COLOR_PATTERNS = {
  yellow: /[_/]Yellow(?:_|1080)/i,
  white: /[_/]White(?:_|1080)/i,
  rose: /[_/]Rose(?:_|1080)/i,
};
const LIFESTYLE_RE = /TMCFineJewellers|TMCFineJeweller|TMCFJ|TMCHR|ecomm-|FineJeweller-/i;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function stemKey(src) {
  const file = (src.split('/').pop() || '').split('?')[0];
  return file
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/yellow|white|rose/gi, '')
    .replace(/top|front/gi, '')
    .replace(/1080/g, '')
    .replace(/0{3,}/g, '')
    .replace(/[^a-z0-9]/gi, '')
    .toLowerCase();
}

function candidates(srcs, color, angleRe) {
  const colorRe = COLOR_PATTERNS[color];
  return srcs.filter((s) => s && !LIFESTYLE_RE.test(s) && angleRe.test(s) && colorRe.test(s));
}

function pickTop(srcs, color) {
  const tops = candidates(srcs, color, /Top_|1080_Top/i);
  tops.sort((a, b) => a.length - b.length);
  return tops[0];
}

function pickFront(srcs, color, topSrc) {
  const fronts = candidates(srcs, color, /Front_|1080_Front/i);
  if (!fronts.length) return undefined;
  const topKey = topSrc ? stemKey(topSrc) : '';
  fronts.sort((a, b) => score(a) - score(b));
  return fronts[0];
  function score(src) {
    const key = stemKey(src);
    let s = 100;
    if (topKey && key === topKey) s = 0;
    else if (topKey && key && (key.includes(topKey) || topKey.includes(key))) s = 1;
    else if (/1080_Front/i.test(src)) s = 2;
    return s * 1000 + src.length;
  }
}

function withWidth(src) {
  try {
    const url = new URL(src);
    url.searchParams.set('width', String(IMAGE_WIDTH));
    return url.toString();
  } catch {
    return src;
  }
}

async function download(src, dest) {
  const res = await fetch(withWidth(src), { headers: { 'User-Agent': 'ELYSIUM-tmc-store/1.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buffer);
  return buffer.length;
}

async function main() {
  if (!HANDLE) {
    console.error('Missing --handle=<tmc-handle>');
    process.exit(1);
  }
  const res = await fetch(`${STORE}/products/${HANDLE}.json`, {
    headers: { 'User-Agent': 'ELYSIUM-tmc-store/1.0' },
  });
  if (!res.ok) {
    console.error(`TMC store HTTP ${res.status} for ${HANDLE}`);
    process.exit(1);
  }
  const json = await res.json();
  const srcs = (json.product?.images || []).map((i) => i.src);
  const destDir = path.join(OUT_ROOT, HANDLE);
  if (!DRY_RUN) fs.mkdirSync(destDir, { recursive: true });

  console.log(`# ${HANDLE} (${json.product?.title || ''}) — ${srcs.length} images`);
  let count = 0;
  for (const color of COLORS) {
    const topSrc = pickTop(srcs, color);
    if (!topSrc) {
      console.log(`  ${color}: no Top render — skipped`);
      continue;
    }
    const frontSrc = pickFront(srcs, color, topSrc);
    const topDest = path.join(destDir, `${color}.jpg`);
    const frontDest = path.join(destDir, `${color}-front.jpg`);
    if (DRY_RUN) {
      console.log(`  ${color}: Top ${topSrc.split('/').pop().split('?')[0]}` +
        (frontSrc ? `, Front ${frontSrc.split('/').pop().split('?')[0]}` : ' (no Front)'));
      continue;
    }
    const topBytes = await download(topSrc, topDest);
    count += 1;
    let msg = `Top ${(topBytes / 1024).toFixed(0)} KB`;
    await sleep(150);
    if (frontSrc) {
      const frontBytes = await download(frontSrc, frontDest);
      count += 1;
      msg += `, Front ${(frontBytes / 1024).toFixed(0)} KB`;
      await sleep(150);
    }
    console.log(`  ${color}: ${msg}`);
  }
  console.log(`\n${DRY_RUN ? '(dry run) ' : ''}Saved ${count} file(s) -> ${path.relative(ROOT, destDir)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
