import { test, expect } from '@playwright/test';
import fs from 'fs';

const OUT_DIR = 'mcp_artifacts/ui';

test.beforeAll(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
});

test('home page screenshot', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${OUT_DIR}/home.png`, fullPage: true });
});

test('shop page screenshot', async ({ page }) => {
  await page.goto('/shop');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${OUT_DIR}/shop.png`, fullPage: true });
});

test('products listing screenshot', async ({ page }) => {
  await page.goto('/products');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${OUT_DIR}/products.png`, fullPage: true });
});

test('PDP screenshot: seraphina', async ({ page }) => {
  await page.goto('/products/seraphina-signature-six-claw');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${OUT_DIR}/pdp-seraphina.png`, fullPage: true });
});

test('PDP screenshot: luna', async ({ page }) => {
  await page.goto('/products/luna-low-set-solitaire');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${OUT_DIR}/pdp-luna.png`, fullPage: true });
});

test('wishlist page screenshot', async ({ page }) => {
  await page.goto('/wishlist');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${OUT_DIR}/wishlist.png`, fullPage: true });
});

