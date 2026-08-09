import { chromium } from '@playwright/test';

const browser = await chromium.launch();

async function shot(url, opts, path, prep) {
  const page = await browser.newPage(opts);
  await page.goto(url, { waitUntil: 'networkidle' });
  if (prep) await prep(page);
  await page.screenshot({ path });
  await page.close();
}

const OUT = '/private/tmp/claude-501/-Users-ranzhouhang-Documents-code-ran/20d4b46e-dc59-4234-a715-dfd13aa9959e/scratchpad';

// 1) math page, scrolled to Quick Start demo (top of content, right under sticky nav)
await shot('http://localhost:5173/ranui/math', { viewport: { width: 1280, height: 800 } }, `${OUT}/repro-math.png`, async (page) => {
  await page.locator('.ran-demo').first().scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, -40); // nudge so demo top sits just under the sticky nav
});

// 2) modal page, quickstart demo is `<r-modal open>` (should cover full page incl. nav)
await shot('http://localhost:5173/ranui/modal', { viewport: { width: 1280, height: 800 } }, `${OUT}/repro-modal.png`);

// 3) dropdown page at mobile width, sidebar opened, dropdown-as-content shouldn't paint over the dimmed sidebar
await shot('http://localhost:5173/ranui/dropdown', { viewport: { width: 375, height: 800 } }, `${OUT}/repro-dropdown-mobile.png`, async (page) => {
  const hamburger = page.locator('.VPNavBarHamburger, [aria-label="menu" i], .curtain + button, button[aria-label*="Menu" i]').first();
  if (await hamburger.count()) {
    await hamburger.click();
    await page.waitForTimeout(300);
  }
});

await browser.close();
console.log('done');
