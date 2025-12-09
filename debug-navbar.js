const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);
  
  // Get computed styles of the Collections link
  const styles = await page.evaluate(() => {
    const collectionsLink = document.querySelector('nav a[href="/products"]') || 
                           document.querySelector('nav a:has-text("Collection")') ||
                           document.querySelector('nav a');
    
    if (!collectionsLink) return 'Link not found';
    
    const computedStyles = window.getComputedStyle(collectionsLink);
    const hoverStyles = {};
    
    // Simulate hover to get hover styles
    collectionsLink.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    
    setTimeout(() => {
      const hoverComputedStyles = window.getComputedStyle(collectionsLink);
      
      return {
        element: collectionsLink.outerHTML,
        classes: collectionsLink.className,
        normalBackground: computedStyles.background,
        normalBackgroundColor: computedStyles.backgroundColor,
        normalBackgroundImage: computedStyles.backgroundImage,
        hoverBackground: hoverComputedStyles.background,
        hoverBackgroundColor: hoverComputedStyles.backgroundColor,
        hoverBackgroundImage: hoverComputedStyles.backgroundImage,
        boxShadow: hoverComputedStyles.boxShadow,
        transform: hoverComputedStyles.transform,
        allStylesSnippet: Array.from(hoverComputedStyles).filter(prop => 
          prop.includes('background') || prop.includes('shadow') || prop.includes('transform')
        ).map(prop => `${prop}: ${hoverComputedStyles.getPropertyValue(prop)}`).join('\n')
      };
    }, 100);
    
    return new Promise(resolve => {
      collectionsLink.addEventListener('mouseenter', () => {
        setTimeout(() => {
          const hoverComputedStyles = window.getComputedStyle(collectionsLink);
          resolve({
            element: collectionsLink.outerHTML,
            classes: collectionsLink.className,
            normalBackground: computedStyles.background,
            normalBackgroundColor: computedStyles.backgroundColor,
            normalBackgroundImage: computedStyles.backgroundImage,
            hoverBackground: hoverComputedStyles.background,
            hoverBackgroundColor: hoverComputedStyles.backgroundColor,
            hoverBackgroundImage: hoverComputedStyles.backgroundImage,
            boxShadow: hoverComputedStyles.boxShadow,
            transform: hoverComputedStyles.transform
          });
        }, 100);
      });
      
      collectionsLink.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    });
  });
  
  console.log('Navbar Link Debug Info:');
  console.log(JSON.stringify(styles, null, 2));
  
  await browser.close();
})();