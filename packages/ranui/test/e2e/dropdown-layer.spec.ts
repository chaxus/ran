import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-modal');
  await mount(
    page,
    `<main style="display:grid;gap:24px"><r-dropdown id="inline"><button>Background action</button></r-dropdown><r-modal id="modal" heading="Project settings"><r-select id="choice" placeholder="Choose owner" style="width:200px"><r-option value="a">Alpha</r-option><r-option value="b">Beta</r-option></r-select><r-popover id="help" trigger="click"><button id="help-trigger">Review details</button><r-content><button id="inside">Confirm details</button></r-content></r-popover></r-modal></main>`,
  );
});

test('an inline dropdown grid item does not claim the floating layer above a modal', async ({ page }) => {
  await page.locator('#modal').evaluate((modal) => modal.setAttribute('open', ''));
  // Grid items form stacking contexts for a non-auto z-index even without positioning.
  // The page-owned inline panel must not claim the popup layer above the modal.
  expect(await page.locator('#inline').evaluate((element) => getComputedStyle(element).zIndex)).toBe('auto');
  await expect(page.locator('#modal')).toHaveAttribute('open');
});

test('Select and Popover managed portals remain above their modal and pointer operable', async ({ page }) => {
  await page.locator('#modal').evaluate((modal) => modal.setAttribute('open', ''));
  await page.locator('#choice').click();
  const selectPanel = page.locator('r-dropdown:not(#inline)').filter({ has: page.locator('r-dropdown-item') });
  await expect(selectPanel).toBeVisible();
  expect(await selectPanel.evaluate((element) => getComputedStyle(element).zIndex)).toBe('1100');
  await selectPanel.locator('r-dropdown-item').filter({ hasText: 'Beta' }).click();
  await expect(page.locator('#choice')).toHaveAttribute('value', 'b');
  await expect(page.locator('#modal')).toHaveAttribute('open');
  await page.locator('#help-trigger').click();
  await expect(page.locator('#inside')).toBeVisible();
  await page.locator('#inside').click();
  await expect(page.locator('#modal')).toHaveAttribute('open');
});

test('the public host layer override applies to inline and managed dropdowns', async ({ page }) => {
  await page
    .locator('#inline')
    .evaluate((element) => (element as HTMLElement).style.setProperty('--ran-dropdown-host-z-index', '1400'));
  expect(await page.locator('#inline').evaluate((element) => getComputedStyle(element).zIndex)).toBe('1400');
  await page.locator('#modal').evaluate((modal) => modal.setAttribute('open', ''));
  await page.locator('#help-trigger').click();
  const portal = page.locator('r-dropdown:not(#inline)').filter({ has: page.locator('#inside') });
  await portal.evaluate((element) => (element as HTMLElement).style.setProperty('--ran-dropdown-host-z-index', '1400'));
  expect(await portal.evaluate((element) => getComputedStyle(element).zIndex)).toBe('1400');
  await page.locator('#inside').click();
});

test('modal keeps owned portal focus, dismisses one layer, and restores background inert on close', async ({
  page,
}) => {
  await page.locator('#modal').evaluate((modal) => modal.setAttribute('open', ''));
  await page.locator('#help-trigger').click();
  await page.locator('#inside').focus();
  await expect(page.locator('#inside')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#help')).not.toHaveAttribute('open');
  await expect(page.locator('#modal')).toHaveAttribute('open');
  await expect(page.locator('#help-trigger')).toBeFocused();
  await page.locator('#choice').click();
  await page.keyboard.press('Escape');
  await expect(page.locator('#choice')).not.toHaveAttribute('open');
  await expect(page.locator('#modal')).toHaveAttribute('open');
  await page.locator('#help-trigger').click();
  await page.locator('#modal').evaluate((modal) => modal.removeAttribute('open'));
  await expect(page.locator('#help')).not.toHaveAttribute('open');
  await expect(page.locator('#inside')).toBeHidden();
  expect(await page.evaluate(() => [...document.body.children].some((node) => (node as HTMLElement).inert))).toBe(
    false,
  );
});

test('opening a second modal dismisses the first modal floating controls', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.locator('#modal').evaluate((modal) => modal.setAttribute('open', ''));
  await page.locator('#help-trigger').click();
  await expect(page.locator('#inside')).toBeVisible();
  const exitDisplay = await page.evaluate(() => {
    const next = document.createElement('r-modal');
    next.id = 'next';
    next.setAttribute('heading', 'Confirm changes');
    next.innerHTML = '<button id="next-action">Save</button>';
    document.body.append(next);
    next.setAttribute('open', '');
    const panel = (document.querySelector('#help') as HTMLElement & { popoverContent: HTMLElement }).popoverContent;
    return getComputedStyle(panel).display;
  });
  expect(exitDisplay).toBe('none');
  await expect(page.locator('#help')).not.toHaveAttribute('open');
  await expect(page.locator('#inside')).toBeHidden();
  await page.locator('#next-action').click();
  await expect(page.locator('#next')).toHaveAttribute('open');
  await expect(page.locator('#modal')).toHaveAttribute('open');
});

test('a modal opened from inside a portal keeps its ancestor mounted and remains operable', async ({ page }) => {
  await page.locator('#modal').evaluate((modal) => modal.setAttribute('open', ''));
  await page.locator('#help-trigger').click();
  await page.locator('#inside').evaluate((button) => {
    const next = document.createElement('r-modal');
    next.id = 'nested';
    next.setAttribute('heading', 'Confirm changes');
    next.innerHTML = '<button id="nested-action">Save</button>';
    button.parentElement!.append(next);
    next.setAttribute('open', '');
  });
  await expect(page.locator('#help')).toHaveAttribute('open');
  await page.locator('#nested-action').click();
  await expect(page.locator('#nested')).toHaveAttribute('open');
  await page.locator('#nested-action').focus();
  await expect(page.locator('#nested-action')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#nested')).not.toHaveAttribute('open');
  await expect(page.locator('#modal')).toHaveAttribute('open');
});

test('a child editor consumes Escape before the modal dismisses on the next unhandled Escape', async ({ page }) => {
  await page.locator('#modal').evaluate((modal) => {
    const input = document.createElement('input');
    input.id = 'editor';
    input.value = 'Unsaved draft';
    input.addEventListener(
      'keydown',
      (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      { once: true },
    );
    modal.append(input);
    modal.setAttribute('open', '');
  });
  await page.locator('#editor').focus();
  await page.keyboard.press('Escape');
  await expect(page.locator('#modal')).toHaveAttribute('open');
  await expect(page.locator('#editor')).toBeFocused();
  await expect(page.locator('#editor')).toHaveValue('Unsaved draft');
  await page.keyboard.press('Escape');
  await expect(page.locator('#modal')).not.toHaveAttribute('open');
});
