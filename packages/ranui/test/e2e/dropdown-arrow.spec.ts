import { test, expect } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount, insideShadow } from './helpers';

// A side arrow points at the middle of what it belongs to: the panel, when nothing anchors it.
// The right arrow once sat above the panel's top edge, and the left one 5px high.
for (const side of ['left', 'right'] as const) {
  test(`a ${side} arrow centres on the panel at any height`, async ({ page }) => {
    await isolatedSetup(page, DEV_SERVER, 'r-dropdown');
    await mount(
      page,
      [36, 49, 120]
        .map(
          (h) =>
            `<r-dropdown arrow="${side}" style="display:block;width:220px;margin:24px 40px"><div style="height:${h}px"></div></r-dropdown>`,
        )
        .join(''),
    );
    for (const index of [0, 1, 2]) {
      const offset = await insideShadow(page, `r-dropdown:nth-of-type(${index + 1})`, (root) => {
        const panel = root.querySelector('.ranui-dropdown-container')!.getBoundingClientRect();
        const arrow = root.querySelector(`.${root.host.getAttribute('arrow')}`)!.getBoundingClientRect();
        return arrow.top + arrow.height / 2 - (panel.top + panel.height / 2);
      });
      expect(Math.abs(offset)).toBeLessThan(1);
    }
  });
}
