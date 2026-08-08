import { test, expect } from '@playwright/test';

// Throwaway spec to verify the rewritten docs Forms guide actually renders
// and works in a real browser — not part of the permanent suite.

test('docs form guide — quick start demo works end to end', async ({ page }) => {
  const logs: string[] = [];
  page.on('console', (msg) => logs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', (err) => logs.push(`[pageerror] ${err.message}`));

  await page.goto('http://localhost:5175/src/ranui/form/', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!customElements.get('r-select'), null, { timeout: 15000 });
  await page.waitForTimeout(500);

  const demo = page.locator('.ran-demo').first();
  await demo.scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'test-results/_form-doc-demo.png', fullPage: false });
  await demo.screenshot({ path: 'test-results/_form-doc-demo-only.png' });

  console.log('DEMO HTML:', await demo.evaluate((el) => el.outerHTML).catch((e) => String(e)));
  console.log('LOGS:', JSON.stringify(logs, null, 2));
});
