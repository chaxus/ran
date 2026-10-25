import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'connection', {
      value: Object.assign(new EventTarget(), { saveData: true }),
      configurable: true,
    });
  });
});

test('message buttons load the imperative API without an existing toast', async ({ page }) => {
  await page.goto('/ranui/message/');
  await expect.poll(() => page.evaluate(() => typeof (window as any).message?.info)).toBe('function');
  await page.locator('ran-demo r-button').first().click();
  await expect(page.locator('r-message')).toHaveAttribute('content', 'This is a hint');
});

test('checkbox event feedback reports its new checked state', async ({ page }) => {
  await page.goto('/ranui/checkbox/');
  await page.waitForFunction(() => customElements.get('r-checkbox'));
  await page.locator('ran-demo r-checkbox[onchange]').click();
  await expect(page.locator('r-message')).toHaveAttribute('content', 'checked: true');
});

test('live forms submit with one native button and preserve the documentation URL', async ({ page }) => {
  await page.goto('/ranui/form/');
  await page.waitForFunction(() => customElements.get('r-input') && customElements.get('r-select'));
  const forms = page.locator('ran-demo form');
  const before = page.url();
  for (const form of await forms.all()) {
    await expect(form.locator('r-button')).toHaveCount(0);
    await expect(form.locator('button[type="submit"]')).toHaveCount(1);
  }
  const quick = forms.first();
  await quick.locator('button[type="submit"]').focus();
  await page.keyboard.press('Enter');
  await expect(quick.locator('output')).toContainText('"role":"member"');
  const layout = forms.nth(1);
  await layout.locator('button[type="submit"]').click();
  await expect(layout.locator('output')).toContainText('"first"');
  const validation = forms.last();
  await validation.locator('button[type="submit"]').click();
  await expect(validation.locator('output')).toBeEmpty();
  // Edit through the public focus API and native keyboard input. Setting an
  // attribute leaves Firefox's native validation UI active over the next click.
  await validation.locator('r-input').focus();
  await page.keyboard.type('Ada');
  await expect(validation.locator('r-input')).toHaveAttribute('value', 'Ada');
  await validation.locator('button[type="submit"]').click();
  await expect(validation.locator('output')).toContainText('"username":"Ada"');
  expect(page.url()).toBe(before);
});

test('glass moves by dragging and keyboard, stays bounded, and resets', async ({ page }) => {
  await page.goto('/ranui/glass/');
  await page.waitForFunction(() => customElements.get('r-glass'));
  const stage = page.locator('.gp-stage');
  const glass = page.locator('.gp-glass');
  const box = (await glass.boundingBox())!;
  await page.mouse.move(box.x + 20, box.y + 20);
  await page.mouse.down();
  await page.mouse.move(box.x + 45, box.y + 50);
  await page.mouse.up();
  await expect(glass).toHaveCSS('left', '25px');
  await expect(glass).toHaveCSS('top', '30px');
  await stage.focus();
  await page.keyboard.press('ArrowDown');
  await expect(glass).toHaveCSS('top', '40px');
  await page.locator('[data-reset]').click();
  await expect(glass).toHaveCSS('left', '0px');
  await expect(glass).toHaveCSS('top', '0px');
});

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test(`modal autofocus and footer keyboard navigation work with ${reducedMotion} motion`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    await page.goto('/ranui/modal/');
    await page.waitForFunction(() => customElements.get('r-modal') && customElements.get('r-button'));
    await page.locator('ran-demo r-button').first().click();
    const modal = page.locator('#quickstart-modal');
    await expect(modal).toHaveAttribute('open', '');
    // Opening focuses Close. The next tab must reach the footer action.
    await expect.poll(() => modal.evaluate((element) => document.activeElement === element)).toBe(true);
    await page.keyboard.press('Tab');
    const footerFocused = await modal
      .locator('[slot="footer"]')
      .evaluate((footer) => footer.contains(document.activeElement));
    expect(footerFocused).toBe(true);
    await page.keyboard.press('Enter');
    await expect(modal).not.toHaveAttribute('open');
  });
}
