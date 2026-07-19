#!/usr/bin/env node
// Download per-metal render shots from TMC Shopify product JSON and update
// galleryByMetal in products.json for imported rings.
//
// TMC stores separate Yellow / White / Rose renders in the image list
// (e.g. Top_5723_Yellow_00000.jpg, Top_5723_White_00000.jpg).
//
// Usage: node scripts/import-tmc-metal-images.mjs

import fs from 'node:fs';
import path from 'node:path';

const STORE = 'https://tmcfinejewellers.com';
const ROOT = process.cwd();
const PRODUCTS_PATH = path.join(ROOT, 'public/data/products.json');
const MANIFEST_PATH = path.join(ROOT, 'public/data/tmc-import-manifest.json');
const IMAGE_WIDTH = 1600;

const METAL_RULES = [
  {
    elysiumKey: '18k Yellow Gold',
    fileKey: 'yellow',
    patterns: [/_Yellow_/i, /Yellow1080_/i],
  },
  {
    elysiumKey: '18k Rose Gold',
    fileKey: 'rose',
    patterns: [/_Rose_/i, /Rose1080_/i],
  },
  {
    elysiumKey: '18k White Gold',
    fileKey: 'white',
    patterns: [/_White_/i, /White1080_/i],
  },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'ELYSIUM-migration/1.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

function withWidth(src) {
  const url = new URL(src);
  url.searchParams.set('width', String(IMAGE_WIDTH));
  return url.toString();
}

function pickMetalImage(images, patterns) {
  const candidates = images.filter((img) => {
    const src = img.src || '';
    const filename = src.split('/').pop() || '';
    if (!/Top_|Front_|1080_Top/i.test(filename)) return false;
    return patterns.some((p) => p.test(src));
  });
  // Prefer Top over Front, shorter filename often = primary render
  candidates.sort((a, b) => {
    const aTop = /Top_/i.test(a.src) ? 0 : 1;
    const bTop = /Top_/i.test(b.src) ? 0 : 1;
    return aTop - bTop || a.src.length - b.src.length;
  });
  return candidates[0]?.src;
}

async function downloadImage(src, destPath) {
  const res = await fetch(withWidth(src), { headers: { 'User-Agent': 'ELYSIUM-migration/1.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const contentType = res.headers.get('content-type') || '';
  const ext = contentType.includes('png') ? '.png' : '.jpg';
  const finalPath = `${destPath}${ext}`;
  fs.writeFileSync(finalPath, Buffer.from(await res.arrayBuffer()));
  return finalPath;
}

function toPublicPath(absPath) {
  return `/${path.relative(path.join(ROOT, 'public'), absPath).split(path.sep).join('/')}`;
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'));
  const slugByHandle = Object.fromEntries(
    products
      .filter((p) => p.images?.some((img) => img.includes('tmc-import')))
      .map((p) => {
        const handle = p.images[0].match(/tmc-import\/([^/]+)/)?.[1];
        return handle ? [handle, p.slug] : null;
      })
      .filter(Boolean)
  );

  console.log('Importing TMC per-metal renders...\n');

  for (const entry of manifest.products) {
    const handle = entry.handle;
    const slug = slugByHandle[handle];
    if (!slug) {
      console.log(`- skip ${handle} (no matching product slug)`);
      continue;
    }

    const productJson = await fetchJson(`${STORE}/products/${handle}.json`);
    const shopifyImages = productJson.product.images || [];
    const productDir = path.join(ROOT, 'public/products/tmc-import', handle);
    fs.mkdirSync(productDir, { recursive: true });

    const galleryByMetal = {};
    console.log(`- ${entry.title} (${slug})`);

    for (const rule of METAL_RULES) {
      const src = pickMetalImage(shopifyImages, rule.patterns);
      if (!src) {
        console.log(`    missing ${rule.elysiumKey}`);
        continue;
      }
      const destBase = path.join(productDir, `metal-${rule.fileKey}`);
      const saved = await downloadImage(src, destBase);
      const publicPath = toPublicPath(saved);
      galleryByMetal[rule.elysiumKey] = [publicPath];
      console.log(`    ok  ${rule.elysiumKey} -> ${publicPath}`);
      await sleep(200);
    }

    // Platinum shares white/silver renders on ELYSIUM
    if (galleryByMetal['18k White Gold']) {
      galleryByMetal.Platinum = [...galleryByMetal['18k White Gold']];
    }

    const product = products.find((p) => p.slug === slug);
    if (product) {
      product.galleryByMetal = galleryByMetal;
      // Keep lifestyle shots in base images; metal picker uses galleryByMetal first
      if (!product.isHidden) product.isHidden = true;
    }

    await sleep(300);
  }

  fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2) + '\n');
  console.log('\nUpdated galleryByMetal + isHidden in products.json');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
