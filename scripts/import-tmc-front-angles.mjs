#!/usr/bin/env node
/**
 * Backfill missing TMC "Front" packshot angles for rings already imported.
 *
 * The original catalog scrape kept only one Top render per metal. TMC's Shopify
 * galleries also expose a matching Front CGI render for each metal (Yellow /
 * White / Rose) — non-lifestyle product shots. This script downloads those
 * Front renders and appends them to each product's galleryByMetal so PDPs show
 * Top then Front, matching native ELYSIUM rings.
 *
 * For every product in products.json whose images live under
 * /products/tmc-import/{handle}/, we:
 *   1. Fetch https://tmcfinejewellers.com/products/{handle}.json
 *   2. Determine each metal's colour from its existing Top render path
 *   3. Pick the Front render that best matches that metal's Top render
 *   4. Download it next to the Top file as {topBase}-front.{ext}
 *   5. Append the Front path to galleryByMetal[metal] (deduped)
 *
 * Lifestyle / on-hand photos are excluded. Base images[] is left untouched.
 *
 * Usage:
 *   node scripts/import-tmc-front-angles.mjs [--dry-run]
 */

import fs from 'node:fs';
import path from 'node:path';

const DRY_RUN = process.argv.includes('--dry-run');
const STORE = 'https://tmcfinejewellers.com';
const ROOT = process.cwd();
const PRODUCTS_PATH = path.join(ROOT, 'public/data/products.json');
const PUBLIC_ROOT = path.join(ROOT, 'public');
const IMAGE_WIDTH = 1600;

// True lifestyle / on-hand shots. Narrower than the catalog scrape's version:
// the scrape also drops `_The<Name>Ring`, but that false-positives on CGI
// renders like `Yellow1080_Front_TheSnowflakeRingRound`. Since we additionally
// require a Front angle + colour token below, the TMC* markers are sufficient.
const LIFESTYLE_RE = /TMCFineJewellers|TMCFineJeweller|TMCFJ|TMCHR|ecomm-|FineJeweller-/i;

// Match a colour token at a path/underscore boundary so leading-colour names
// (e.g. `Yellow_Front__NPD-Oval-Marquise`) are recognised alongside `_Yellow_`
// and `Yellow1080_` forms.
const COLOR_PATTERNS = {
  yellow: [/[_/]Yellow(?:_|1080)/i],
  white: [/[_/]White(?:_|1080)/i],
  rose: [/[_/]Rose(?:_|1080)/i],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url, attempts = 3) {
  for (let n = 1; n <= attempts; n++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'ELYSIUM-front-angles/1.0' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (n === attempts) throw err;
      await sleep(400 * n);
    }
  }
}

function withWidth(src) {
  const url = new URL(src);
  url.searchParams.set('width', String(IMAGE_WIDTH));
  return url.toString();
}

function extFrom(src, contentType) {
  const clean = src.split('?')[0];
  const ext = path.extname(clean).toLowerCase();
  if (ext) return ext;
  if (contentType?.includes('png')) return '.png';
  return '.jpg';
}

