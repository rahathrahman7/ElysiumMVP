#!/usr/bin/env node
/**
 * Apply client "replace images" instructions from the TMC review configurator.
 *
 * Three Keep entries in /api/tmc-review are replacement instructions (not new
 * products). This script swaps the CGI renders (Top + Front per metal) from the
 * chosen TMC source ring onto the existing ELYSIUM product, and applies the
 * associated copy / pricing / UI changes:
 *
 *   Vienna radiant solitaire   -> Clarion   (yellow / white / rose)
 *   Eloise antique halo        -> Aveline   (+ remove Hidden Halo treatment)
 *   Noa radiant+trillion       -> Orabella  (+ carat prices £1k less per tier)
 *
 * Downloads land in each product's existing public folder; old front/side/back
 * files are left in place (unreferenced) so they can be restored if needed.
 *
 * Usage:
 *   node scripts/replace-ring-images-from-tmc.mjs [--dry-run]
 */

import fs from 'node:fs';
import path from 'node:path';

const DRY_RUN = process.argv.includes('--dry-run');
const ONLY = process.argv.find((a) => a.startsWith('--only='))?.split('=')[1];
const STORE = 'https://tmcfinejewellers.com';
const ROOT = process.cwd();
const PRODUCTS_PATH = path.join(ROOT, 'public/data/products.json');
const IMAGE_WIDTH = 1600;

const LIFESTYLE_RE = /TMCFineJewellers|TMCFineJeweller|TMCFJ|TMCHR|ecomm-|FineJeweller-/i;
const COLOR_PATTERNS = {
  yellow: /[_/]Yellow(?:_|1080)/i,
  white: /[_/]White(?:_|1080)/i,
  rose: /[_/]Rose(?:_|1080)/i,
};

// Product metal name -> source colour used for its gallery.
const METAL_FOR_COLOR = {
  yellow: ['18k Yellow Gold', 'Two-Tone Yellow/Platinum'],
  white: ['18k White Gold', 'Platinum'],
  rose: ['18k Rose Gold', 'Two-Tone Rose/Platinum'],
};

