import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage();
page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
await page.goto('http://localhost:18234/enter-submit-test.html');
await page.waitForTimeout(300);

const host = page.locator('r-input');
await host.evaluate((el) => el.focus());
await page.keyboard.type('alice');
await page.keyboard.press('Enter');
await page.waitForTimeout(200);

const result = await page.locator('#result').textContent();
console.log('RESULT:', result);

// Also directly check .form / value relay
const info = await host.evaluate((el) => ({
  value: el.value,
  hasInternals: !!el._internals,
}));
console.log('INFO:', JSON.stringify(info));

await browser.close();
