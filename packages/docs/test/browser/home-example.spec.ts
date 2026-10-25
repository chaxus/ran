import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * The home page's invite example demonstrates the interaction rules it links to, so it is
 * held to them: validation on the field, one send per activation, success only after the
 * answer, entries kept on failure, and nothing put in the URL.
 */
const example = (page: Page) => page.locator('[data-home-example]');
const field = (page: Page) => example(page).locator('r-input[name="email"]');
const status = (page: Page) => example(page).locator('.example__status');
const typeEmail = async (page: Page, value: string): Promise<void> => {
  // The input lives in a closed shadow root; the host forwards focus-free typing via its property.
  await field(page).evaluate((host, text) => {
    (host as HTMLElement & { value: string }).value = text;
    host.dispatchEvent(new Event('input'));
  }, value);
};

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => customElements.get('r-input') && customElements.get('r-button'));
});

test('an empty email is reported on the field, without sending', async ({ page }) => {
  await example(page).locator('.example__submit').click();
  await expect(field(page)).toHaveAttribute('status', 'error');
  await expect(field(page)).toHaveAttribute('message', /ada@company\.com/);
  await expect(status(page)).toHaveText('');
});

test('one activation sends once, and success appears only after the answer', async ({ page }) => {
  await typeEmail(page, 'grace@company.com');
  const submit = example(page).locator('.example__submit');
  await submit.click();
  await expect(submit).toHaveAttribute('aria-busy', 'true');
  await expect(status(page)).toHaveText('');
  await submit.click({ force: true });
  await expect(status(page)).toHaveText('Invitation sent to grace@company.com as Editor.');
  await expect(status(page)).toHaveAttribute('data-tone', 'success');
  await expect(submit).not.toHaveAttribute('aria-busy');
  expect(new URL(page.url()).search).toBe('');
});

test('a failed send keeps the entries and says what to do', async ({ page }) => {
  await example(page).locator('r-checkbox[name="simulate"]').click();
  await typeEmail(page, 'lin@company.com');
  // Enter from the real input inside the closed shadow root, as a reader presses it.
  await field(page).click();
  await page.keyboard.press('Enter');
  await expect(status(page)).toHaveText(/wasn't sent.*try again/);
  await expect(status(page)).toHaveAttribute('data-tone', 'error');
  expect(await field(page).evaluate((host) => (host as HTMLElement & { value: string }).value)).toBe('lin@company.com');
  expect(new URL(page.url()).search).toBe('');
});

test('every rule the example cites links to the section that states it', async ({ page }) => {
  const rules = example(page).locator('xpath=following-sibling::div[contains(@class,"example__rules")]//a');
  expect(await rules.count()).toBeGreaterThan(0);
  for (const href of await rules.evaluateAll((links) => links.map((link) => link.getAttribute('href')!))) {
    const [path, hash] = href.split('#');
    expect(path).toMatch(/^\/design\/[a-z]+$/);
    await page.goto(href);
    await expect(page.locator(`[id="${decodeURIComponent(hash!)}"]`)).toHaveCount(1);
  }
});
