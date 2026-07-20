#!/usr/bin/env node
/**
 * Scrape all TMC engagement + wedding/ceremonial rings.
 * Downloads metal render images only (Yellow / White / Rose) — no lifestyle/hand shots.
 * For each metal it grabs the Top render plus its matching Front angle.
 *
 * Output:
 *   exports/tmc-ring-catalog/images/{handle}/{yellow|white|rose}.jpg
 *   exports/tmc-ring-catalog/images/{handle}/{yellow|white|rose}-front.jpg
 *   exports/tmc-ring-catalog/catalog.json
 *
 * Usage:
 *   node scripts/scrape-tmc-ring-catalog.mjs
 *   node scripts/scrape-tmc-ring-catalog.mjs --collections engagement-rings,ceremonial-rings
 */

import fs from 'node:fs';
import path from 'node:path';

const STORE = 'https://tmcfinejewellers.com';
const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'exports/tmc-ring-catalog');
const IMG_DIR = path.join(OUT_DIR, 'images');
const CATALOG_PATH = path.join(OUT_DIR, 'catalog.json');
const IMAGE_WIDTH = 1600;

const COLLECTIONS = ['engagement-rings', 'ceremonial-rings'];
const METALS = [
  { key: 'yellow', label: 'Yellow Gold', patterns: [/_Yellow_/i, /Yellow1080_/i] },
  { key: 'white', label: 'White Gold', patterns: [/_White_/i, /White1080_/i] },
  { key: 'rose', label: 'Rose Gold', patterns: [/_Rose_/i, /Rose1080_/i] },
];

const LIFESTYLE_RE =
  /TMCFineJewellers|TMCFineJeweller|TMCFJ|TMCHR|ecomm-|FineJeweller-|_The[A-Z][a-z]+Ring/i;

// Narrower exclusion for Front picking: the `_The<Name>Ring` clause above
// false-positives on CGI renders (e.g. `Yellow1080_Front_TheSnowflakeRingRound`).
const FRONT_LIFESTYLE_RE = /TMCFineJewellers|TMCFineJeweller|TMCFJ|TMCHR|ecomm-|FineJeweller-/i;

// Colour token at a path/underscore boundary, catching leading-colour names
// (`Yellow_Front__...`) as well as `_Yellow_` and `Yellow1080_`.
const FRONT_COLOR_PATTERNS = {
  yellow: /[_/]Yellow(?:_|1080)/i,
  white: /[_/]White(?:_|1080)/i,
  rose: /[_/]Rose(?:_|1080)/i,
};

function parseArgs() {
  const args = process.argv.slice(2);
  let collections = COLLECTIONS;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--collections' && args[i + 1]) {
      collections = args[i + 1].split(',').map((s) => s.trim());
      i += 1;
    }
  }
  return { collections };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url, attempts = 3) {
  for (let n = 1; n <= attempts; n++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'ELYSIUM-catalog-export/1.0' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (n === attempts) throw err;
      await sleep(400 * n);
    }
  }
}

async function fetchCollection(handle) {
  const products = [];
  let page = 1;
  while (true) {
    const url = `${STORE}/collections/${handle}/products.json?limit=250&page=${page}`;
    const data = await fetchJson(url);
    const batch = data.products ?? [];
    if (!batch.length) break;
    products.push(...batch);
    if (batch.length < 250) break;
    page += 1;
    await sleep(250);
  }
  return products;
}

function isRenderCandidate(src) {
  if (LIFESTYLE_RE.test(src)) return false;
  return /Top_|Front_|1080_Top|1080_Front/i.test(src);
}

function pickMetalRender(images, patterns) {
  const candidates = images.filter((img) => {
    const src = img.src || '';
    if (!isRenderCandidate(src)) return false;
    return patterns.some((p) => p.test(src));
  });

  candidates.sort((a, b) => {
    const aTop = /Top_|1080_Top/i.test(a.src) ? 0 : 1;
    const bTop = /Top_|1080_Top/i.test(b.src) ? 0 : 1;
    if (aTop !== bTop) return aTop - bTop;
    return a.src.length - b.src.length;
  });

  return candidates[0]?.src;
}

/** Normalized stem used to pair a Front render with its Top counterpart. */
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

