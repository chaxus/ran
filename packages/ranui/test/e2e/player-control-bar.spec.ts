import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-player');
});

// The speed and quality labels sit on their hover fill. r-select's own 80px floor and the item
// padding it keeps for a hidden arrow used to push "1.0X" and "Auto" off one side of the pill.
test('text controls in the bar are centred on their pill', async ({ page }) => {
  await mount(page, '<r-player id="p" disable-error-modal style="width:640px;height:360px"></r-player>');
  const offsets = await page.locator('#p').evaluate((host) => {
    const root = (host as HTMLElement & { _shadowDom: ShadowRoot })._shadowDom;
    return [...root.querySelectorAll('r-select')]
      .filter((select) => select.getBoundingClientRect().width > 0)
      .map((select) => {
        const item = (select as HTMLElement & { _shadowDom: ShadowRoot })._shadowDom.querySelector('.selection-item')!;
        const range = document.createRange();
        range.selectNodeContents(item);
        const text = range.getBoundingClientRect();
        const pill = select.parentElement!.getBoundingClientRect();
        return {
          label: item.textContent?.trim(),
          offset: Math.round(text.left + text.width / 2 - (pill.left + pill.width / 2)),
          inside: text.left >= pill.left - 0.5 && text.right <= pill.right + 0.5,
        };
      });
  });
  expect(offsets.length).toBeGreaterThan(0);
  for (const control of offsets) {
    expect(control.inside, control.label).toBe(true);
    expect(Math.abs(control.offset), control.label).toBeLessThanOrEqual(1);
  }
});

// Over a light frame the bar's scrim, not a blur of the frame, carries the white controls.
test('the control bar draws a scrim without blurring the picture behind it', async ({ page }) => {
  await mount(page, '<r-player id="p" disable-error-modal style="width:640px;height:360px"></r-player>');
  const bar = await page.locator('#p').evaluate((host) => {
    const controller = (host as HTMLElement & { _shadowDom: ShadowRoot })._shadowDom.querySelector(
      '.ran-player-controller',
    )!;
    const style = getComputedStyle(controller);
    return {
      blur: style.backdropFilter || style.getPropertyValue('-webkit-backdrop-filter'),
      scrim: getComputedStyle(controller, '::before').backgroundImage,
    };
  });
  expect(bar.blur).toBe('none');
  expect(bar.scrim).toContain('linear-gradient');
});
