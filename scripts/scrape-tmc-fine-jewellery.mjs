#!/usr/bin/env node
/**
 * Scrape TMC fine jewellery (earrings, necklaces, pendants, bracelets, fine
 * rings) for the client review configurator (/tmc-review).
 *
 * Unlike the ring scrape this does NOT download images — the review page renders
 * straight from the Shopify CDN (sourceUrl). It only captures, per product and
 * per metal colour, the main render URL plus a front/second angle when present.
 *
 * Fine jewellery uses the same colour render naming as rings
 * (Yellow1080_/White1080_/Rose1080_, sometimes `Vew1`/`View1` instead of `Top`),
 * so a lenient colour-token picker covers all categories.
 *
 * Output: exports/tmc-fine-jewellery/catalog.json  (same row schema as rings)
 *
 * Usage:
 *   node scripts/scrape-tmc-fine-jewellery.mjs
 *   node scripts/scrape-tmc-fine-jewellery.mjs --collections earrings,necklaces
 */

import fs from 'node:fs';
import path from 'node:path';

const STORE = 'https://tmcfinejewellers.com';
const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'exports/tmc-fine-jewellery');
const CATALOG_PATH = path.join(OUT_DIR, 'catalog.json');

// collection handle -> friendly category label (order = priority when a product
// belongs to several collections).
const COLLECTIONS = [
  ['earrings', 'Earrings'],
  ['necklaces', 'Necklaces'],
  ['pendants', 'Pendants'],
  ['bracelets', 'Bracelets'],
  ['fine-rings', 'Fine Rings'],
];

const METALS = [
  { key: 'yellow', re: /(?:^|[_/])Yellow[_0-9]/i },
  { key: 'white', re: /(?:^|[_/])White[_0-9]/i },
  { key: 'rose', re: /(?:^|[_/])Rose[_0-9]/i },
];

// Editorial / campaign / screenshot assets that are not clean CGI renders.
const LIFESTYLE_RE =
  /TMCFineJewellers|TMCFineJeweller|TMCFJ|TMCHR|ecomm-|FineJeweller-|ProductImagery|MDAY|Mother_?s|Screenshot|ezgif|Classic_Statement|Tennis_Bracelet-|Ascending|-animated-/i;

function parseArgs() {
  const args = process.argv.slice(2);
  let collections = COLLECTIONS;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--collections' && args[i + 1]) {
      const wanted = args[i + 1].split(',').map((s) => s.trim());
      collections = COLLECTIONS.filter(([h]) => wanted.includes(h));
      i += 1;
    }
  }
  return { collections };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url, attempts = 3) {
  for (let n = 1; n <= attempts; n++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'ELYSIUM-fj-export/1.0' } });
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

const fileOf = (src) => (src.split('/').pop() || '').split('?')[0];

/** Pick the main (top/view) and front render URLs for a metal colour. */
function pickMetal(images, colorRe) {
  const candidates = images
    .map((img) => img.src || '')
    .filter((src) => src && !LIFESTYLE_RE.test(src) && colorRe.test(fileOf(src)));
  if (!candidates.length) return { top: '', front: '' };

  const isMain = (s) => /(?:_|^)(top|vew\d|view\d)/i.test(fileOf(s));
  const isFront = (s) => /front/i.test(fileOf(s));

  const mains = candidates.filter((s) => isMain(s) && !isFront(s));
  const fronts = candidates.filter((s) => isFront(s));

  const byLen = (a, b) => fileOf(a).length - fileOf(b).length;
  mains.sort(byLen);
  fronts.sort(byLen);

  const top = mains[0] || candidates.slice().sort(byLen)[0] || '';
  const front = fronts[0] && fronts[0] !== top ? fronts[0] : '';
  return { top, front };
}

/** Fallback: first non-lifestyle render-looking image (any colour). */
function fallbackImage(images) {
  const clean = images
    .map((img) => img.src || '')
    .filter((src) => src && !LIFESTYLE_RE.test(src));
  const render = clean.find((s) => /1080_|_Top_|_Vew|_View/i.test(fileOf(s)));
  return render || clean[0] || images?.[0]?.src || '';
}

async function main() {
  const { collections } = parseArgs();
  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log('TMC fine jewellery export (CDN URLs only)');
  console.log('  collections:', collections.map(([h]) => h).join(', '));
  console.log('');

  const byHandle = new Map();
  for (const [handle, label] of collections) {
    console.log(`Fetching ${handle}...`);
    const products = await fetchCollection(handle);
    console.log(`  ${products.length} products`);
    for (const p of products) {
      if (!byHandle.has(p.handle)) {
        byHandle.set(p.handle, { ...p, _category: `Fine Jewellery — ${label}` });
      }
    }
    await sleep(300);
  }

  const products = [...byHandle.values()];
  console.log(`\nUnique products: ${products.length}\n`);

  const catalog = {
    source: STORE,
    scrapedAt: new Date().toISOString(),
    collections: collections.map(([h]) => h),
    productCount: products.length,
    rows: [],
  };

  let withRender = 0;
  let fallbackOnly = 0;

  for (const product of products) {
    const handle = product.handle;
    const images = product.images ?? [];
    const category = product._category;
    const tmcPrice = product.variants?.[0]?.price ?? '';

    let any = false;
    for (const metal of METALS) {
      const { top, front } = pickMetal(images, metal.re);
      if (!top) continue;
      any = true;
      catalog.rows.push({
        handle,
        tmcOriginalName: product.title,
        category,
        metalColour: metal.key,
        metalKey: metal.key,
        tmcPriceAud: tmcPrice,
        sourceUrl: top,
        frontSourceUrl: front || '',
      });
    }

    if (!any) {
      const fb = fallbackImage(images);
      if (fb) {
        fallbackOnly += 1;
        catalog.rows.push({
          handle,
          tmcOriginalName: product.title,
          category,
        metalColour: 'yellow',
        metalKey: 'yellow',
        tmcPriceAud: tmcPrice,
        sourceUrl: fb,
        frontSourceUrl: '',
        });
      } else {
        console.log(`  ! ${product.title}: no usable image`);
      }
    } else {
      withRender += 1;
    }
  }

  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2));

  console.log('\n=== Summary ===');
  console.log(`  products      : ${products.length}`);
  console.log(`  with renders  : ${withRender}`);
  console.log(`  fallback only : ${fallbackOnly}`);
  console.log(`  rows          : ${catalog.rows.length}`);
  console.log(`  catalog       : ${CATALOG_PATH}`);
  console.log('\nNext: python3 scripts/build-tmc-review-data.py');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
