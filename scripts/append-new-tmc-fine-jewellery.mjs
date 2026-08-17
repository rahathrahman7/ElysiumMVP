#!/usr/bin/env node
/**
 * Fetch specific new TMC fine-jewellery handles and write scrape rows for
 * merging into public/data/tmc-review-catalog.json.
 *
 * Output: exports/tmc-fine-jewellery/new-drop.json
 *
 * Usage:
 *   node scripts/append-new-tmc-fine-jewellery.mjs
 *   python3 scripts/merge-tmc-review-drop.py
 */

import fs from 'node:fs';
import path from 'node:path';

const STORE = 'https://tmcfinejewellers.com';
const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'exports/tmc-fine-jewellery');
const OUT_PATH = path.join(OUT_DIR, 'new-drop.json');

const HANDLES = [
  'the-iris-emerald-bracelet',
  'the-iris-heart-bracelet',
  'the-iris-marquise-bracelet',
  'the-iris-oval-bracelet',
  'the-iris-pear-bracelet',
  'the-iris-radiant-bracelet',
  'the-iris-round-bracelet',
  'the-mara-emerald-georgian-bracelet',
  'the-mara-heart-georgian-bracelet',
  'the-mara-marquise-georgian-bracelet',
  'the-mara-oval-georgian-bracelet',
  'the-mara-pear-georgian-bracelet',
  'the-mara-radiant-georgian-bracelet',
  'the-mara-round-georgian-bracelet',
  'the-diamond-cut-figaro-chain',
  'the-pelline-chain',
  'the-adira-earrings-emerald-double-bezel-studs',
  'the-adira-earrings-heart-double-bezel-studs',
  'the-adira-earrings-marquise-double-bezel-studs',
  'the-adira-earrings-oval-double-bezel-studs',
  'the-adira-earrings-pear-double-bezel-studs',
  'the-adira-earrings-round-double-bezel-studs',
  'the-mara-earrings-emerald-georgian-studs',
  'the-mara-earrings-heart-georgian-studs',
  'the-mara-earrings-marquise-georgian-studs',
  'the-mara-earrings-oval-georgian-studs',
  'the-mara-earrings-pear-georgian-studs',
  'the-mara-earrings-radiant-georgian-studs',
  'the-mara-earrings-round-georgian-studs',
  'the-romy-earrings-contour-heart-studs',
  'the-iris-necklace-east-west-emerald-pendant',
  'the-iris-necklace-east-west-marquise-pendant',
  'the-iris-necklace-east-west-oval-pendant',
  'the-iris-necklace-east-west-pear-pendant',
  'the-iris-necklace-east-west-radiant-pendant',
  'the-iris-necklace-heart-pendant',
  'the-lea-necklace-pave-letter-pendant',
  'the-lea-necklace-plain-letter-pendant',
  'the-mara-necklace-emerald-georgian-pendant',
  'the-mara-necklace-heart-georgian-pendant',
  'the-mara-necklace-marquise-georgian-pendant',
  'the-mara-necklace-oval-georgian-pendant',
  'the-mara-necklace-pear-georgian-pendant',
  'the-mara-necklace-radiant-georgian-pendant',
  'the-mara-necklace-round-georgian-pendant',
  'the-adira-elongated-cushion-double-bezel-pendant',
  'the-adira-emerald-double-bezel-pendant',
  'the-adira-heart-double-bezel-pendant',
  'the-adira-marquise-double-bezel-pendant',
  'the-adira-oval-double-bezel-pendant',
  'the-adira-pear-double-bezel-pendant',
  'the-adira-round-double-bezel-pendant',
  'the-henley-elongated-cushion-bezel-pendant',
  'the-henley-emerald-bezel-pendant',
  'the-henley-heart-bezel-pendant',
  'the-henley-marquise-bezel-pendant',
  'the-henley-oval-bezel-pendant',
  'the-henley-pear-bezel-pendant',
  'the-henley-round-bezel-pendant',
];

const METALS = [
  { key: 'yellow', re: /(?:^|[_/])Yellow[_0-9]/i },
  { key: 'white', re: /(?:^|[_/])White[_0-9]/i },
  { key: 'rose', re: /(?:^|[_/])Rose[_0-9]/i },
];

const LIFESTYLE_RE =
  /TMCFineJewellers|TMCFineJeweller|TMCFJ|TMCHR|ecomm-|FineJeweller-|ProductImagery|MDAY|Mother_?s|Screenshot|ezgif|Classic_Statement|Tennis_Bracelet-|Ascending|-animated-/i;

const CATEGORY_BY_TYPE = {
  Earrings: 'Fine Jewellery — Earrings',
  Bracelet: 'Fine Jewellery — Bracelets',
  Necklace: 'Fine Jewellery — Necklaces',
  Pendant: 'Fine Jewellery — Necklaces',
  Chain: 'Fine Jewellery — Necklaces',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url, attempts = 6) {
  for (let n = 1; n <= attempts; n++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'ELYSIUM-fj-new-drop/1.0' } });
      if (res.status === 429) {
        const wait = 4000 * n;
        console.log(`  429 ${url} — waiting ${wait}ms`);
        await sleep(wait);
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (n === attempts) throw err;
      await sleep(600 * n);
    }
  }
}

const fileOf = (src) => (src.split('/').pop() || '').split('?')[0];

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

function fallbackImage(images) {
  const clean = images
    .map((img) => img.src || '')
    .filter((src) => src && !LIFESTYLE_RE.test(src));
  const render = clean.find((s) => /1080_|_Top_|_Vew|_View/i.test(fileOf(s)));
  return render || clean[0] || images?.[0]?.src || '';
}

function categoryFor(product) {
  return CATEGORY_BY_TYPE[product.product_type] || 'Fine Jewellery — Necklaces';
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log(`Fetching ${HANDLES.length} TMC products…\n`);

  const catalog = {
    source: STORE,
    scrapedAt: new Date().toISOString(),
    productCount: 0,
    rows: [],
  };

  let ok = 0;
  let fallbackOnly = 0;
  let missing = 0;

  for (let i = 0; i < HANDLES.length; i++) {
    const handle = HANDLES[i];
    process.stdout.write(`  [${i + 1}/${HANDLES.length}] ${handle} `);
    let data;
    try {
      data = await fetchJson(`${STORE}/products/${handle}.json`);
    } catch (err) {
      console.log(`FAIL ${err.message}`);
      missing += 1;
      await sleep(800);
      continue;
    }
    const product = data.product;
    if (!product) {
      console.log('NO PRODUCT');
      missing += 1;
      await sleep(800);
      continue;
    }

    const images = product.images ?? [];
    const tmcPrice = product.variants?.[0]?.price ?? '';
    const category = categoryFor(product);
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
        console.log(`fallback · ${product.title}`);
      } else {
        missing += 1;
        console.log(`no image · ${product.title}`);
      }
    } else {
      ok += 1;
      const metals = catalog.rows.filter((r) => r.handle === handle).map((r) => r.metalKey).join(',');
      console.log(`${product.title} [${metals}]`);
    }

    await sleep(700);
  }

  catalog.productCount = new Set(catalog.rows.map((r) => r.handle)).size;
  fs.writeFileSync(OUT_PATH, JSON.stringify(catalog, null, 2));

  console.log('\n=== Summary ===');
  console.log(`  with renders  : ${ok}`);
  console.log(`  fallback only : ${fallbackOnly}`);
  console.log(`  missing       : ${missing}`);
  console.log(`  unique        : ${catalog.productCount}`);
  console.log(`  rows          : ${catalog.rows.length}`);
  console.log(`  wrote         : ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
