const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 10000 });
    
    // Take homepage screenshot
    await page.screenshot({ path: 'homepage-full.png', fullPage: true });
    console.log('✓ Homepage screenshot saved');
    
    // Scroll to test navbar behavior
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'homepage-scrolled.png' });
    console.log('✓ Scrolled homepage screenshot saved');
    
    // Navigate to products page
    await page.goto('http://localhost:3000/products', { waitUntil: 'networkidle', timeout: 10000 });
    await page.screenshot({ path: 'products-page.png', fullPage: true });
    console.log('✓ Products page screenshot saved');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  await browser.close();
})();
