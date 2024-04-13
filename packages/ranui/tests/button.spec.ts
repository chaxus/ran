import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../build/config';

test('button', async ({ page }) => {
  await page.goto(DEV_SERVER, { waitUntil: 'load' });
  await expect(page).toHaveTitle(/ranui/);
  await page.evaluate(async () => {
    const component = document.createElement('r-button');
    component.role = 'button';
    component.innerText = 'Submit';
    component.onclick = () => {
      console.log('click success')
    }
    document.body.appendChild(component);
  });
  // await page.getByRole('button', { name: /submit/i }).click();
  await expect(page.getByRole('button', { name: /submit/i })).toBeVisible();
  await expect(page).toHaveScreenshot('button.png', { fullPage: true });
});
