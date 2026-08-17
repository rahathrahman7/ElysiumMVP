#!/usr/bin/env node
/**
 * Import client-selected TMC fine jewellery (earrings, necklaces, bracelets, hoops)
 * into public/data/products.json.
 *
 * Unlike import-selected-rings.mjs this script:
 *   - uses an explicit TARGETS list (never imports "Replace …" rows as products)
 *   - downloads Top + Side (or Pers) studio renders from the live TMC store
 *   - applies Lab Prices / fixed review GBP
 *   - forces disambiguated slugs (allure-earrings vs allure-necklace)
 *
 * Usage:
 *   node scripts/import-selected-jewellery.mjs [--dry-run] [--only=slug-or-handle,...]
 */

import fs from 'node:fs';
import path from 'node:path';

const DRY_RUN = process.argv.includes('--dry-run');
const ONLY = (() => {
  const raw = process.argv.find((a) => a.startsWith('--only='))?.split('=')[1];
  if (!raw) return null;
  return new Set(raw.split(',').map((s) => s.trim()).filter(Boolean));
})();

const ROOT = process.cwd();
const PRODUCTS_PATH = path.join(ROOT, 'public/data/products.json');
const LAB_PRICES_PATH = path.join(ROOT, 'public/data/tmc-lab-prices.json');
const PUBLIC_IMAGES_ROOT = path.join(ROOT, 'public/products/tmc-import');
const REVIEW_API = process.env.REVIEW_API || 'https://elysium-mvp.vercel.app/api/tmc-review';
const STORE = 'https://tmcfinejewellers.com';
const IMAGE_WIDTH = 1600;

const LIFESTYLE_RE = /TMCFineJewellers|TMCFineJeweller|TMCFJ|TMCHR|ecomm-|FineJeweller-|Screenshot|Your_Signature|Classic_Statement|Tennis_Bracelet|BezelTennis/i;
const COLOR_PATTERNS = {
  yellow: /[_/]Yellow(?:_|1080)|Yellow1080|_Yellow_|Top_\d+_Yellow/i,
  white: /[_/]White(?:_|1080)|White1080|_White_|Top_\d+_White/i,
  rose: /[_/]Rose(?:_|1080)|Rose1080|_Rose_|Top_\d+_Rose/i,
};

const METAL_TEMPLATE = {
  '18k Yellow Gold': { hex: '#FFD700', priceDeltaGBP: 0, imageUrl: '/icons/swatches/goldswatch.png' },
  '18k Rose Gold': { hex: '#B76E79', priceDeltaGBP: 0, imageUrl: '/icons/swatches/rosegoldswatch.png' },
  '18k White Gold': { hex: '#FAF9F6', priceDeltaGBP: 0, imageUrl: '/icons/swatches/whitegoldswatch.png' },
  Platinum: { hex: '#E5E4E2', priceDeltaGBP: 75, imageUrl: '/icons/swatches/platinumswatch.png' },
};
const METAL_LABEL_MAP = {
  'Yellow Gold': '18k Yellow Gold',
  'Rose Gold': '18k Rose Gold',
  'White Gold': '18k White Gold',
  Platinum: 'Platinum',
};
const METAL_RENDER = {
  '18k Yellow Gold': 'yellow',
  '18k Rose Gold': 'rose',
  '18k White Gold': 'white',
  Platinum: 'white',
};
const ORIGINS = [
  { label: 'Natural', priceDeltaGBP: 0 },
  { label: 'Lab Grown', priceDeltaGBP: 0 },
];

/**
 * Explicit import list — Serelle excluded; Replace-* rows never appear here.
 * labPriceKey looks up public/data/tmc-lab-prices.json.
 */
