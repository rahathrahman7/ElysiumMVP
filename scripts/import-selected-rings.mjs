#!/usr/bin/env node
/**
 * Import client-selected TMC rings into the live catalog.
 *
 * Reads the client's review selections from the production API, and for every
 * ring the client marked "Add to ELYSIUM" (keep === true) that also has a name
 * and a resolvable price, builds a full product entry in public/data/products.json
 * using the names, prices, notes, and configurator options they chose.
 *
 * Idempotent by default: existing slugs are skipped.
 * Pass --update to refresh existing slugs (options, images, copy); preserves
 * an existing basePriceGBP when the review price is non-numeric.
 *
 * When priceGbp is non-numeric (e.g. "Check Spreadsheet"), falls back to
 * TMC AUD × AUD_TO_GBP_FACTOR (default 1.86, calibrated to Lumina £2350 / A$1264),
 * rounded to the nearest £50 — logged as a provisional price.
 *
 * Prices: when public/data/tmc-lab-prices.json exists (generated from the client
 * Lab Prices xlsx), its per-slug basePriceGBP + carat deltas take precedence over
 * the review price and the AUD fallback.
 *
 * Usage:
 *   node scripts/import-selected-rings.mjs [--dry-run] [--update] [--only=handle-or-slug,...]
 *   REVIEW_API=http://localhost:3000/api/tmc-review node scripts/import-selected-rings.mjs
 */

import fs from 'node:fs';
import path from 'node:path';

const DRY_RUN = process.argv.includes('--dry-run');
const UPDATE = process.argv.includes('--update');
/** Restrict the run to a comma-separated list of TMC handles and/or product slugs. */
const ONLY = (() => {
  const raw = process.argv.find((a) => a.startsWith('--only='))?.split('=')[1];
  if (!raw) return null;
  return new Set(raw.split(',').map((s) => s.trim()).filter(Boolean));
})();
const ROOT = process.cwd();
const PRODUCTS_PATH = path.join(ROOT, 'public/data/products.json');
const REVIEW_CATALOG_PATH = path.join(ROOT, 'public/data/tmc-review-catalog.json');
/** Optional client price book: slug -> { basePriceGBP, caratDeltas }. Generated from Lab Prices xlsx. */
const LAB_PRICES_PATH = path.join(ROOT, 'public/data/tmc-lab-prices.json');
const SRC_IMAGES_DIR = path.join(ROOT, 'exports/tmc-ring-catalog/images');
const PUBLIC_IMAGES_ROOT = path.join(ROOT, 'public/products/tmc-import');
const REVIEW_API = process.env.REVIEW_API || 'https://elysium-mvp.vercel.app/api/tmc-review';
/** Calibrated from Lumina: £2350 / A$1264 */
const AUD_TO_GBP_FACTOR = Number(process.env.AUD_TO_GBP_FACTOR || '1.86');

// --- Standard option templates (mirrors an existing original product) -------

const METAL_TEMPLATE = {
  '18k Yellow Gold': { hex: '#FFD700', priceDeltaGBP: 0, imageUrl: '/icons/swatches/goldswatch.png' },
  '18k Rose Gold': { hex: '#B76E79', priceDeltaGBP: 0, imageUrl: '/icons/swatches/rosegoldswatch.png' },
  '18k White Gold': { hex: '#FAF9F6', priceDeltaGBP: 0, imageUrl: '/icons/swatches/whitegoldswatch.png' },
  'Platinum': { hex: '#E5E4E2', priceDeltaGBP: 75, imageUrl: '/icons/swatches/platinumswatch.png' },
  'Two-Tone Rose/Platinum': { hex: '#B76E79', priceDeltaGBP: 50, imageUrl: '/icons/swatches/rosegoldplatinumswatch.png' },
  'Two-Tone Yellow/Platinum': { hex: '#D4AF37', priceDeltaGBP: 50, imageUrl: '/icons/swatches/goldplatinumswatch.png' },
};

// Client metal label -> product metal name
const METAL_LABEL_MAP = {
  'Yellow Gold': '18k Yellow Gold',
  'Rose Gold': '18k Rose Gold',
  'White Gold': '18k White Gold',
  'Platinum': 'Platinum',
  'Two-Tone Rose/Platinum': 'Two-Tone Rose/Platinum',
  'Two-Tone Yellow/Platinum': 'Two-Tone Yellow/Platinum',
};

