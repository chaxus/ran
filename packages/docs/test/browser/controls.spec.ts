import { test, expect } from '@playwright/test';

const path = '/ranui/button/';

test('the enhanced mobile drawer cycles focus without entering unrelated header controls', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 720 });
  await page.goto(path);
  const trigger = page.locator('.drawer__button');
  await trigger.click();
  const visible = page.locator('.sidebar :is(a, summary, button, [tabindex="0"]):visible');
  await visible.last().focus();
  await page.keyboard.press('Tab');
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(visible.first()).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(visible.last()).toBeFocused();
});

test('drawer scrim and responsive closure restore focus to the visible trigger', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 720 });
  await page.goto(path);
  const trigger = page.locator('.drawer__button');
  await trigger.click();
  await page.locator('.sidebar a').first().focus();
  await page.locator('.drawer__scrim').click({ position: { x: 370, y: 100 } });
  await expect(trigger).toBeFocused();
  await page.setViewportSize({ width: 1000, height: 720 });
  const desktopLink = page.locator('.sidebar a:visible').first();
  await desktopLink.focus();
  await expect(desktopLink).toBeFocused();
  await page.setViewportSize({ width: 390, height: 720 });
  await expect(trigger).toBeFocused();
});

test('search retains cached results and restores a reachable drawer origin', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 720 });
  await page.goto(path);
  const trigger = page.locator('.drawer__button');
  await trigger.click();
  await page.locator('.sidebar a').first().focus();
  await page.keyboard.press('/');
  const dialog = page.locator('#search-dialog');
  const input = page.locator('#search-input');
  await input.fill('button');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('ArrowDown');
  const active = await input.getAttribute('aria-activedescendant');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.locator('.search-open').click();
  await expect(input).toHaveValue('button');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await expect(input).toHaveAttribute('aria-activedescendant', active!);
  await input.dispatchEvent('compositionstart');
  await input.dispatchEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true, cancelable: true });
  await input.dispatchEvent('compositionend');
  await expect(dialog).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`${path}$`));
});

test('code copy preserves its focus and target width and explains a failure locally', async ({ page }) => {
  await page.goto(path);
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => new Promise<void>((resolve) => window.setTimeout(resolve, 100)) },
    }),
  );
  const button = page.locator('.code-copy').first();
  await button.focus();
  const width = await button.evaluate((element) => element.getBoundingClientRect().width);
  await page.keyboard.press('Enter');
  await expect(button).toHaveText('Copied');
  await expect(button).toBeFocused();
  expect(await button.evaluate((element) => element.getBoundingClientRect().width)).toBeCloseTo(width, 1);
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error('denied')) },
    }),
  );
  await page.keyboard.press('Enter');
  await expect(button.locator('..').locator('.code-copy__status')).toContainText('Copy failed');
  await expect(button).toBeFocused();
});

test('drawer keyboard navigation skips links hidden inside a collapsed group', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 720 });
  await page.goto(path);
  await page.locator('.drawer__button').click();
  const group = page.locator('.sidebar details').first();
  await group.evaluate((element: HTMLDetailsElement) => {
    element.open = false;
  });
  const summary = group.locator(':scope > summary');
  await summary.focus();
  await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => {
    const element = document.activeElement as HTMLElement;
    return {
      visible: element.checkVisibility(),
      sameGroup: element.closest('.sidebar details') === document.querySelector('.sidebar details'),
    };
  });
  expect(focused.visible).toBe(true);
  expect(focused.sameGroup).toBe(false);
});
