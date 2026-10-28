import { expect, test, type Locator } from './fixtures';

/** Picks an option from an `r-select`, whose listbox is portaled to the body. */
const choose = async (select: Locator, value: string): Promise<void> => {
  await select.click();
  await select.page().locator(`[role="option"][value="${value}"]`).filter({ visible: true }).click();
};

/** The playground drives the real element with ranui controls and shows the markup that results. */
test('controls change the element and the markup readout', async ({ page }) => {
  await page.goto('/ranui/button/');
  await page.waitForFunction(() =>
    ['r-button', 'r-checkbox', 'r-select', 'r-input'].every((tag) => customElements.get(tag)),
  );
  const playground = page.locator('[data-playground="r-button"]');
  const button = playground.locator('.playground__stage r-button');
  const readout = playground.locator('.playground__markup code');
  await expect(readout).toHaveText('<r-button>Button</r-button>');

  // An unset select names the attribute's stated default.
  const type = playground.getByRole('combobox', { name: 'type' });
  await expect(type).toHaveAttribute('placeholder', 'default');
  await choose(type, 'primary');
  await playground.getByRole('checkbox', { name: 'disabled' }).click();
  // `effect` is on until written as "false".
  const effect = playground.getByRole('checkbox', { name: 'effect' });
  await expect(effect).toBeChecked();
  await effect.click();

  await expect(button).toHaveAttribute('type', 'primary');
  await expect(button).toHaveAttribute('disabled', '');
  await expect(button).toHaveAttribute('effect', 'false');
  await expect(readout).toContainText('type="primary"');
  await expect(readout).toContainText('effect="false"');

  // r-input renders a closed shadow root: focus the host's field and type.
  await playground.locator('r-input[data-attr="icon"]').click({ position: { x: 40, y: 34 } });
  await page.keyboard.type('search');
  await expect(button).toHaveAttribute('icon', 'search');
  await expect(readout).toContainText('icon="search"');

  await choose(type, '__unset');
  await expect(button).not.toHaveAttribute('type');
  await expect(readout).not.toContainText('type=');
});

test('the facts line links to the playground', async ({ page }) => {
  await page.goto('/cn/ranui/button/');
  const link = page.locator('.component-facts a[href^="#"]');
  await expect(link).toHaveText('试玩');
  const id = (await link.getAttribute('href'))!.slice(1);
  await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
});
