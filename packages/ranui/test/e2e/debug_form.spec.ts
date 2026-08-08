import { test, expect } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

test.use({ viewport: { width: 400, height: 300 } });

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-form');
});

test('debug native input', async ({ page }) => {
  await mount(
    page,
    `
    <r-form>
      <input name="username" value="bob" />
      <button type="submit">Submit</button>
    </r-form>
  `,
  );

  const diag2 = await page.evaluate(() => {
    const form = document.querySelector('r-form') as any;
    const fd = new FormData(form._form);
    const entries: any[] = [];
    fd.forEach((v, k) => entries.push([k, v]));
    // also check native input.form
    const input = document.querySelector('input') as HTMLInputElement;
    return { entries, inputForm: input.form ? input.form.outerHTML.slice(0,80) : null };
  });
  console.log('native-input-diag', JSON.stringify(diag2));
});