/** Pick the Front render for a metal, preferring the one matching the Top. */
function pickMetalFront(images, metalKey, topSrc) {
  const colorRe = FRONT_COLOR_PATTERNS[metalKey];
  const candidates = images.filter((img) => {
    const src = img.src || '';
    if (FRONT_LIFESTYLE_RE.test(src)) return false;
    if (!/Front_|1080_Front/i.test(src)) return false;
    return colorRe ? colorRe.test(src) : false;
  });
  const topKey = topSrc ? stemKey(topSrc) : '';
  candidates.sort((a, b) => score(a.src) - score(b.src));
  return candidates[0]?.src;

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
  const res = await fetch(withWidth(src), { headers: { 'User-Agent': 'ELYSIUM-catalog-export/1.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const contentType = res.headers.get('content-type') ?? '';
  const buffer = Buffer.from(await res.arrayBuffer());
  const finalPath = `${destBase}${extFrom(src, contentType)}`;
  fs.writeFileSync(finalPath, buffer);
  return { finalPath, bytes: buffer.length };
}

function categoryFor(product) {
  const cols = product._collections;
  const inCer = cols?.has?.('ceremonial-rings');
  const inEng = cols?.has?.('engagement-rings');
  if (inCer && !inEng) return 'Wedding / Ceremonial';
  if (inEng && !inCer) return 'Engagement';
  if (inCer && inEng) return 'Engagement & Wedding';
  return product.product_type?.includes('Ceremonial') ? 'Wedding / Ceremonial' : 'Engagement';
}

async function main() {
  const { collections } = parseArgs();
  fs.mkdirSync(IMG_DIR, { recursive: true });

  console.log('TMC ring catalog export (renders only)');
  console.log('  collections:', collections.join(', '));
  console.log('  output:', OUT_DIR);
  console.log('');

  const byHandle = new Map();

  for (const handle of collections) {
    console.log(`Fetching ${handle}...`);
    const products = await fetchCollection(handle);
    console.log(`  ${products.length} products`);
    for (const p of products) {
      const existing = byHandle.get(p.handle);
      if (existing) {
        existing._collections.add(handle);
      } else {
        byHandle.set(p.handle, { ...p, _collections: new Set([handle]) });
      }
    }
    await sleep(300);
  }

  const products = [...byHandle.values()];
  console.log(`\nUnique products: ${products.length}\n`);

  const catalog = {
    source: STORE,
    scrapedAt: new Date().toISOString(),
    collections,
    productCount: products.length,
    rows: [],
  };

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const handle = product.handle;
    const productDir = path.join(IMG_DIR, handle);
    fs.mkdirSync(productDir, { recursive: true });

    const category = categoryFor(product);
    const tmcPrice = product.variants?.[0]?.price ?? '';

    console.log(`[${i + 1}/${products.length}] ${product.title}`);

    for (const metal of METALS) {
      const src = pickMetalRender(product.images ?? [], metal.patterns);
      const frontSrc = pickMetalFront(product.images ?? [], metal.key, src);
      const row = {
        handle,
        tmcOriginalName: product.title,
        category,
        metalColour: metal.label,
        metalKey: metal.key,
        tmcPriceAud: tmcPrice,
        name: '',
        price: '',
        notes: '',
        include: '',
        imageFile: '',
        imageRelative: '',
        sourceUrl: src || '',
        frontImageFile: '',
        frontImageRelative: '',
        frontSourceUrl: frontSrc || '',
      };

      if (!src) {
        skipped += 1;
        catalog.rows.push(row);
        console.log(`    skip ${metal.label} (no render)`);
        continue;
      }

      try {
        const destBase = path.join(productDir, metal.key);
        const { finalPath, bytes } = await download(src, destBase);
        const rel = path.relative(OUT_DIR, finalPath).split(path.sep).join('/');
        row.imageFile = path.basename(finalPath);
        row.imageRelative = rel;
        downloaded += 1;
        console.log(`    ok  ${metal.label} (${(bytes / 1024).toFixed(0)} KB)`);
      } catch (err) {
        failed += 1;
        catalog.rows.push(row);
        console.log(`    FAIL ${metal.label}: ${err.message}`);
        continue;
      }
      await sleep(200);

      // Front angle (non-lifestyle product shot), paired with the Top render.
      if (frontSrc) {
        try {
          const frontBase = path.join(productDir, `${metal.key}-front`);
          const { finalPath, bytes } = await download(frontSrc, frontBase);
          const rel = path.relative(OUT_DIR, finalPath).split(path.sep).join('/');
          row.frontImageFile = path.basename(finalPath);
          row.frontImageRelative = rel;
          downloaded += 1;
          console.log(`    ok  ${metal.label} Front (${(bytes / 1024).toFixed(0)} KB)`);
          await sleep(200);
        } catch (err) {
          failed += 1;
          console.log(`    FAIL ${metal.label} Front: ${err.message}`);
        }
      }

      catalog.rows.push(row);
    }
    await sleep(250);
  }

  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2));

  console.log('\n=== Summary ===');
  console.log(`  products : ${products.length}`);
  console.log(`  rows     : ${catalog.rows.length}`);
  console.log(`  downloaded: ${downloaded}`);
  console.log(`  skipped  : ${skipped}`);
  console.log(`  failed   : ${failed}`);
  console.log(`  catalog  : ${CATALOG_PATH}`);
  console.log('\nNext: node scripts/build-tmc-client-catalog-sheet.py');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
