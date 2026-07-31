#!/usr/bin/env node
/**
 * Plan (dry) execution for client TMC review Keep selections.
 *
 * Compares production (or local) /api/tmc-review Keep rows against
 * public/data/products.json and prints an actionable import plan.
 * Does NOT mutate the catalog.
 *
 * Usage:
 *   node scripts/plan-tmc-import.mjs
 *   REVIEW_API=http://localhost:3000/api/tmc-review node scripts/plan-tmc-import.mjs
 *   HANDLE=the-emilia-ring-radiant-and-pear-trilogy node scripts/plan-tmc-import.mjs
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PRODUCTS_PATH = path.join(ROOT, 'public/data/products.json');
const REVIEW_CATALOG_PATH = path.join(ROOT, 'public/data/tmc-review-catalog.json');
const SRC_IMAGES_DIR = path.join(ROOT, 'exports/tmc-ring-catalog/images');
const REVIEW_API = process.env.REVIEW_API || 'https://elysium-mvp.vercel.app/api/tmc-review';
const ONLY_HANDLE = process.env.HANDLE || '';
const WRITE = process.argv.includes('--write');

const REPLACEMENT_PATTERN =
  /\b(replace|replacing|this to replace|to replace)\b/i;

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function classify(review) {
  if (!review?.keep) return 'skip';
  const name = String(review.displayName || '').trim();
  if (!name) return 'incomplete';
  if (REPLACEMENT_PATTERN.test(name)) return 'image_replacement';
  return 'new_product';
}

async function fetchReviews() {
  try {
    const res = await fetch(REVIEW_API, { headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(`Review API ${res.status} ${res.statusText}`);
    const json = await res.json();
    return { reviews: json.reviews || {}, source: json.source || 'api' };
  } catch (error) {
    const fallbackPath = path.join(ROOT, 'public/data/tmc-reviews.json');
    if (!fs.existsSync(fallbackPath)) throw error;
    const json = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
    console.error(
      `[plan-tmc-import] Review API unavailable (${error.message}); using ${path.relative(ROOT, fallbackPath)}`
    );
    return { reviews: json.reviews || json || {}, source: 'fallback-file' };
  }
}

function loadProductsBySlug() {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'));
  const bySlug = new Map();
  for (const p of products) bySlug.set(p.slug, p);
  return bySlug;
}

function loadCatalogByHandle() {
  if (!fs.existsSync(REVIEW_CATALOG_PATH)) return new Map();
  const catalog = JSON.parse(fs.readFileSync(REVIEW_CATALOG_PATH, 'utf8'));
  const rings = catalog.rings || catalog || [];
  const byHandle = new Map();
  for (const r of Array.isArray(rings) ? rings : []) {
    if (r.handle) byHandle.set(r.handle, r);
  }
  return byHandle;
}

function hasLocalRenders(handle) {
  const dir = path.join(SRC_IMAGES_DIR, handle);
  if (!fs.existsSync(dir)) return false;
  return ['yellow.jpg', 'white.jpg', 'rose.jpg'].some((f) =>
    fs.existsSync(path.join(dir, f))
  );
}

function mainPlan() {
  return fetchReviews().then(({ reviews, source }) => {
    const bySlug = loadProductsBySlug();
    const catalog = loadCatalogByHandle();
    const entries = Object.entries(reviews).filter(([handle, r]) => {
      if (ONLY_HANDLE && handle !== ONLY_HANDLE) return false;
      return r.keep === true;
    });

    const plan = {
      generatedAt: new Date().toISOString(),
      reviewApi: REVIEW_API,
      reviewSource: source,
      totals: {
        keep: entries.length,
        new_product: 0,
        image_replacement: 0,
        incomplete: 0,
        already_in_catalog: 0,
        missing_renders: 0,
      },
      items: [],
      nextCommands: [
        'node scripts/plan-tmc-import.mjs',
        'node scripts/import-selected-rings.mjs --dry-run --update',
        'node scripts/import-selected-rings.mjs --update   # only after human approval',
      ],
    };

    for (const [handle, review] of entries.sort(([a], [b]) => a.localeCompare(b))) {
      const kind = classify(review);
      const name = String(review.displayName || '').trim();
      const slug = kind === 'new_product' ? slugify(name) : '';
      const existing = slug ? bySlug.get(slug) : null;
      const renders = hasLocalRenders(handle);
      const cat = catalog.get(handle);

      if (kind === 'new_product') plan.totals.new_product += 1;
      else if (kind === 'image_replacement') plan.totals.image_replacement += 1;
      else plan.totals.incomplete += 1;
      if (existing) plan.totals.already_in_catalog += 1;
      if (!renders) plan.totals.missing_renders += 1;

      plan.items.push({
        handle,
        kind,
        displayName: name,
        slug: slug || null,
        priceGbp: review.priceGbp || '',
        alreadyInCatalog: Boolean(existing),
        existingIsHidden: existing?.isHidden === true,
        hasLocalRenders: renders,
        tmcName: cat?.tmcName || null,
        tmcPriceAud: cat?.tmcPriceAud ?? null,
        recommendedAction:
          kind === 'image_replacement'
            ? 'Run image replacement scripts after approval (do not create a new product).'
            : kind === 'incomplete'
              ? 'Wait for client to set a display name before import.'
              : existing
                ? 'Already in catalog — re-run import with --update only if options/images/notes changed.'
                : renders
                  ? 'Ready to import after approval.'
                  : 'Missing local scrape renders — re-scrape or download images before import.',
      });
    }

    console.log(JSON.stringify(plan, null, 2));
    if (WRITE) {
      const outPath = path.join(ROOT, 'docs/TMC_IMPORT_PLAN_LATEST.json');
      fs.writeFileSync(outPath, JSON.stringify(plan, null, 2) + '\n');
      console.error(`\nWrote ${path.relative(ROOT, outPath)}`);
    }
    console.error(
      `Summary: ${plan.totals.new_product} new products, ${plan.totals.image_replacement} replacements, ${plan.totals.incomplete} incomplete, ${plan.totals.missing_renders} missing renders.`
    );
  });
}

mainPlan().catch((err) => {
  console.error(err);
  process.exit(1);
});
