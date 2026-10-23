import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { insideShadow, isolatedSetup, mount } from './helpers';

for (const theme of ['light', 'dark'] as const) {
  test.describe(`reading overflow · ${theme}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 800 });
      await page.emulateMedia({ colorScheme: theme });
      await isolatedSetup(page, DEV_SERVER, 'r-token-meter');
      await page.evaluate((value) => {
        document.documentElement.setAttribute('data-ran-theme', value);
        document.body.style.background = 'var(--ran-color-bg)';
        document.body.style.color = 'var(--ran-color-text)';
      }, theme);
    });

    test('keeps a long context label and large counts inside its column', async ({ page }) => {
      await mount(
        page,
        '<r-token-meter label="Conversation context window remaining capacity" limit="65536" used="70000" spent="128431"></r-token-meter>',
      );
      const measured = await insideShadow(page, 'r-token-meter', (root) => {
        const host = root.host as HTMLElement;
        const readout = root.querySelector<HTMLElement>('[part="text"]')!;
        return {
          host: host.getBoundingClientRect().toJSON(),
          readout: readout.getBoundingClientRect().toJSON(),
          text: readout.textContent,
          overflow: host.scrollWidth - host.clientWidth,
          title: root.querySelector('[part="meter"]')?.getAttribute('title'),
        };
      });
      expect(measured.overflow).toBe(0);
      expect(measured.readout.right).toBeLessThanOrEqual(measured.host.right);
      expect(measured.text).toBe('Conversation context window remaining capacity 70k / 66k · 128k');
      expect(measured.title).toContain('Over the limit');
      await page.locator('r-token-meter').evaluate((element) => {
        element.setAttribute('used', '1000000000000000000000000000000');
      });
      expect(
        await insideShadow(page, 'r-token-meter', (root) => {
          const host = root.host as HTMLElement;
          return host.scrollWidth - host.clientWidth;
        }),
      ).toBe(0);
    });

    test('preserves a short title and duration beside a long summary', async ({ page }) => {
      await mount(
        page,
        '<r-disclosure-row heading="Reasoning · 4.2s" summary="Comparing the rollout checklist with current deployment owners."></r-disclosure-row>',
      );
      const measured = await insideShadow(page, 'r-disclosure-row', (root) => {
        const title = root.querySelector<HTMLElement>('[part="title"]')!;
        const range = document.createRange();
        range.selectNodeContents(title.querySelector('.ran-disclosure-title-text')!);
        return { width: title.getBoundingClientRect().width, textWidth: range.getBoundingClientRect().width };
      });
      expect(measured.width).toBeGreaterThanOrEqual(measured.textWidth);
    });

    test('keeps an error summary readable beside a long title and opens recovery by keyboard', async ({
      page,
      browserName,
    }) => {
      await mount(
        page,
        `<r-disclosure-row expandable tone="error" heading="${'ReadDeploymentPermissions'.repeat(20)}" summary="Permission denied. Check workspace access."><p id="recovery">No files were changed. Check workspace access.</p><button id="retry">Retry permission check</button></r-disclosure-row>`,
      );
      const measured = await insideShadow(page, 'r-disclosure-row', (root) => {
        const row = root.querySelector<HTMLElement>('[part="row"]')!;
        const summary = root.querySelector<HTMLElement>('[part="summary"]')!;
        const text = summary.querySelector('.ran-disclosure-summary-text')!.firstChild!;
        const range = document.createRange();
        range.setStart(text, 0);
        range.setEnd(text, 'Permission denied'.length);
        return {
          row: row.getBoundingClientRect().toJSON(),
          summary: summary.getBoundingClientRect().toJSON(),
          failurePhrase: range.getBoundingClientRect().width,
          overflow: row.scrollWidth - row.clientWidth,
        };
      });
      expect(measured.summary.width).toBeGreaterThanOrEqual(measured.failurePhrase);
      expect(measured.summary.right).toBeLessThanOrEqual(measured.row.right);
      expect(measured.overflow).toBe(0);
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await expect(page.locator('r-disclosure-row')).toHaveAttribute('open', '');
      await expect.poll(() => page.locator('#recovery').evaluate((element) => element.checkVisibility())).toBe(true);
      // Safari's default Tab mode skips native buttons; Option+Tab follows all controls.
      await page.keyboard.press(browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab');
      await expect(page.locator('#retry')).toBeFocused();
      await page.locator('r-disclosure-row').evaluate((element) => element.removeAttribute('open'));
      expect(await insideShadow(page, 'r-disclosure-row', (root) => root.activeElement?.getAttribute('part'))).toBe(
        'row',
      );
    });
  });
}
