const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);
  
  // Get the HTML structure of the navbar
  const navbarHTML = await page.evaluate(() => {
    const header = document.querySelector('header');
    const nav = header?.querySelector('nav');
    return {
      headerHTML: header?.outerHTML || 'No header found',
      navHTML: nav?.outerHTML || 'No nav found',
      allLinks: Array.from(document.querySelectorAll('nav a')).map(link => ({
        href: link.href,
        text: link.textContent,
        className: link.className,
        outerHTML: link.outerHTML
      }))
    };
  });
  
  console.log('Navbar HTML Structure:');
  console.log(JSON.stringify(navbarHTML, null, 2));
  
  await browser.close();
})();