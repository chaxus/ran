import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
const logs = [];
page.on('console', (msg) => logs.push(`[${msg.type()}] ${msg.text()}`));
page.on('pageerror', (err) => logs.push(`[pageerror] ${err.message}`));

await page.goto('http://localhost:5175/src/ranui/form/', { waitUntil: 'networkidle' });
await page.waitForFunction(() => !!customElements.get('r-select'), null, { timeout: 15000 });
await page.waitForTimeout(500);

const demo = page.locator('.ran-demo').first();
await demo.locator('r-input input').fill('alice');
await demo.locator('r-select').click();
await page.waitForTimeout(300);
await page.getByText('Admin', { exact: true }).click();
await demo.locator('r-checkbox').click();
await demo.locator('button[type="submit"]').click();
await page.waitForTimeout(300);

const toastText = await page
  .locator('.ran-message, [role="alert"], [role="status"]')
  .first()
  .textContent()
  .catch(() => null);
console.log('TOAST:', toastText);
console.log('LOGS:', JSON.stringify(logs, null, 2));

await browser.close();
