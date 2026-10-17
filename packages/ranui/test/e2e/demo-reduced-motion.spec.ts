import { expect, test } from '@playwright/test';
import { demoSetup, mount } from './helpers';

for (const reducedMotion of ['reduce', 'no-preference'] as const) {
  test(`demo hover transforms honor ${reducedMotion}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    await demoSetup(page, 'r-card');
    await mount(
      page,
      ['home-card', 'demo-card', 'card', 'cta', 'swatch']
        .map((name) => {
          const tag = name === 'card' ? 'r-card' : 'div';
          return `<${tag} id="${name}" class="${name}${name === 'cta' ? ' cta-primary' : ''}" style="display:block;width:200px;min-height:48px;margin:24px">Hover target</${tag}>`;
        })
        .join(''),
    );
    for (const name of ['home-card', 'demo-card', 'card', 'cta', 'swatch']) {
      const target = page.locator(`#${name}`);
      await target.hover();
      if (reducedMotion === 'reduce') await expect(target).toHaveCSS('transform', 'none');
      else await expect(target).not.toHaveCSS('transform', 'none');
    }
  });
}
