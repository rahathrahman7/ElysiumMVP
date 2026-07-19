#!/usr/bin/env node
// Import ring images from the TMC Fine Jewellers Shopify store into ELYSIUM.
//
// TMC is a Shopify storefront that exposes a public read-only catalog JSON API
// (documented at https://tmcfinejewellers.com/agents.md). This script paginates
// a collection, downloads a handful of images per product into a local folder,
// and writes a review manifest. It intentionally does NOT touch
// public/data/products.json — that merge happens after human review.
//
// Usage:
//   node scripts/import-tmc-images.mjs \
//     --collection our-signature-range \
//     --limit 10 \
//     --perProduct 4 \
//     --output public/products/tmc-import \
//     --manifest public/data/tmc-import-manifest.json

import fs from 'node:fs';
import path from 'node:path';

const STORE = 'https://tmcfinejewellers.com';
const IMAGE_WIDTH = 1600; // Shopify CDN resize target to keep files reasonable

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    collection: 'our-signature-range',
    limit: 10,
    perProduct: 4,
    output: 'public/products/tmc-import',
    manifest: 'public/data/tmc-import-manifest.json',
  };
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace(/^--/, '');
    const value = args[i + 1];
    if (key === undefined || value === undefined) continue;
    if (key === 'limit' || key === 'perProduct') {
      opts[key] = parseInt(value, 10);
    } else if (key in opts) {
      opts[key] = value;
    }
  }
  return opts;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJson(url, attempts = 3) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'ELYSIUM-migration/1.0' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (attempt === attempts) throw err;
      await sleep(500 * attempt);
    }
  }
}

async function fetchCollectionProducts(collection, limit) {
  const collected = [];
  let page = 1;
  while (collected.length < limit) {
    const url = `${STORE}/collections/${collection}/products.json?limit=250&page=${page}`;
    const data = await fetchJson(url);
    const batch = data.products ?? [];
    if (batch.length === 0) break;
    collected.push(...batch);
    if (batch.length < 250) break;
    page += 1;
    await sleep(300);
  }
  return collected.slice(0, limit);
}

// Shopify CDN URLs support a `width` query param for on-the-fly resizing.
function withWidth(src, width) {
  try {
    const url = new URL(src);
    url.searchParams.set('width', String(width));
    return url.toString();
  } catch {
    return src;
  }
}

function extensionFor(src, contentType) {
  const clean = src.split('?')[0];
  const ext = path.extname(clean).toLowerCase();
  if (ext) return ext;
  if (contentType?.includes('png')) return '.png';
  if (contentType?.includes('webp')) return '.webp';
  return '.jpg';
}

// Prefer packshot/render images (they lead the gallery) then lifestyle shots.
// TMC render shots typically look like `Top_*` / `*_00000.jpg`; lifestyle shots
// look like `TMCFineJewellers-*.jpg`. We keep the store's native ordering, which
// already leads with the render, and simply cap how many we take.
function selectImages(images, perProduct) {
  return images.slice(0, perProduct);
}

async function downloadImage(src, destPath, attempts = 3) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const res = await fetch(src, { headers: { 'User-Agent': 'ELYSIUM-migration/1.0' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const contentType = res.headers.get('content-type') ?? '';
      const buffer = Buffer.from(await res.arrayBuffer());
      const ext = extensionFor(src, contentType);
      const finalPath = `${destPath}${ext}`;
      fs.writeFileSync(finalPath, buffer);
      return { finalPath, bytes: buffer.length, contentType };
    } catch (err) {
      if (attempt === attempts) throw err;
      await sleep(500 * attempt);
    }
  }
}

async function main() {
  const opts = parseArgs();
  const outputDir = path.resolve(process.cwd(), opts.output);
  const manifestPath = path.resolve(process.cwd(), opts.manifest);

  console.log('TMC image migration (pilot)');
  console.log(`  collection : ${opts.collection}`);
  console.log(`  limit      : ${opts.limit} products`);
  console.log(`  perProduct : ${opts.perProduct} images`);
  console.log(`  output     : ${opts.output}`);
  console.log(`  manifest   : ${opts.manifest}`);
  console.log('');

  const products = await fetchCollectionProducts(opts.collection, opts.limit);
  console.log(`Fetched ${products.length} products from collection.\n`);

  const manifest = {
    source: STORE,
    collection: opts.collection,
    importedAt: new Date().toISOString(),
    products: [],
  };

  let totalBytes = 0;
  let successCount = 0;
  let failCount = 0;

  for (const product of products) {
    const slug = product.handle;
    const productDir = path.join(outputDir, slug);
    fs.mkdirSync(productDir, { recursive: true });

    const selected = selectImages(product.images ?? [], opts.perProduct);
    const entry = {
      handle: slug,
      title: product.title,
      shopifyId: product.id,
      images: [],
    };

    console.log(`- ${product.title} (${slug}) — ${selected.length} images`);

    for (let i = 0; i < selected.length; i++) {
      const image = selected[i];
      const src = withWidth(image.src, IMAGE_WIDTH);
      const index = String(i + 1).padStart(2, '0');
      const destBase = path.join(productDir, index);
      try {
        const { finalPath, bytes, contentType } = await downloadImage(src, destBase);
        const localPath = `/${path.relative(path.resolve(process.cwd(), 'public'), finalPath).split(path.sep).join('/')}`;
        entry.images.push({
          localPath,
          sourceUrl: image.src,
          downloadedUrl: src,
          bytes,
          contentType,
        });
        totalBytes += bytes;
        successCount += 1;
        console.log(`    ok  ${localPath} (${(bytes / 1024).toFixed(0)} KB)`);
      } catch (err) {
        failCount += 1;
        console.log(`    FAIL ${src} — ${err.message}`);
      }
      await sleep(250);
    }

    manifest.products.push(entry);
    await sleep(300);
  }

  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log('\nSummary');
  console.log(`  products   : ${manifest.products.length}`);
  console.log(`  images ok  : ${successCount}`);
  console.log(`  images fail: ${failCount}`);
  console.log(`  total size : ${(totalBytes / (1024 * 1024)).toFixed(1)} MB`);
  console.log(`  manifest   : ${opts.manifest}`);
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
