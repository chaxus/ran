import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto('http://localhost:8899/src/ranui/', { waitUntil: 'networkidle', timeout: 30000 });

for (const wait of [0, 500, 1500, 3000]) {
  await page.waitForTimeout(wait === 0 ? 0 : wait - (wait === 500 ? 0 : 500));
  const info = await page.evaluate(() => {
    const switcher = document.querySelector('.product-switcher');
    const anchor = document.querySelector('a.title');
    const img = document.querySelector('a.title img.logo');
    return {
      switcherLeft: switcher.getBoundingClientRect().left,
      anchorRight: anchor.getBoundingClientRect().right,
      imgComplete: img?.complete,
      imgRect: img?.getBoundingClientRect(),
      inlineStyle: switcher.getAttribute('style'),
    };
  });
  console.log('after', wait, 'ms total:', JSON.stringify(info));
}

await browser.close();
