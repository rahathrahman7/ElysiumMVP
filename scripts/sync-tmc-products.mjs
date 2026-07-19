#!/usr/bin/env node
// Sync the TMC pilot rings into ELYSIUM's public/data/products.json.
//
// Reads the review manifest produced by import-tmc-images.mjs, combines it with
// a curated data map (cleaned titles/descriptions/shape/style/price tier), and
// appends new product entries using the catalog's standard option arrays.
//
// Notes / decisions:
// - Prices: TMC exposes AUD "setting-only" prices (center stone excluded).
//   ELYSIUM's basePriceGBP is a complete-ring price (~£3,250+, stone included),
//   so we align imported rings to ELYSIUM's existing pricing tiers rather than
//   copying TMC's setting prices. Tiers are placeholders for you to confirm.
// - Imagery: TMC gallery shots we pulled are 18k Yellow Gold only. Entries use
//   those as base `images`; the metal selector still offers all metals and the
//   gallery resolver falls back to these images until per-metal shots exist.
//
// Usage: node scripts/sync-tmc-products.mjs [--dry-run]

import fs from 'node:fs';
import path from 'node:path';

const DRY_RUN = process.argv.includes('--dry-run');
const ROOT = process.cwd();
const PRODUCTS_PATH = path.join(ROOT, 'public/data/products.json');
const MANIFEST_PATH = path.join(ROOT, 'public/data/tmc-import-manifest.json');
const REVIEW_CATALOG_PATH = path.join(ROOT, 'public/data/tmc-review-catalog.json');

// Guard: TMC handles we already stock as ELYSIUM originals. These must never be
// re-imported (would duplicate an original) and existing products are never
// overwritten. Sourced from the review catalog's `owned` flags.
function loadOwnedHandles() {
  const owned = new Map();
  try {
    const catalog = JSON.parse(fs.readFileSync(REVIEW_CATALOG_PATH, 'utf8'));
    for (const ring of catalog) {
      if (ring.owned && ring.handle) owned.set(ring.handle, ring.elysiumTitle || 'existing ELYSIUM original');
    }
  } catch {
    // Review catalog is optional; slug-collision guard still protects originals.
  }
  return owned;
}

// Shared option arrays — identical to the existing signature engagement rings.
const METALS = [
  { name: '18k Yellow Gold', hex: '#FFD700', priceDeltaGBP: 0, imageUrl: '/icons/swatches/goldswatch.png' },
  { name: '18k Rose Gold', hex: '#B76E79', priceDeltaGBP: 0, imageUrl: '/icons/swatches/rosegoldswatch.png' },
  { name: '18k White Gold', hex: '#FAF9F6', priceDeltaGBP: 0, imageUrl: '/icons/swatches/whitegoldswatch.png' },
  { name: 'Platinum', hex: '#E5E4E2', priceDeltaGBP: 75, imageUrl: '/icons/swatches/platinumswatch.png' },
  { name: 'Two-Tone Rose/Platinum', hex: '#B76E79', priceDeltaGBP: 50, imageUrl: '/icons/swatches/rosegoldplatinumswatch.png' },
  { name: 'Two-Tone Yellow/Platinum', hex: '#D4AF37', priceDeltaGBP: 50, imageUrl: '/icons/swatches/goldplatinumswatch.png' },
];

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
  'F', 'F 1/2', 'G', 'G 1/2', 'H', 'H 1/2', 'I', 'I 1/2', 'J', 'J 1/2',
  'K', 'K 1/2', 'L', 'L 1/2', 'M', 'M 1/2', 'N', 'N 1/2', 'O', 'O 1/2',
  'P', 'P 1/2', 'Q', 'Q 1/2', 'R', 'R 1/2', 'S', 'S 1/2', 'T', 'T 1/2',
  'U', 'U 1/2', 'V', 'V 1/2', 'W', 'W 1/2', 'X', 'X 1/2', 'Y', 'Y 1/2',
  'Z', 'Z+1', 'Z+2', 'Z+3', 'Z+4',
];

const CARAT_BUCKETS = ['1-1.5', '1.5-2', '2-2.5', '2.5-3', '3plus'];
const QUALITY_BANNER = 'D–F colour • VS1+ clarity • GIA/IGI certified';
const STONE_BLOCK =
  '\n\nMetals: 18k Yellow, 18k Rose, 18k White, Platinum.\n\nDiamonds: D–F colour, VS1+ clarity.\n\nCertification: GIA or IGI.';

