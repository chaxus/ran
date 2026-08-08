import { test, expect } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

// Functional coverage only — no screenshots. This exercises behavior jsdom
// cannot: real shadow-DOM slot flattening feeding a real FormData collection,
// and the browser's own constraint-validation gate on submit. See
// test/unit/form.contract.test.ts for the DOM-shape/attribute-level contract.

test.use({ viewport: { width: 400, height: 300 } });

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-form');
});

test('form — submit reflects the field value at submit time, not connect time', async ({ page }) => {
  await mount(
    page,
    `
    <r-form>
      <r-input name="username" label="Username"></r-input>
      <button type="submit">Submit</button>
    </r-form>
  `,
  );

  // Set after the elements are already connected — proves the fix (FormData
  // used to be computed once at connect and never refreshed on submit).
  await page.evaluate(() => {
    const input = document.querySelector('r-input') as HTMLElement & { value: string };
    input.value = 'alice';
  });

  await page.locator('button[type="submit"]').click();

  const value = await page.evaluate(() => (document.querySelector('r-form') as HTMLElement & { value: string }).value);
  expect(value).toBe(JSON.stringify({ username: 'alice' }));
});

test('form — a required field blocks submit until filled', async ({ page }) => {
  await mount(
    page,
    `
    <r-form>
      <r-input name="username" label="Username" required></r-input>
      <button type="submit">Submit</button>
    </r-form>
  `,
  );

  const observeSubmit = () =>
    page.evaluate(
      () =>
        new Promise<boolean>((resolve) => {
          const form = document.querySelector('r-form') as any;
          let fired = false;
          form._form.addEventListener('submit', () => (fired = true), { once: true });
          (document.querySelector('button[type="submit"]') as HTMLButtonElement).click();
          setTimeout(() => resolve(fired), 100);
        }),
    );

  expect(await observeSubmit()).toBe(false);

  await page.evaluate(() => {
    const input = document.querySelector('r-input') as HTMLElement & { value: string };
    input.value = 'alice';
  });

  expect(await observeSubmit()).toBe(true);
});