// Product metal name -> which render file to use for its gallery
const METAL_RENDER = {
  '18k Yellow Gold': 'yellow.jpg',
  '18k Rose Gold': 'rose.jpg',
  '18k White Gold': 'white.jpg',
  'Platinum': 'white.jpg',
  'Two-Tone Rose/Platinum': 'rose.jpg',
  'Two-Tone Yellow/Platinum': 'yellow.jpg',
};

const ORIGINS = [
  { label: 'Natural', priceDeltaGBP: 0 },
  { label: 'Lab Grown', priceDeltaGBP: 0 },
];
const CARATS = [
  { label: '1ct', carat: 1, priceDeltaGBP: 0 },
  { label: '1.5ct', carat: 1.5, priceDeltaGBP: 2000 },
  { label: '2ct', carat: 2, priceDeltaGBP: 5000 },
  { label: '2.5ct', carat: 2.5, priceDeltaGBP: 8000 },
  { label: '3ct+', carat: 3, priceDeltaGBP: 12000 },
];
const COLOURS = [
  { label: 'D', priceDeltaGBP: 500 },
  { label: 'E', priceDeltaGBP: 250 },
  { label: 'F', priceDeltaGBP: 0 },
];
const CLARITIES = [
  { label: 'IF', priceDeltaGBP: 1000 },
  { label: 'VVS1', priceDeltaGBP: 500 },
  { label: 'VVS2', priceDeltaGBP: 250 },
  { label: 'VS1', priceDeltaGBP: 0 },
];
const CERTIFICATES = [
  { label: 'GIA', priceDeltaGBP: 300 },
  { label: 'IGI', priceDeltaGBP: 0 },
];
const SIZES = [
  'F', 'F 1/2', 'G', 'G 1/2', 'H', 'H 1/2', 'I', 'I 1/2', 'J', 'J 1/2', 'K', 'K 1/2',
  'L', 'L 1/2', 'M', 'M 1/2', 'N', 'N 1/2', 'O', 'O 1/2', 'P', 'P 1/2', 'Q', 'Q 1/2',
  'R', 'R 1/2', 'S', 'S 1/2', 'T', 'T 1/2', 'U', 'U 1/2', 'V', 'V 1/2', 'W', 'W 1/2',
  'X', 'X 1/2', 'Y', 'Y 1/2', 'Z', 'Z+1', 'Z+2', 'Z+3', 'Z+4',
];
const CARAT_BUCKETS = ['1-1.5', '1.5-2', '2-2.5', '2.5-3', '3plus'];
const QUALITY_BANNER = 'D\u2013F colour \u2022 VS1+ clarity \u2022 GIA/IGI certified';

const SHAPE_WORDS = ['radiant', 'pear', 'oval', 'round', 'marquise', 'emerald', 'cushion', 'asscher', 'princess'];

// --- Helpers ----------------------------------------------------------------

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // strip combining diacritics (Noémi → noemi)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function firstSentence(text) {
  if (!text) return '';
  const m = text.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : text).trim();
}

function pickFrom(template, selected) {
  if (!selected || selected.length === 0) return [];
  const set = new Set(selected);
  return template.filter((o) => set.has(o.label));
}

function detectShape(name) {
  const n = name.toLowerCase();
  return SHAPE_WORDS.find((s) => n.includes(s)) || '';
}

function detectStyles(name, metals) {
  const n = name.toLowerCase();
  const styles = [];
  if (n.includes('halo')) styles.push('halo');
  if (n.includes('trilogy')) styles.push('trilogy');
  if (n.includes('solitaire')) styles.push('solitaire');
  if (n.includes('pav')) styles.push('pave');
  if (n.includes('marquise')) styles.push('marquise');
  if (n.includes('toi et moi')) styles.push('toi-et-moi');
  if (metals.some((m) => m.startsWith('Two-Tone'))) styles.push('two-tone');
  return [...new Set(styles)];
}

