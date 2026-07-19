#!/usr/bin/env node
// Generate a client-facing spreadsheet for reviewing TMC ring imports.
// Outputs CSV (opens in Excel) and attempts .xlsx if openpyxl is available.
//
// Usage: node scripts/generate-tmc-client-sheet.mjs

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = process.cwd();
const PRODUCTS_PATH = path.join(ROOT, 'public/data/products.json');
const MANIFEST_PATH = path.join(ROOT, 'public/data/tmc-import-manifest.json');
const OUT_DIR = path.join(ROOT, 'docs');
const CSV_PATH = path.join(OUT_DIR, 'TMC_Ring_Import_Client_Sheet.csv');
const XLSX_PATH = path.join(OUT_DIR, 'TMC_Ring_Import_Client_Sheet.xlsx');

const COLUMNS = [
  { key: 'includeOnSite', header: 'Include on ELYSIUM site? (Yes/No)' },
  { key: 'tmcOriginalName', header: 'TMC Original Name' },
  { key: 'tmcShopifyHandle', header: 'TMC Shopify Handle' },
  { key: 'elysiumTitle', header: 'ELYSIUM Site Name (Title)' },
  { key: 'elysiumSlug', header: 'ELYSIUM URL Slug' },
  { key: 'elysiumUrl', header: 'ELYSIUM Product URL (when live)' },
  { key: 'blurb', header: 'Short Tagline (Blurb)' },
  { key: 'description', header: 'Full Product Description' },
  { key: 'basePriceGBP', header: 'Base Price GBP (from, 1ct lab-grown)' },
  { key: 'featured', header: 'Featured on Homepage? (Yes/No)' },
  { key: 'shape', header: 'Stone Shape' },
  { key: 'styles', header: 'Style Tags (comma-separated)' },
  { key: 'collections', header: 'Collections (comma-separated)' },
  { key: 'metals', header: 'Available Metals (comma-separated)' },
  { key: 'carats', header: 'Carat Options (comma-separated)' },
  { key: 'origins', header: 'Stone Origin Options (Natural / Lab Grown)' },
  { key: 'colours', header: 'Diamond Colour Grades Offered' },
  { key: 'clarities', header: 'Diamond Clarity Grades Offered' },
  { key: 'certificates', header: 'Certification Options (GIA / IGI)' },
  { key: 'engraving', header: 'Engraving Available? (Yes/No)' },
  { key: 'qualityBanner', header: 'Quality Banner Text' },
  { key: 'seoTitle', header: 'SEO Page Title' },
  { key: 'seoDescription', header: 'SEO Meta Description' },
  { key: 'hasYellowImages', header: 'Has Yellow Gold Images? (Yes/No)' },
  { key: 'hasRoseImages', header: 'Has Rose Gold Images? (Yes/No)' },
  { key: 'hasWhitePlatinumImages', header: 'Has White Gold / Platinum Images? (Yes/No)' },
  { key: 'needsPhotography', header: 'Needs New Photography? (Yes/No)' },
  { key: 'clientNotes', header: 'Client Notes / Special Instructions' },
];

