import { test } from '@playwright/test';

test('popover click on real docs page', async ({ page }) => {
  page.on('console', (msg) => console.log('BROWSER:', msg.type(), msg.text()));
  page.on('pageerror', (err) => console.log('PAGEERROR:', err.message));
  await page.goto('http://localhost:5176/ranui/popover', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!customElements.get('r-popover'));
  await page.evaluate(() => document.fonts.ready.then(() => undefined));

  const buttons = page.locator('r-popover >> r-button', { hasText: 'click' });
  await buttons.first().scrollIntoViewIfNeeded();
  await buttons.first().click();
  await page.waitForTimeout(400);

  const displayAfterOpen = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('.ran-popover-dropdown')) as HTMLElement[];
    return nodes.map((n) => ({ display: n.style.display, text: n.textContent?.trim() }));
  });
  console.log('after open:', JSON.stringify(displayAfterOpen));

  await page.mouse.click(20, 20);
  await page.waitForTimeout(400);

  const displayAfterOutside = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('.ran-popover-dropdown')) as HTMLElement[];
    return nodes.map((n) => ({ display: n.style.display, text: n.textContent?.trim() }));
  });
  console.log('after outside click:', JSON.stringify(displayAfterOutside));
});