// Curated per-ring data. Keyed by the TMC handle used in the manifest.
// tier: 'solitaire' => £3,250, 'accented'/'trilogy' => £3,450.
const CURATION = {
  'the-luise-ring-oval-solitaire': {
    slug: 'luise-oval-solitaire',
    title: 'Luise — Oval Solitaire',
    blurb: 'Modern classic oval solitaire in a delicate basket setting.',
    description:
      'Luise is a modern classic featuring an oval-cut lab-grown gemstone meticulously crafted in a basket setting, blending style and femininity with a millennial twist.',
    shape: 'oval',
    styles: ['solitaire', 'basket'],
    collections: ['engagement-rings', 'signature-collection', 'solitaire', 'oval'],
    tier: 'solitaire',
    featured: true,
  },
  'the-amira-ring-1': {
    slug: 'amira-oval-marquise-accents',
    title: 'Amira — Oval with Marquise Accents',
    blurb: 'Oval solitaire with a twisted band and marquise accent stones.',
    description:
      'Amira features an oval lab-grown gemstone in a cathedral setting with a twisted band, adorned with four intricately set marquise accent stones. Since its inception, Amira has prevailed as one of our most coveted original designs.',
    shape: 'oval',
    styles: ['accented', 'twisted-band'],
    collections: ['engagement-rings', 'signature-collection', 'accented', 'oval'],
    tier: 'accented',
    featured: true,
  },
  'the-audrey-ring-emerald-solitaire': {
    slug: 'audrey-emerald-solitaire',
    title: 'Audrey — Emerald Solitaire',
    blurb: 'Emerald-cut step-faceted solitaire in a divine basket setting.',
    description:
      'Audrey features a beautiful emerald-cut lab-grown gemstone with step-cut faceting, elegantly presented in a divine basket setting.',
    shape: 'emerald',
    styles: ['solitaire', 'basket'],
    collections: ['engagement-rings', 'signature-collection', 'solitaire', 'emerald'],
    tier: 'solitaire',
    featured: true,
  },
  'the-vienna-ring-radiant-solitaire': {
    slug: 'vienna-radiant-solitaire',
    title: 'Vienna — Radiant Solitaire',
    blurb: 'Radiant-cut solitaire with a captivating modern silhouette.',
    description:
      'Vienna dazzles with a radiant-cut lab-grown gemstone in a stunning basket setting, creating a modern and captivating look.',
    shape: 'radiant',
    styles: ['solitaire', 'basket'],
    collections: ['engagement-rings', 'signature-collection', 'solitaire', 'radiant'],
    tier: 'solitaire',
    featured: true,
  },
  'the-florence-ring-oval-and-pear-trilogy': {
    slug: 'florence-oval-pear-trilogy',
    title: 'Florence — Oval & Pear Trilogy',
    blurb: 'Oval centre with pear side stones — past, present, future.',
    description:
      "Florence features an oval centre stone and two pear side stones, each gemstone representing 'the past, the present, and the future'.",
    shape: 'oval',
    styles: ['trilogy', 'accented'],
    collections: ['engagement-rings', 'signature-collection', 'trilogy', 'oval'],
    tier: 'trilogy',
    featured: true,
  },
  'the-ophelia-ring-elongated-cushion-solitaire': {
    slug: 'ophelia-elongated-cushion-solitaire',
    title: 'Ophelia — Elongated Cushion Solitaire',
    blurb: 'Elongated cushion solitaire blending oval and rectangular lines.',
    description:
      'Ophelia features an elongated cushion-cut lab-grown gemstone in a beautiful basket setting, offering a unique blend of oval and rectangular stone shapes.',
    shape: 'cushion',
    styles: ['solitaire', 'basket'],
    collections: ['engagement-rings', 'signature-collection', 'solitaire', 'cushion'],
    tier: 'solitaire',
    featured: true,
  },
  'the-avery-ring-oval-with-marquise-and-round-brilliant-band': {
    slug: 'avery-oval-marquise-band',
    title: 'Avery — Oval with Marquise & Round Brilliant Band',
    blurb: 'Oval solitaire on a band lined with marquise and round brilliants.',
    description:
      'Avery offers a stunning twist on the modern classic oval solitaire, featuring a detailed band lined with marquise and round brilliant stones.',
    shape: 'oval',
    styles: ['accented', 'pave-band'],
    collections: ['engagement-rings', 'signature-collection', 'accented', 'oval'],
    tier: 'accented',
    featured: false,
  },
  'the-arie-ring-marquise-cut-solitaire': {
    slug: 'arie-marquise-solitaire',
    title: 'Arie — Marquise Solitaire',
    blurb: 'Striking elongated marquise solitaire in a basket setting.',
    description:
      'Arie boasts a striking elongated design, with a captivating marquise-cut lab-grown gemstone nestled in a stunning basket setting for a chic and contemporary solitaire appeal.',
    shape: 'marquise',
    styles: ['solitaire', 'basket'],
    collections: ['engagement-rings', 'signature-collection', 'solitaire', 'marquise'],
    tier: 'solitaire',
    featured: false,
  },
  'the-isla-ring-round-solitaire-new': {
    slug: 'isla-round-solitaire',
    title: 'Isla — Round Solitaire',
    blurb: 'Forever-classic round solitaire in a basket setting.',
    description:
      'A forever classic, Isla features a round-cut lab-grown gemstone in a stunning basket setting — a mesmerising heirloom piece.',
    shape: 'round',
    styles: ['solitaire', 'basket'],
    collections: ['engagement-rings', 'signature-collection', 'solitaire', 'round'],
    tier: 'solitaire',
    featured: false,
  },
  'the-sophia-ring-4-claw-pear-solitaire': {
    slug: 'sophia-pear-solitaire',
    title: 'Sophia — Pear Solitaire',
    blurb: 'Pear-cut solitaire balancing simplicity and sophistication.',
    description:
      'Sophia features a pear-cut lab-grown gemstone set in an exquisite basket setting, achieving the perfect balance between simplicity and sophistication.',
    shape: 'pear',
    styles: ['solitaire', 'basket'],
    collections: ['engagement-rings', 'signature-collection', 'solitaire', 'pear'],
    tier: 'solitaire',
    featured: false,
  },
};

