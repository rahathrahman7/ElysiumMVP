// NOTE: Do not run in this environment. For CI only.
import { test, expect } from "@playwright/test";

test("home → PDP → add to cart → checkout session", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "ELYSIUM" })).toBeVisible();
  await page.getByRole("link", { name: "SHOP COLLECTION" }).click();
  await page.getByRole("link").filter({ hasText: /seraphina|celeste|luna/i }).first().click();
  
  // Wait for product page to load and select a ring size (required for add to bag)
  await page.waitForLoadState('networkidle');
  
  // Try to find and click a ring size first
  const sizeButton = page.locator('button').filter({ hasText: /^[A-Z]$/ }).first();
  if (await sizeButton.isVisible({ timeout: 5000 })) {
    await sizeButton.click();
  }
  
  // Now try to add to bag
  await page.getByRole("button", { name: /add to bag|add to cart/i }).click();
  await page.goto("/cart");
  await page.getByRole("button", { name: /checkout/i }).click();
  await expect(page).toHaveURL(/checkout/);
});
















