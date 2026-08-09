import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const OUT = '/private/tmp/claude-501/-Users-ranzhouhang-Documents-code-ran/20d4b46e-dc59-4234-a715-dfd13aa9959e/scratchpad';

async function testPage(url, label) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(400);
  const urlBefore = page.url();
  await page.locator('.product-switcher-btn').click();
  await page.waitForTimeout(300);
  const urlAfter = page.url();
  const menuDisplay = await page.evaluate(() => getComputedStyle(document.querySelector('.product-switcher-menu')).display);
  await page.screenshot({ path: `${OUT}/switcher-${label}.png`, clip: { x: 0, y: 0, width: 500, height: 150 } });
  // also confirm the logo itself still navigates home
  await page.locator('.product-switcher-menu').waitFor({ state: 'visible' }).catch(() => {});
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  await page.locator('a.title').click();
  await page.waitForTimeout(300);
  const homeUrl = page.url();
  await page.close();
  console.log(label, { urlBefore, urlAfter, menuDisplay, homeUrl });
}

await testPage('http://localhost:8899/src/ranui/', 'ranui');
await testPage('http://localhost:8899/src/ranuts/', 'ranuts');

await browser.close();
