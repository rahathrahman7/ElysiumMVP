import { test, expect } from '@playwright/test';

test('check site styling and layout', async ({ page }) => {
  // Navigate to homepage
  await page.goto('/');
  
  // Check if the page loads
  await expect(page).toHaveTitle(/ELYSIUM/);
  
  // Check if main elements are visible
  await expect(page.getByText('ELYSIUM')).toBeVisible();
  await expect(page.getByText('Fine jewellery from our London atelier')).toBeVisible();
  
  // Check if CSS classes are applied (this will help verify styling is working)
  const heroSection = page.locator('section').first();
  await expect(heroSection).toHaveClass(/min-h-\[78vh\]/);
  
  // Check if the featured products section has proper styling
  const featuredSection = page.locator('section').last();
  await expect(featuredSection).toHaveClass(/bg-ivory/);
  
  // Check if product cards are visible
  await expect(page.getByText('Ovalis — Oval Solitaire')).toBeVisible();
  await expect(page.getByText('Oval Solitaire w Hidden Halo')).toBeVisible();
  await expect(page.getByText('Oval Solitaire w Round & Marquise')).toBeVisible();
  
  // Check if navigation is working
  await expect(page.getByRole('link', { name: 'Collection' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Bespoke' })).toBeVisible();
  
  // Take a screenshot to verify visual appearance
  await page.screenshot({ path: 'test-results/homepage-styling.png', fullPage: true });
  
  console.log('✅ Site styling check completed successfully');
});