const TARGETS = [
  // New earrings
  { handle: 'the-vera-earrings-pear-bezel-studs', slug: 'allure-earrings', title: 'Allure', category: 'earrings', labPriceKey: 'allure-earrings', shape: 'pear' },
  { handle: 'the-vera-earrings-radiant-bezel-studs', slug: 'radiance-earrings', title: 'Radiance', category: 'earrings', labPriceKey: 'radiance-earrings', shape: 'radiant' },
  { handle: 'the-vera-earrings-oval-bezel-studs', slug: 'union-earrings', title: 'Union', category: 'earrings', labPriceKey: 'union-earrings', shape: 'oval' },
  { handle: 'the-statement-hoop', slug: 'beloved-hoops', title: 'Beloved', category: 'earrings', labPriceKey: 'beloved', shape: '' },
  // Paperclip
  { handle: 'the-fine-paperclip-chain', slug: 'paperclip-chain', title: 'Paperclip Chain', category: 'necklaces', labPriceKey: 'paperclip-chain', shape: '' },
  { handle: 'the-fine-paperclip-bracelet', slug: 'paperclip-bracelet', title: 'Paperclip Bracelet', category: 'bracelets', labPriceKey: 'paperclip-bracelet', shape: '' },
  // Necklaces
  { handle: 'the-iris-necklace-oval-pendant', slug: 'legacy-necklace', title: 'Legacy Necklace', category: 'necklaces', labPriceKey: 'legacy-necklace', shape: 'oval' },
  { handle: 'the-vera-necklace-marquise-bezel-pendant', slug: 'refined-necklace', title: 'Refined Necklace', category: 'necklaces', labPriceKey: 'refined-necklace', shape: 'marquise' },
  { handle: 'the-vera-necklace-oval-emerald-pendant', slug: 'pure-necklace', title: 'Pure Necklace', category: 'necklaces', labPriceKey: 'pure-necklace', shape: 'emerald' },
  { handle: 'the-iris-necklace-pear-pendant', slug: 'essence-necklace', title: 'Essence Necklace', category: 'necklaces', labPriceKey: 'essence-necklace', shape: 'pear' },
  { handle: 'the-iris-necklace-round-pendant', slug: 'crown-necklace', title: 'Crown Necklace', category: 'necklaces', labPriceKey: 'crown-necklace', shape: 'round' },
  { handle: 'the-iris-necklace-emerald-pendant', slug: 'icon-necklace', title: 'Icon Necklace', category: 'necklaces', labPriceKey: 'icon-necklace', shape: 'emerald' },
  { handle: 'the-iris-necklace-radiant-pendant', slug: 'heirloom-necklace', title: 'Heirloom Necklace', category: 'necklaces', labPriceKey: 'heirloom-necklace', shape: 'radiant' },
  { handle: 'the-iris-necklace-marquise-pendant', slug: 'eternal-necklace', title: 'Eternal Necklace', category: 'necklaces', labPriceKey: 'eternal-necklace', shape: 'marquise' },
  { handle: 'the-vera-necklace-round-bezel-set', slug: 'timeless-necklace', title: 'Timeless Necklace', category: 'necklaces', labPriceKey: 'timeless-necklace', shape: 'round' },
  { handle: 'the-vera-necklace-oval-bezel-pendant', slug: 'union-necklace', title: 'Union Necklace', category: 'necklaces', labPriceKey: 'union-necklace', shape: 'oval' },
  { handle: 'the-vera-necklace-radiant-bezel-pendant', slug: 'radiance-necklace', title: 'Radiance Necklace', category: 'necklaces', labPriceKey: 'radiance-necklace', shape: 'radiant' },
  { handle: 'the-vera-necklace-pear-bezel-pendant', slug: 'allure-necklace', title: 'Allure Necklace', category: 'necklaces', labPriceKey: 'allure-necklace', shape: 'pear' },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function firstSentence(text) {
  if (!text) return '';
  const m = text.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : text).trim();
}