async function download(src, destBase) {
  const res = await fetch(withWidth(src), { headers: { 'User-Agent': 'ELYSIUM-front-angles/1.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const contentType = res.headers.get('content-type') ?? '';
  const buffer = Buffer.from(await res.arrayBuffer());
  const finalPath = `${destBase}${extFrom(src, contentType)}`;
  fs.writeFileSync(finalPath, buffer);
  return { finalPath, bytes: buffer.length };
}

/** Colour (yellow/white/rose) implied by an existing local render path. */
function colorFromPath(localPath) {
  if (/white/i.test(localPath)) return 'white';
  if (/rose/i.test(localPath)) return 'rose';
  if (/yellow/i.test(localPath)) return 'yellow';
  return null;
}

/** Normalized "stem" for matching a Front render to its Top counterpart. */
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

function matchesColor(src, color) {
  return COLOR_PATTERNS[color].some((p) => p.test(src));
}

function pickRender(images, color, angleRe) {
  return images
    .map((img) => img.src || '')
    .filter((src) => src && !LIFESTYLE_RE.test(src) && angleRe.test(src) && matchesColor(src, color));
}

/** Choose the Front render that best pairs with the chosen Top render. */
function pickFront(images, color, topSrc) {
  const fronts = pickRender(images, color, /Front_|1080_Front/i);
  if (!fronts.length) return undefined;

  const topKey = topSrc ? stemKey(topSrc) : '';
  fronts.sort((a, b) => score(a) - score(b));
  return fronts[0];

  function score(src) {
    const key = stemKey(src);
    let s = 100;
    if (topKey && key === topKey) s = 0; // exact stem match with the Top render
    else if (topKey && key && (key.includes(topKey) || topKey.includes(key))) s = 1;
    else if (/1080_Front/i.test(src)) s = 2; // prefer high-res standard render
    // Tie-break on filename length (shorter tends to be the primary render)
    return s * 1000 + src.length;
  }
}

function pickTop(images, color) {
  const tops = pickRender(images, color, /Top_|1080_Top/i);
  tops.sort((a, b) => a.length - b.length);
  return tops[0];
}

function tmcHandleOf(product) {
  const first = (product.images || []).find((src) => typeof src === 'string' && src.includes('/tmc-import/'));
  return first ? first.match(/tmc-import\/([^/]+)/)?.[1] : undefined;
}

function frontDestFor(topUrl) {
  // /products/tmc-import/{handle}/yellow.jpg -> .../yellow-front  (ext added on save)
  const dir = path.posix.dirname(topUrl);
  const base = path.posix.basename(topUrl).replace(/\.[a-z0-9]+$/i, '');
  return { publicDir: dir, base: `${base}-front` };
}

async function main() {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'));
  const tmcProducts = products.filter((p) => tmcHandleOf(p) && p.galleryByMetal);

  console.log(`TMC Front-angle backfill${DRY_RUN ? ' (dry run)' : ''}`);
  console.log(`  candidates: ${tmcProducts.length} products\n`);

  let updatedProducts = 0;
  let downloaded = 0;
  let reused = 0;
  let missing = 0;
  let failed = 0;

  for (const product of tmcProducts) {
    const handle = tmcHandleOf(product);
    let shopify;
    try {
      shopify = await fetchJson(`${STORE}/products/${handle}.json`);
    } catch (err) {
      failed += 1;
      console.log(`- ${product.title} (${handle}): fetch failed — ${err.message}`);
      continue;
    }
    const images = shopify.product?.images || [];

    // Cache Front downloads per colour so metals sharing a render (e.g.
    // Platinum -> white.jpg) reuse the same Front file.
    const frontByColor = {};
    let touched = false;
    const notes = [];

    for (const [metalName, gallery] of Object.entries(product.galleryByMetal)) {
      if (!Array.isArray(gallery) || !gallery.length) continue;
      const topUrl = gallery[0];
      const color = colorFromPath(topUrl);
      if (!color) continue;

      // Already has a Front (2+ entries) — skip re-adding.
      if (gallery.length > 1) continue;

      let frontUrl = frontByColor[color];
      if (!frontUrl) {
        const topSrc = pickTop(images, color);
        const frontSrc = pickFront(images, color, topSrc);
        if (!frontSrc) {
          missing += 1;
          notes.push(`no ${color} Front`);
          continue;
        }
        const { publicDir, base } = frontDestFor(topUrl);
        const destBase = path.join(PUBLIC_ROOT, publicDir.replace(/^\//, ''), base);
        if (DRY_RUN) {
          frontUrl = `${publicDir}/${base}${extFrom(frontSrc, '')}`;
          notes.push(`${color} -> ${path.posix.basename(frontUrl)}`);
        } else {
          try {
            fs.mkdirSync(path.dirname(destBase), { recursive: true });
            const { finalPath, bytes } = await download(frontSrc, destBase);
            const rel = `/${path.relative(PUBLIC_ROOT, finalPath).split(path.sep).join('/')}`;
            frontUrl = rel;
            downloaded += 1;
            notes.push(`${color} -> ${path.basename(finalPath)} (${(bytes / 1024).toFixed(0)} KB)`);
            await sleep(150);
          } catch (err) {
            failed += 1;
            notes.push(`${color} FAIL ${err.message}`);
            continue;
          }
        }
        frontByColor[color] = frontUrl;
      } else {
        reused += 1;
      }

      if (frontUrl && !gallery.includes(frontUrl)) {
        gallery.push(frontUrl);
        touched = true;
      }
    }

    if (touched) updatedProducts += 1;
    console.log(`- ${product.title} (${handle}): ${notes.length ? notes.join(', ') : 'no changes'}`);
    await sleep(200);
  }

  if (!DRY_RUN) {
    fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2) + '\n');
  }

  console.log('\n=== Summary ===');
  console.log(`  products updated : ${updatedProducts}`);
  console.log(`  fronts downloaded: ${downloaded}`);
  console.log(`  fronts reused    : ${reused}`);
  console.log(`  colours missing  : ${missing}`);
  console.log(`  failed           : ${failed}`);
  if (DRY_RUN) console.log('\n(dry run — no files written)');
  else console.log(`\nUpdated galleryByMetal in ${PRODUCTS_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