/** Parse a GBP price string; returns null if not a usable number. */
function parseGbpPrice(raw) {
  const s = String(raw ?? '').trim();
  if (!s) return null;
  // Reject placeholder text like "Check Spreadsheet"
  if (!/\d/.test(s)) return null;
  const n = Number(s.replace(/[^0-9.]/g, ''));
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

/** Provisional GBP from TMC AUD, rounded to nearest £50. */
function gbpFromAud(audRaw) {
  const aud = Number(String(audRaw ?? '').replace(/[^0-9.]/g, ''));
  if (!Number.isFinite(aud) || aud <= 0) return null;
  return Math.round((aud * AUD_TO_GBP_FACTOR) / 50) * 50;
}

function resolvePrice(review, catalogEntry, existingProduct, labPrice) {
  // Client price book (Lab Prices xlsx) wins — it is the source of truth for GBP.
  if (labPrice && Number(labPrice.basePriceGBP) > 0) {
    return { price: Number(labPrice.basePriceGBP), source: 'lab-prices' };
  }
  const parsed = parseGbpPrice(review.priceGbp);
  if (parsed != null) {
    return { price: parsed, source: 'review-gbp' };
  }
  // Preserve existing catalog price when updating and review has no numeric GBP
  if (existingProduct && Number(existingProduct.basePriceGBP) > 0) {
    return { price: Number(existingProduct.basePriceGBP), source: 'existing-catalog' };
  }
  const fromAud = gbpFromAud(catalogEntry?.tmcPriceAud);
  if (fromAud != null) {
    return { price: fromAud, source: `aud×${AUD_TO_GBP_FACTOR} (provisional)` };
  }
  return { price: null, source: null };
}

async function fetchReviews() {
  const res = await fetch(REVIEW_API, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`Review API ${res.status} ${res.statusText}`);
  const json = await res.json();
  return json.reviews || {};
}

function copyRenders(handle) {
  const srcDir = path.join(SRC_IMAGES_DIR, handle);
  if (!fs.existsSync(srcDir)) return null;
  const destDir = path.join(PUBLIC_IMAGES_ROOT, handle);
  const available = {};
  // Top render (primary) plus its matching Front angle, per metal colour.
  for (const color of ['yellow', 'white', 'rose']) {
    for (const file of [`${color}.jpg`, `${color}-front.jpg`]) {
      const src = path.join(srcDir, file);
      if (!fs.existsSync(src)) continue;
      if (!DRY_RUN) {
        fs.mkdirSync(destDir, { recursive: true });
        fs.copyFileSync(src, path.join(destDir, file));
      }
      available[file] = `/products/tmc-import/${handle}/${file}`;
    }
  }
  return Object.keys(available).length ? available : null;
}

function buildProduct(handle, review, catalogEntry, price, labPrice) {
  const title = (review.displayName || '').trim();
  const tmcName = catalogEntry?.tmcName || title;
  const category = catalogEntry?.category || '';
  const opts = review.options || {};

  const available = copyRenders(handle);
  if (!available) return { skip: `${handle} (no render images)` };

  // Ordered image list: yellow, white, rose (whichever exist)
  const images = ['yellow.jpg', 'white.jpg', 'rose.jpg']
    .filter((f) => available[f])
    .map((f) => available[f]);

  // Metals the client chose, mapped and only those we have a render for
  const metalNames = (opts.metals || ['Yellow Gold', 'White Gold', 'Rose Gold'])
    .map((m) => METAL_LABEL_MAP[m])
    .filter(Boolean);

  const metals = metalNames
    .filter((name) => available[METAL_RENDER[name]])
    .map((name) => ({ name, ...METAL_TEMPLATE[name] }));

  if (metals.length === 0) {
    return { skip: `${handle} (no metals with available render images)` };
  }

  const galleryByMetal = {};
  for (const m of metals) {
    const file = METAL_RENDER[m.name];
    if (!available[file]) continue;
    const frontFile = file.replace(/\.jpg$/i, '-front.jpg');
    galleryByMetal[m.name] = available[frontFile]
      ? [available[file], available[frontFile]]
      : [available[file]];
  }

  const notes = (review.notes || '').trim();
  const blurb = firstSentence(notes) || `${title} — a signature ELYSIUM design.`;
  const description = notes || blurb;

  let carats = pickFrom(CARATS, opts.carats);
  if (carats.length === 0) carats = CARATS;
  // Apply per-tier deltas from the client price book (Lab Prices xlsx), by label.
  if (labPrice && labPrice.caratDeltas) {
    carats = carats.map((c) =>
      labPrice.caratDeltas[c.label] != null
        ? { ...c, priceDeltaGBP: labPrice.caratDeltas[c.label] }
        : c,
    );
  }
  const origins = pickFrom(ORIGINS, opts.origins);
  const colours = pickFrom(COLOURS, opts.colours);
  const clarities = pickFrom(CLARITIES, opts.clarities);
  const certificates = pickFrom(CERTIFICATES, opts.certificates);

  // Sensible defaults when client left option groups empty
  const shape = detectShape(tmcName);
  const styles = detectStyles(tmcName, metals.map((m) => m.name));
  const isWedding = /wedding|ceremon/i.test(category);

  const collections = [
    isWedding ? 'wedding-bands' : 'engagement-rings',
    'signature-collection',
    ...(shape ? [shape] : []),
    ...styles,
    slugify(title),
  ];

  const product = {
    slug: slugify(title),
    title,
    blurb,
    description,
    images,
    basePriceGBP: price,
    metals,
    origins: origins.length ? origins : ORIGINS,
    carats,
    colours: colours.length ? colours : COLOURS,
    clarities: clarities.length ? clarities : CLARITIES,
    certificates: certificates.length ? certificates : CERTIFICATES,
    engravingFeeGBP: 0,
    engravingMaxChars: 24,
    sizes: SIZES,
    qualityBanner: QUALITY_BANNER,
    collections: [...new Set(collections)],
    ...(shape ? { shape } : {}),
    ...(styles.length ? { styles } : {}),
    caratBuckets: CARAT_BUCKETS,
    galleryByMetal,
    seoTitle: `${title} | ELYSIUM`,
    seoDescription: blurb,
  };

  return { product };
}

async function main() {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'));
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  const reviewCatalog = JSON.parse(fs.readFileSync(REVIEW_CATALOG_PATH, 'utf8'));
  const catalogByHandle = new Map(reviewCatalog.map((r) => [r.handle, r]));

  const labPrices = fs.existsSync(LAB_PRICES_PATH)
    ? JSON.parse(fs.readFileSync(LAB_PRICES_PATH, 'utf8'))
    : {};

  const reviews = await fetchReviews();

  const added = [];
  const updated = [];
  const skipped = [];
  const priceNotes = [];

  for (const [handle, review] of Object.entries(reviews)) {
    if (!review.keep) continue;
    const name = (review.displayName || '').trim();
    if (!name) { skipped.push(`${handle} (kept but no name yet)`); continue; }

    const catalogEntry = catalogByHandle.get(handle);
    const slug = slugify(name);
    const existing = bySlug.get(slug);

    if (ONLY && !ONLY.has(handle) && !ONLY.has(slug)) continue;

    const labPrice = labPrices[slug];
    const { price, source } = resolvePrice(review, catalogEntry, existing, labPrice);
    if (price == null) {
      skipped.push(`${handle} (${name}: no GBP and no AUD fallback)`);
      continue;
    }
    if (source && source !== 'review-gbp') {
      priceNotes.push(`${name}: £${price} via ${source}`);
    }

    if (existing && !UPDATE) {
      skipped.push(`${slug} (already exists — preserved; pass --update to refresh)`);
      continue;
    }

    const result = buildProduct(handle, review, catalogEntry, price, labPrice);
    if (result.skip) { skipped.push(result.skip); continue; }

    const { product } = result;

    if (existing && UPDATE) {
      // Refresh configurator fields; never re-hide a live product
      const next = { ...existing, ...product, isHidden: false };
      delete next.isHidden; // visible in shop
      const idx = products.findIndex((p) => p.slug === slug);
      products[idx] = next;
      bySlug.set(slug, next);
      updated.push(next);
    } else {
      bySlug.set(product.slug, product);
      products.push(product);
      added.push(product);
    }
  }

  if (!DRY_RUN && (added.length || updated.length)) {
    fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2) + '\n', 'utf8');
  }

  console.log(`\n${DRY_RUN ? '[DRY RUN] ' : ''}Import complete.`);
  console.log(`Added ${added.length}:`);
  for (const p of added) {
    console.log(`  + ${p.title}  (slug: ${p.slug})  £${p.basePriceGBP}  metals: ${p.metals.length}  carats: ${p.carats ? p.carats.length : 0}`);
  }
  if (updated.length) {
    console.log(`Updated ${updated.length}:`);
    for (const p of updated) {
      console.log(`  ~ ${p.title}  (slug: ${p.slug})  £${p.basePriceGBP}  metals: ${p.metals.length}  carats: ${p.carats ? p.carats.length : 0}`);
    }
  }
  if (priceNotes.length) {
    console.log(`Price notes (${priceNotes.length}):`);
    for (const n of priceNotes) console.log(`  ! ${n}`);
  }
  if (skipped.length) {
    console.log(`Skipped ${skipped.length}:`);
    for (const s of skipped) console.log(`  - ${s}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