const TARGETS = [
  {
    slug: 'clarion-engagement-ring',
    // Signature Vienna radiant solitaire (setting 5845) carries full yellow /
    // white / rose renders, so all metals come from the one product.
    handle: 'the-vienna-ring-radiant-solitaire',
    dir: 'public/products/Clarion',
    prefix: 'clarion-tmc',
    colors: ['yellow', 'white', 'rose'],
    updatePrimaryImages: true,
    primaryColor: 'yellow',
  },
  {
    slug: 'aveline-radiant-solitaire',
    handle: 'the-eloise-ring-radiant-antique-halo',
    dir: 'public/products/Aveline',
    prefix: 'aveline-tmc',
    colors: ['yellow', 'white', 'rose'],
    updatePrimaryImages: true,
    primaryColor: 'yellow',
    removeHiddenHalo: true,
    blurb: 'Radiant solitaire with an antique-style halo and four talon-tipped claws.',
    description:
      'Stunning in its simplicity, the Aveline engagement ring is a classic radiant solitaire design featuring four talon-tipped claws and an antique style halo.\n\nA harmonious fusion of two timeless designs, thoughtfully crafted into an heirloom destined to be cherished for generations.\n\nMetals: 18k Yellow, 18k Rose, 18k White, Platinum.\n\nDiamonds: D\u2013F colour, VS1+ clarity.\n\nCertification: GIA or IGI.',
    seoDescription:
      'Aveline radiant solitaire with an antique-style halo and four talon-tipped claws.',
  },
  {
    slug: 'orabella-toi-et-moi',
    handle: 'the-noa-ring-radiant-and-trilliant-trilogy',
    dir: 'public/products/Orabella',
    prefix: 'orabella-tmc',
    colors: ['yellow', 'white', 'rose'],
    updatePrimaryImages: true,
    primaryColor: 'yellow',
    // £1k less per carat tier, floored at 0. Declared against the ORIGINAL
    // deltas (by label) so re-runs stay idempotent.
    caratPriceDelta: -1000,
    caratOriginalGBP: { '1ct': 0, '1.5ct': 900, '2ct': 1560, '2.5ct': 2460, '3ct+': 12000 },
  },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url, attempts = 3) {
  for (let n = 1; n <= attempts; n++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'ELYSIUM-replace/1.0' } });
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
  const res = await fetch(withWidth(src), { headers: { 'User-Agent': 'ELYSIUM-replace/1.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const contentType = res.headers.get('content-type') ?? '';
  const buffer = Buffer.from(await res.arrayBuffer());
  const finalPath = `${destBase}${extFrom(src, contentType)}`;
  fs.writeFileSync(finalPath, buffer);
  return { finalPath, bytes: buffer.length };
}

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

function candidates(images, color, angleRe) {
  const colorRe = COLOR_PATTERNS[color];
  return images
    .map((img) => img.src || '')
    .filter((src) => src && !LIFESTYLE_RE.test(src) && angleRe.test(src) && colorRe.test(src));
}

function pickTop(images, color) {
  const tops = candidates(images, color, /Top_|1080_Top/i);
  tops.sort((a, b) => a.length - b.length);
  return tops[0];
}

function pickFront(images, color, topSrc) {
  const fronts = candidates(images, color, /Front_|1080_Front/i);
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

function toPublicPath(dir, filename) {
  const rel = path.relative(path.join(ROOT, 'public'), path.join(ROOT, dir, filename));
  return `/${rel.split(path.sep).join('/')}`;
}

async function processTarget(products, target) {
  const product = products.find((p) => p.slug === target.slug);
  if (!product) {
    console.log(`! ${target.slug}: product not found — skipping`);
    return;
  }

  const destDir = path.join(ROOT, target.dir);
  if (!DRY_RUN) fs.mkdirSync(destDir, { recursive: true });

  // Images may come from one handle, or from a different handle per colour
  // (TMC sells some colour variants as separate one-off products).
  const imagesByHandle = new Map();
  async function imagesFor(handle) {
    if (!imagesByHandle.has(handle)) {
      const shopify = await fetchJson(`${STORE}/products/${handle}.json`);
      imagesByHandle.set(handle, shopify.product?.images || []);
    }
    return imagesByHandle.get(handle);
  }

  const sourceLabel = target.colorSources
    ? Object.entries(target.colorSources).map(([c, h]) => `${c}:${h}`).join(', ')
    : target.handle;
  console.log(`\n# ${product.title} (${target.slug}) <- ${sourceLabel}`);

  const galleryByColor = {};
  for (const color of target.colors) {
    const handle = target.colorSources?.[color] || target.handle;
    const images = await imagesFor(handle);
    const topSrc = pickTop(images, color);
    const frontSrc = pickFront(images, color, topSrc);
    if (!topSrc) {
      console.log(`  ${color}: no Top render — skipped`);
      continue;
    }

    const topName = `${target.prefix}-${color}`;
    const frontName = `${target.prefix}-${color}-front`;
    let topPublic;
    let frontPublic;

    if (DRY_RUN) {
      topPublic = toPublicPath(target.dir, `${topName}${extFrom(topSrc, '')}`);
      frontPublic = frontSrc ? toPublicPath(target.dir, `${frontName}${extFrom(frontSrc, '')}`) : undefined;
      console.log(`  ${color}: Top -> ${path.basename(topPublic)}${frontPublic ? `, Front -> ${path.basename(frontPublic)}` : ' (no Front)'}`);
    } else {
      const top = await download(topSrc, path.join(destDir, topName));
      topPublic = toPublicPath(target.dir, path.basename(top.finalPath));
      let sizeMsg = `Top ${(top.bytes / 1024).toFixed(0)} KB`;
      await sleep(150);
      if (frontSrc) {
        const front = await download(frontSrc, path.join(destDir, frontName));
        frontPublic = toPublicPath(target.dir, path.basename(front.finalPath));
        sizeMsg += `, Front ${(front.bytes / 1024).toFixed(0)} KB`;
        await sleep(150);
      }
      console.log(`  ${color}: ${sizeMsg}`);
    }

    galleryByColor[color] = [topPublic, ...(frontPublic ? [frontPublic] : [])];
  }

  // Wire galleryByMetal for every metal that maps to a swapped colour.
  product.galleryByMetal = product.galleryByMetal || {};
  for (const [color, gallery] of Object.entries(galleryByColor)) {
    for (const metal of METAL_FOR_COLOR[color]) {
      if (product.galleryByMetal[metal]) product.galleryByMetal[metal] = gallery;
    }
  }

  // Primary / card images.
  if (target.updatePrimaryImages && galleryByColor[target.primaryColor]) {
    product.images = galleryByColor[target.primaryColor];
  }

  // Aveline: drop Hidden Halo treatment + refresh copy.
  if (target.removeHiddenHalo) {
    if (Array.isArray(product.styles)) product.styles = product.styles.filter((s) => s !== 'hidden-halo');
    if (Array.isArray(product.collections)) product.collections = product.collections.filter((c) => c !== 'hidden-halo');
    if (target.blurb) product.blurb = target.blurb;
    if (target.description) product.description = target.description;
    if (target.seoDescription) product.seoDescription = target.seoDescription;
    console.log('  removed hidden-halo + updated copy');
  }

  // Orabella: £1k off each carat tier, floored at 0. Computed from the
  // original deltas (by label) so re-running does not stack the reduction.
  if (target.caratPriceDelta && Array.isArray(product.carats)) {
    product.carats = product.carats.map((c) => {
      const base = target.caratOriginalGBP?.[c.label];
      const from = base != null ? base : (Number(c.priceDeltaGBP) || 0);
      return { ...c, priceDeltaGBP: Math.max(0, from + target.caratPriceDelta) };
    });
    console.log('  carat deltas:', product.carats.map((c) => `${c.label}:£${c.priceDeltaGBP}`).join(' '));
  }
}

async function main() {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'));

  const targets = ONLY ? TARGETS.filter((t) => t.slug === ONLY) : TARGETS;
  console.log(`Client ring image replacements${DRY_RUN ? ' (dry run)' : ''}${ONLY ? ` — only ${ONLY}` : ''}`);
  for (const target of targets) {
    await processTarget(products, target);
    await sleep(200);
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