const TIER_PRICE = { solitaire: 3250, accented: 3450, trilogy: 3450 };

function buildProduct(manifestEntry, curation) {
  const images = manifestEntry.images.map((img) => img.localPath);
  return {
    slug: curation.slug,
    title: curation.title,
    blurb: curation.blurb,
    description: curation.description + STONE_BLOCK,
    images,
    basePriceGBP: TIER_PRICE[curation.tier],
    metals: METALS,
    origins: ORIGINS,
    carats: CARATS,
    colours: COLOURS,
    clarities: CLARITIES,
    certificates: CERTIFICATES,
    engravingFeeGBP: 0,
    engravingMaxChars: 24,
    sizes: SIZES,
    qualityBanner: QUALITY_BANNER,
    isFeatured: curation.featured,
    isHidden: true,
    collections: curation.collections,
    shape: curation.shape,
    styles: curation.styles,
    caratBuckets: CARAT_BUCKETS,
    galleryByMetal: { '18k Yellow Gold': images },
    seoTitle: `${curation.title} | ELYSIUM`,
    seoDescription: curation.blurb,
  };
}

function main() {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'));
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

  const existingSlugs = new Set(products.map((p) => p.slug));
  const ownedHandles = loadOwnedHandles();
  const added = [];
  const skipped = [];

  for (const entry of manifest.products) {
    const curation = CURATION[entry.handle];
    if (!curation) {
      skipped.push(`${entry.handle} (no curation)`);
      continue;
    }
    // Never override or duplicate an existing product.
    if (existingSlugs.has(curation.slug)) {
      skipped.push(`${curation.slug} (already exists — original preserved)`);
      continue;
    }
    // Never re-import a TMC ring we already stock as an ELYSIUM original.
    if (ownedHandles.has(entry.handle)) {
      skipped.push(`${entry.handle} (already stocked as "${ownedHandles.get(entry.handle)}")`);
      continue;
    }
    const product = buildProduct(entry, curation);
    products.push(product);
    existingSlugs.add(curation.slug);
    added.push(`${curation.slug} — £${product.basePriceGBP} — ${product.images.length} images`);
  }

  console.log('TMC -> ELYSIUM catalog sync');
  console.log(`  existing products : ${products.length - added.length}`);
  console.log(`  added             : ${added.length}`);
  added.forEach((a) => console.log(`    + ${a}`));
  if (skipped.length) {
    console.log(`  skipped           : ${skipped.length}`);
    skipped.forEach((s) => console.log(`    - ${s}`));
  }
  console.log(`  total products    : ${products.length}`);

  if (DRY_RUN) {
    console.log('\n(dry run — products.json not written)');
    return;
  }

  fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2) + '\n');
  console.log('\nWrote', PRODUCTS_PATH);
}

main();
