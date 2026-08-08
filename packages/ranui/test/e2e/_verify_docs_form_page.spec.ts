import { test, expect } from '@playwright/test';

test('docs form guide — required field demo blocks then allows submit', async ({ page }) => {
  await page.goto('http://localhost:5175/src/ranui/form/', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!customElements.get('r-input'), null, { timeout: 15000 });
  await page.waitForTimeout(500);

  const demos = page.locator('.ran-demo');
  const validationDemo = demos.nth(2); // Quick Start, Layout, Validation and reset
  await validationDemo.scrollIntoViewIfNeeded();

  const form = validationDemo.locator('form');
  const submitFired = () =>
    page.evaluate((sel) => {
      return new Promise<boolean>((resolve) => {
        const f = document.querySelectorAll(sel)[2] as HTMLFormElement;
        let fired = false;
        f.addEventListener('submit', () => (fired = true), { once: true });
        (f.querySelector('button[type="submit"]') as HTMLButtonElement).click();
        setTimeout(() => resolve(fired), 150);
      });
    }, '.ran-demo form');

  expect(await submitFired()).toBe(false); // empty required field blocks it

  await validationDemo.locator('r-input').click();
  await page.keyboard.type('alice');

  expect(await submitFired()).toBe(true);
});
