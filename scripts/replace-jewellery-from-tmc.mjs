#!/usr/bin/env node
/**
 * Replace images (and apply Lab Prices + review notes) for existing earrings
 * and tennis bracelets flagged in the TMC review.
 *
 * Usage:
 *   node scripts/replace-jewellery-from-tmc.mjs [--dry-run] [--only=slug,...]
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
const REVIEW_API = process.env.REVIEW_API || 'https://elysium-mvp.vercel.app/api/tmc-review';
const STORE = 'https://tmcfinejewellers.com';
const IMAGE_WIDTH = 1600;

const LIFESTYLE_RE = /TMCFineJewellers|TMCFineJeweller|TMCFJ|TMCHR|ecomm-|FineJeweller-|Screenshot|Your_Signature|Tennis_Bracelet|BezelTennis/i;
const COLOR_PATTERNS = {
  yellow: /[_/]Yellow(?:_|1080)|Yellow1080|_Yellow_/i,
  white: /[_/]White(?:_|1080)|White1080|_White_/i,
  rose: /[_/]Rose(?:_|1080)|Rose1080|_Rose_/i,
};
const METAL_FOR_COLOR = {
  yellow: ['18k Yellow Gold', 'Two-Tone Yellow/Platinum'],
  white: ['18k White Gold', 'Platinum'],
  rose: ['18k Rose Gold', 'Two-Tone Rose/Platinum'],
};

const TARGETS = [
  { slug: 'crown-earrings', handle: 'the-iris-earrings-round-studs', dir: 'public/products/Earrings/Crown', prefix: 'crown-tmc', labPriceKey: 'crown-earrings', kind: 'earrings' },
  { slug: 'essence-earrings', handle: 'the-iris-earrings-pear-studs', dir: 'public/products/Earrings/Essence', prefix: 'essence-tmc', labPriceKey: 'essence-earrings', kind: 'earrings' },
  { slug: 'icon-earrings', handle: 'the-iris-earrings-emerald-studs', dir: 'public/products/Earrings/Icon', prefix: 'icon-tmc', labPriceKey: 'icon-earrings', kind: 'earrings' },
  { slug: 'heirloom-earrings', handle: 'the-iris-earrings-radiant-studs', dir: 'public/products/Earrings/Heirloom', prefix: 'heirloom-tmc', labPriceKey: 'heirloom-earrings', kind: 'earrings' },
  { slug: 'eternal-earrings', handle: 'the-iris-earrings-marquise-studs', dir: 'public/products/Earrings/Eternal', prefix: 'eternal-tmc', labPriceKey: 'eternal-earrings', kind: 'earrings' },
  { slug: 'legacy-earrings', handle: 'the-iris-earrings-oval-studs', dir: 'public/products/Earrings/Legacy', prefix: 'legacy-tmc', labPriceKey: 'legacy-earrings', kind: 'earrings' },
  { slug: 'pure-earrings', handle: 'the-vera-earrings-emerald-bezel-studs', dir: 'public/products/Earrings/Pure', prefix: 'pure-tmc', labPriceKey: 'pure-earrings', kind: 'earrings' },
  { slug: 'refined-earrings', handle: 'the-vera-earrings-marquise-bezel-studs', dir: 'public/products/Earrings/Refined', prefix: 'refined-tmc', labPriceKey: 'refined-earrings', kind: 'earrings' },
  { slug: 'timeless-earrings', handle: 'the-vera-earring-round-bezel-studs', dir: 'public/products/Earrings/Timeless', prefix: 'timeless-tmc', labPriceKey: 'timeless-earrings', kind: 'earrings' },
  { slug: 'classic-4-claw-tennis-bracelet', handle: 'the-signature-tennis-bracelet', dir: 'public/products/Classic 4 Claw Tennis Bracelet /tmc', prefix: 'classic-tennis-tmc', labPriceKey: 'classic-tennis', kind: 'tennis' },
  { slug: 'bezel-tennis-bracelet', handle: 'the-signature-round-bezel-tennis-bracelet', dir: 'public/products/Bezel Tennis Bracelet /tmc', prefix: 'bezel-tennis-tmc', labPriceKey: 'bezel-tennis', kind: 'tennis' },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function firstSentence(text) {
  if (!text) return '';
  const m = text.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : text).trim();
}

function withWidth(src) {
  const url = new URL(src);
  url.searchParams.set('width', String(IMAGE_WIDTH));
  return url.toString();
}

function pickAngle(srcs, color, angleRes) {
  const colorRe = COLOR_PATTERNS[color];
  const hits = srcs.filter(
    (s) => s && !LIFESTYLE_RE.test(s) && colorRe.test(s) && angleRes.some((re) => re.test(s)),
  );
  hits.sort((a, b) => a.length - b.length);
  return hits[0];
}

function caratNumber(label) {
  const m = String(label).match(/(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : 0;
}

function applyLabPrice(product, labPrice, kind) {
  if (!labPrice || !Number(labPrice.basePriceGBP)) return;
  product.basePriceGBP = Number(labPrice.basePriceGBP);
  const deltas = labPrice.caratDeltas || {};
  const labels = Object.keys(deltas).sort((a, b) => caratNumber(a) - caratNumber(b));
  if (!labels.length) return;
  product.carats = labels.map((label) => ({
    label,
    carat: caratNumber(label),
    priceDeltaGBP: deltas[label] ?? 0,
  }));
  if (kind === 'tennis') {
    // Clear old carat-specific galleries so metal gallery drives the PDP
    delete product.galleryByCaratAndMetal;
  }
}

async function processTarget(products, reviews, labPrices, target) {
  const product = products.find((p) => p.slug === target.slug);
  if (!product) {
    console.log(`! ${target.slug}: not found`);
    return;
  }
  const review = reviews[target.handle] || {};
  const labPrice = labPrices[target.labPriceKey] || labPrices[target.slug];

  console.log(`\n# ${product.title} (${target.slug}) <- ${target.handle}`);

  const res = await fetch(`${STORE}/products/${target.handle}.json`, {
    headers: { 'User-Agent': 'ELYSIUM-replace-jewellery/1.0' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${target.handle}`);
  const srcs = ((await res.json()).product?.images || []).map((i) => i.src);

  const destDir = path.join(ROOT, target.dir);
  if (!DRY_RUN) fs.mkdirSync(destDir, { recursive: true });

  const galleryByColor = {};
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
      pickAngle(srcs, color, [/Pers_|Vew3_|View3_/i]);

    const topName = `${target.prefix}-${color}.jpg`;
    const sideName = `${target.prefix}-${color}-side.jpg`;
    const topPublic = `/${path.relative(path.join(ROOT, 'public'), path.join(destDir, topName)).split(path.sep).join('/')}`;
    let sidePublic;

    if (!DRY_RUN) {
      const topRes = await fetch(withWidth(top), { headers: { 'User-Agent': 'ELYSIUM-replace-jewellery/1.0' } });
      fs.writeFileSync(path.join(destDir, topName), Buffer.from(await topRes.arrayBuffer()));
      await sleep(120);
      if (side) {
        const sideRes = await fetch(withWidth(side), { headers: { 'User-Agent': 'ELYSIUM-replace-jewellery/1.0' } });
        fs.writeFileSync(path.join(destDir, sideName), Buffer.from(await sideRes.arrayBuffer()));
        sidePublic = `/${path.relative(path.join(ROOT, 'public'), path.join(destDir, sideName)).split(path.sep).join('/')}`;
        await sleep(120);
      }
    } else {
      sidePublic = side
        ? `/${path.relative(path.join(ROOT, 'public'), path.join(destDir, sideName)).split(path.sep).join('/')}`
        : undefined;
    }

    galleryByColor[color] = [topPublic, ...(sidePublic ? [sidePublic] : [])];
    console.log(`  ${color}: Top` + (sidePublic ? ' + Side' : ''));
  }

  product.galleryByMetal = product.galleryByMetal || {};
  for (const [color, gallery] of Object.entries(galleryByColor)) {
    for (const metal of METAL_FOR_COLOR[color]) {
      if (product.metals?.some((m) => m.name === metal) || product.galleryByMetal[metal]) {
        product.galleryByMetal[metal] = gallery;
      }
    }
    // Always set the three primary metals even if gallery key was missing
    for (const metal of METAL_FOR_COLOR[color]) {
      if (['18k Yellow Gold', '18k Rose Gold', '18k White Gold'].includes(metal)) {
        product.galleryByMetal[metal] = gallery;
      }
    }
  }

  if (galleryByColor.yellow) product.images = galleryByColor.yellow;

  const notes = (review.notes || '').trim();
  if (notes) {
    product.blurb = firstSentence(notes);
    product.description = notes;
    product.seoDescription = product.blurb;
  }

  applyLabPrice(product, labPrice, target.kind);
  console.log(`  price £${product.basePriceGBP}` + (product.carats ? ` carats:${product.carats.map((c) => c.label).join(',')}` : ''));
}

async function main() {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'));
  const labPrices = fs.existsSync(LAB_PRICES_PATH)
    ? JSON.parse(fs.readFileSync(LAB_PRICES_PATH, 'utf8'))
    : {};
  const reviewRes = await fetch(REVIEW_API, { headers: { accept: 'application/json' } });
  const reviews = (await reviewRes.json()).reviews || {};

  for (const target of TARGETS) {
    if (ONLY && !ONLY.has(target.slug) && !ONLY.has(target.handle)) continue;
    await processTarget(products, reviews, labPrices, target);
  }

  if (!DRY_RUN) {
    fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2) + '\n');
    console.log(`\nUpdated ${PRODUCTS_PATH}`);
  } else {
    console.log('\n(dry run — no files written)');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