function csvEscape(value) {
  const str = String(value ?? '');
  if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

function hasMetalImages(product, metalKey) {
  return Boolean(product.galleryByMetal?.[metalKey]?.length);
}

function buildRows(products, manifest) {
  const handleToProduct = new Map();
  for (const p of products) {
    const handle = p.images?.[0]?.match(/tmc-import\/([^/]+)/)?.[1];
    if (handle) handleToProduct.set(handle, p);
  }

  return manifest.products.map((entry) => {
    const p = handleToProduct.get(entry.handle);
    if (!p) return null;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elysium-mvp.vercel.app';
    const hasYellow = hasMetalImages(p, '18k Yellow Gold');
    const hasRose = hasMetalImages(p, '18k Rose Gold');
    const hasWhite = hasMetalImages(p, '18k White Gold') || hasMetalImages(p, 'Platinum');

    return {
      includeOnSite: '',
      tmcOriginalName: entry.title,
      tmcShopifyHandle: entry.handle,
      elysiumTitle: p.title,
      elysiumSlug: p.slug,
      elysiumUrl: `${siteUrl}/products/${p.slug}`,
      blurb: p.blurb,
      description: p.description?.replace(/\n+/g, ' ').trim(),
      basePriceGBP: p.basePriceGBP,
      featured: p.isFeatured ? 'Yes' : 'No',
      shape: p.shape || '',
      styles: (p.styles || []).join(', '),
      collections: (p.collections || []).join(', '),
      metals: (p.metals || []).map((m) => m.name).join(', '),
      carats: (p.carats || []).map((c) => c.label).join(', '),
      origins: (p.origins || []).map((o) => o.label).join(', '),
      colours: (p.colours || []).map((c) => c.label).join(', '),
      clarities: (p.clarities || []).map((c) => c.label).join(', '),
      certificates: (p.certificates || []).map((c) => c.label).join(', '),
      engraving: p.engravingMaxChars ? 'Yes' : 'No',
      qualityBanner: p.qualityBanner,
      seoTitle: p.seoTitle || '',
      seoDescription: p.seoDescription || '',
      hasYellowImages: hasYellow ? 'Yes' : 'No',
      hasRoseImages: hasRose ? 'Yes' : 'No',
      hasWhitePlatinumImages: hasWhite ? 'Yes' : 'No',
      needsPhotography: hasYellow && hasRose && hasWhite ? 'No' : 'Yes',
      clientNotes: '',
    };
  }).filter(Boolean);
}

function writeCsv(rows) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const header = COLUMNS.map((c) => csvEscape(c.header)).join(',');
  const body = rows.map((row) => COLUMNS.map((c) => csvEscape(row[c.key])).join(',')).join('\n');
  // UTF-8 BOM helps Excel open accents correctly
  fs.writeFileSync(CSV_PATH, `\uFEFF${header}\n${body}\n`);
}

function tryWriteXlsx(rows) {
  const pyScript = `
import json, sys
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

rows = json.load(sys.stdin)
columns = json.loads(sys.argv[1])

wb = Workbook()
ws = wb.active
ws.title = "TMC Ring Import"

header_fill = PatternFill(start_color="6D3D0D", end_color="6D3D0D", fill_type="solid")
header_font = Font(color="FFFFFF", bold=True)

for col_idx, col in enumerate(columns, 1):
    cell = ws.cell(row=1, column=col_idx, value=col["header"])
    cell.fill = header_fill
    cell.font = header_font
    cell.alignment = Alignment(wrap_text=True, vertical="top")

for row_idx, row in enumerate(rows, 2):
    for col_idx, col in enumerate(columns, 1):
        ws.cell(row=row_idx, column=col_idx, value=row.get(col["key"], ""))

for col_idx, col in enumerate(columns, 1):
    letter = get_column_letter(col_idx)
    width = min(48, max(14, len(col["header"]) + 2))
    ws.column_dimensions[letter].width = width

ws.freeze_panes = "A2"
wb.save(sys.argv[2])
`;

  try {
    execSync('python3 -c "import openpyxl"', { stdio: 'ignore' });
    execSync(
      `python3 -c ${JSON.stringify(pyScript)} ${JSON.stringify(JSON.stringify(COLUMNS))} ${JSON.stringify(XLSX_PATH)}`,
      { input: JSON.stringify(rows), stdio: ['pipe', 'inherit', 'inherit'] }
    );
    return true;
  } catch {
    return false;
  }
}

function main() {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'));
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const rows = buildRows(products, manifest);

  writeCsv(rows);
  console.log(`Wrote ${CSV_PATH} (${rows.length} rings)`);

  if (tryWriteXlsx(rows)) {
    console.log(`Wrote ${XLSX_PATH}`);
  } else {
    console.log('openpyxl not installed — CSV only (opens in Excel). Run: pip3 install openpyxl');
  }
}

main();
