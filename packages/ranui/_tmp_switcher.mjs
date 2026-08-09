import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('console', m => console.log('CONSOLE', m.type(), m.text()));
await page.goto('http://localhost:8899/src/ranui/', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(500);

console.log('url before click:', page.url());
const btn = page.locator('.product-switcher-btn');
console.log('btn count:', await btn.count());
console.log('btn text:', await btn.textContent());

// Inspect the DOM structure around it to check for the nested-<a> issue
const html = await page.locator('.product-switcher').evaluate(el => {
  let n = el;
  let chain = [];
  while (n) { chain.push(n.tagName + (n.getAttribute && n.getAttribute('href') ? `[href=${n.getAttribute('href')}]` : '')); n = n.parentElement; if (chain.length > 6) break; }
  return chain.join(' < ');
});
console.log('ancestor chain:', html);

await btn.click();
await page.waitForTimeout(500);
console.log('url after click:', page.url());
console.log('menu visible:', await page.locator('.product-switcher-menu').isVisible());

await browser.close();