function parseGbp(raw) {
  const s = String(raw ?? '').trim();
  if (!s || !/\d/.test(s)) return null;
  const n = Number(s.replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) && n > 0 ? n : null;
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

function caratNumber(label) {
  const m = String(label).match(/(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : 0;
}

function buildCarats(labPrice, reviewCarats) {
  if (!labPrice?.caratDeltas || Object.keys(labPrice.caratDeltas).length === 0) {
    return [];
  }
  const labels = Object.keys(labPrice.caratDeltas);
  // Prefer sheet order by numeric size
  labels.sort((a, b) => caratNumber(a) - caratNumber(b));
  return labels.map((label) => ({
    label,
    carat: caratNumber(label),
    priceDeltaGBP: labPrice.caratDeltas[label] ?? 0,
  }));
}

function pickAngle(srcs, color, angleRes) {
  const colorRe = COLOR_PATTERNS[color];
  const hits = srcs.filter(
    (s) => s && !LIFESTYLE_RE.test(s) && colorRe.test(s) && angleRes.some((re) => re.test(s)),
  );
  hits.sort((a, b) => a.length - b.length);
  return hits[0];
}

async function downloadRenders(handle) {
  const res = await fetch(`${STORE}/products/${handle}.json`, {
    headers: { 'User-Agent': 'ELYSIUM-jewellery/1.0' },
  });
  if (!res.ok) throw new Error(`TMC store HTTP ${res.status} for ${handle}`);
  const json = await res.json();
  const srcs = (json.product?.images || []).map((i) => i.src);
  const destDir = path.join(PUBLIC_IMAGES_ROOT, handle);
  if (!DRY_RUN) fs.mkdirSync(destDir, { recursive: true });

  const available = {};
  for (const color of ['yellow', 'white', 'rose']) {
    const top =
      pickAngle(srcs, color, [/Top_|1080_Top|Yellow1080_Top|White1080_Top|Rose1080_Top/i]) ||
      pickAngle(srcs, color, [/Vew1_|View1_/i]);
    if (!top) {
      console.log(`  ${color}: no Top — skipped`);
      continue;
    }
    const side =
      pickAngle(srcs, color, [/Side_|1080_Side/i]) ||
      pickAngle(srcs, color, [/Pers_|1080_Pers|Vew3_|View3_/i]);

    for (const [src, name] of [
      [top, `${color}.jpg`],
      ...(side ? [[side, `${color}-side.jpg`]] : []),
    ]) {
      const dest = path.join(destDir, name);
      if (!DRY_RUN) {
        const r = await fetch(withWidth(src), { headers: { 'User-Agent': 'ELYSIUM-jewellery/1.0' } });
        if (!r.ok) throw new Error(`HTTP ${r.status} downloading ${name}`);
        fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
        await sleep(120);
      }
      available[name] = `/products/tmc-import/${handle}/${name}`;
    }
    console.log(
      `  ${color}: Top` + (available[`${color}-side.jpg`] ? ' + Side' : ''),
    );
  }
  return available;
}

function buildProduct(target, review, available, price, labPrice) {
  const notes = (review.notes || '').trim();
  const blurb = firstSentence(notes) || `${target.title} — a signature ELYSIUM design.`;
  const description = notes || blurb;
  const opts = review.options || {};

  const metalNames = (opts.metals || ['Yellow Gold', 'Rose Gold', 'White Gold'])
    .map((m) => METAL_LABEL_MAP[m])
    .filter(Boolean);

  const metals = metalNames
    .filter((name) => available[`${METAL_RENDER[name]}.jpg`])
    .map((name) => ({ name, ...METAL_TEMPLATE[name] }));

  if (metals.length === 0) {
    return { skip: `${target.handle} (no metals with renders)` };
  }

  const images = ['yellow.jpg', 'white.jpg', 'rose.jpg']
    .filter((f) => available[f])
    .map((f) => available[f]);

  const galleryByMetal = {};
  for (const m of metals) {
    const color = METAL_RENDER[m.name];
    const top = available[`${color}.jpg`];
    const side = available[`${color}-side.jpg`];
    galleryByMetal[m.name] = side ? [top, side] : [top];
  }

  const carats = buildCarats(labPrice, opts.carats);
  const origins = (opts.origins || [])
    .map((o) => ORIGINS.find((x) => x.label === o))
    .filter(Boolean);

  const collectionRoot =
    target.category === 'earrings'
      ? 'earrings'
      : target.category === 'bracelets'
        ? 'bracelets'
        : 'necklaces';

  const collections = [
    collectionRoot,
    'signature-collection',
    ...(target.shape ? [target.shape] : []),
    target.slug,
  ];

  // Necklaces: sheet notes 16"/18" length options
  const sizes =
    target.category === 'necklaces' && !/paperclip/i.test(target.slug)
      ? ['16"', '18"']
      : undefined;

  const product = {
    slug: target.slug,
    title: target.title,
    blurb,
    description,
    images,
    basePriceGBP: price,
    metals,
    ...(origins.length ? { origins } : origins.length === 0 && (opts.origins || []).length === 0 ? {} : { origins: ORIGINS }),
    ...(carats.length ? { carats } : {}),
    ...(sizes ? { sizes } : {}),
    qualityBanner:
      target.category === 'earrings' || target.category === 'necklaces'
        ? 'D–E colour • VS1+ clarity • Very Good to Excellent cut'
        : 'Solid 18k gold',
    collections: [...new Set(collections)],
    ...(target.shape ? { shape: target.shape } : {}),
    styles: [target.category === 'earrings' ? 'studs' : target.category].filter(Boolean),
    galleryByMetal,
    seoTitle: `${target.title} | ELYSIUM`,
    seoDescription: blurb,
    isFeatured: false,
  };

  // Paperclip / Beloved: no diamond options
  if (/paperclip|beloved/i.test(target.slug)) {
    delete product.origins;
    delete product.carats;
    product.qualityBanner = 'Solid 18k gold';
    product.styles = /beloved/i.test(target.slug) ? ['hoops'] : ['chain'];
  }

  return { product };
}

async function main() {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'));
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const labPrices = fs.existsSync(LAB_PRICES_PATH)
    ? JSON.parse(fs.readFileSync(LAB_PRICES_PATH, 'utf8'))
    : {};

  const reviewRes = await fetch(REVIEW_API, { headers: { accept: 'application/json' } });
  if (!reviewRes.ok) throw new Error(`Review API ${reviewRes.status}`);
  const reviews = (await reviewRes.json()).reviews || {};

  const added = [];
  const skipped = [];

  for (const target of TARGETS) {
    if (ONLY && !ONLY.has(target.handle) && !ONLY.has(target.slug)) continue;

    if (bySlug.has(target.slug)) {
      skipped.push(`${target.slug} (already exists)`);
      continue;
    }

    const review = reviews[target.handle] || {};
    const labPrice = labPrices[target.labPriceKey] || labPrices[target.slug];
    const price =
      (labPrice && Number(labPrice.basePriceGBP)) ||
      parseGbp(review.priceGbp);
    if (!price) {
      skipped.push(`${target.slug} (no price)`);
      continue;
    }

    console.log(`\n# ${target.title} (${target.slug}) <- ${target.handle} £${price}`);
    let available;
    try {
      available = await downloadRenders(target.handle);
    } catch (err) {
      skipped.push(`${target.slug} (download failed: ${err.message})`);
      continue;
    }
    if (!Object.keys(available).length) {
      skipped.push(`${target.slug} (no images)`);
      continue;
    }

    const result = buildProduct(target, review, available, price, labPrice);
    if (result.skip) {
      skipped.push(result.skip);
      continue;
    }

    if (!DRY_RUN) {
      products.push(result.product);
      bySlug.set(target.slug, result.product);
    }
    added.push(`${target.title} £${price}`);
  }

  if (!DRY_RUN && added.length) {
    fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2) + '\n');
  }

  console.log(`\n${DRY_RUN ? '(dry run) ' : ''}Added ${added.length}:`);
  added.forEach((a) => console.log(`  + ${a}`));
  if (skipped.length) {
    console.log(`Skipped ${skipped.length}:`);
    skipped.forEach((s) => console.log(`  - ${s}`));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
