import { expect, test } from '@playwright/test';

/** The playground drives the real element and shows the markup that results. */
test('controls change the element and the markup readout', async ({ page }) => {
  await page.goto('/ranui/button/');
  await page.waitForFunction(() => customElements.get('r-button'));
  const playground = page.locator('[data-playground="r-button"]');
  const button = playground.locator('.playground__stage r-button');
  const readout = playground.locator('.playground__markup code');
  await expect(readout).toHaveText('<r-button>Button</r-button>');

  await playground.getByLabel('type').selectOption('primary');
  await playground.getByLabel('disabled').check();
  // `effect` is on until written as "false".
  await expect(playground.getByLabel('effect')).toBeChecked();
  await playground.getByLabel('effect').uncheck();

  await expect(button).toHaveAttribute('type', 'primary');
  await expect(button).toHaveAttribute('disabled', '');
  await expect(button).toHaveAttribute('effect', 'false');
  await expect(readout).toContainText('type="primary"');
  await expect(readout).toContainText('effect="false"');

  await playground.getByLabel('type').selectOption('');
  await expect(button).not.toHaveAttribute('type');
});

test('the facts line links to the playground', async ({ page }) => {
  await page.goto('/cn/ranui/button/');
  const link = page.locator('.component-facts a[href^="#"]');
  await expect(link).toHaveText('试玩');
  const id = (await link.getAttribute('href'))!.slice(1);
  await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
});
