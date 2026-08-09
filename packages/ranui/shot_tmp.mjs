import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto('http://localhost:5173/ranui/popover/', { waitUntil: 'load', timeout: 60000 });
await page.waitForTimeout(2000);
try {
  await page.waitForSelector('text=Slots', { timeout: 15000 });
} catch (e) { console.log('no slots heading yet'); }
const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 200));
console.log('BODY:', bodyText);
const heading = page.getByRole('heading', { name: 'Slots' });
if (await heading.count()) {
  await heading.scrollIntoViewIfNeeded();
}
await page.screenshot({ path: '/private/tmp/claude-501/-Users-ranzhouhang-Documents-code-ran/68340532-b12d-4008-b7c9-dac10db273d7/scratchpad/slots.png', fullPage: false });
await browser.close();
