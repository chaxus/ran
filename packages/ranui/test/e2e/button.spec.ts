import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';

test('button', async ({ page }) => {
  await page.goto(DEV_SERVER, { waitUntil: 'load' });
  await expect(page).toHaveTitle(/ranui/);
  await page.waitForFunction(() => customElements.get('r-button'));
  await page.evaluate(async () => {
    document.body.innerHTML = '';
    document.body.style.margin = '0';
    document.body.style.padding = '24px';
    const component = document.createElement('r-button');
    component.role = 'button';
    component.innerText = 'Submit';
    component.onclick = () => {
      console.log('click success');
    };
    document.body.appendChild(component);
  });
  // await page.getByRole('button', { name: /submit/i }).click();
  const button = page.getByRole('button', { name: /submit/i });
  await expect(button).toBeVisible();
  await expect(button).toHaveScreenshot('button.png');
});
