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
      if (reducedMotion === 'reduce' || name === 'demo-card' || name === 'card')
        await expect(target).toHaveCSS('transform', 'none');
      else await expect(target).not.toHaveCSS('transform', 'none');
    }
  });
}

for (const touch of [false, true]) {
  test.describe(`inert component stage (${touch ? 'touch' : 'mouse'})`, () => {
    test.use({ hasTouch: touch });
    test('child interaction does not promote or move its container', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await demoSetup(page, 'r-card');
      await mount(
        page,
        '<div class="demo-card" id="frame"><button>Open example</button></div><r-card id="card"><button>Card action</button></r-card>',
      );
      for (const id of ['frame', 'card']) {
        const target = page.locator(`#${id}`);
        const appearance = (el: HTMLElement) => {
          const frame = (el as HTMLElement & { _shadowDom?: ShadowRoot })._shadowDom?.querySelector('.ran-card') ?? el;
          return {
            border: getComputedStyle(frame).borderColor,
            shadow: getComputedStyle(frame).boxShadow,
            y: el.getBoundingClientRect().y,
          };
        };
        const before = await target.evaluate(appearance);
        if (touch) await target.locator('button').tap();
        else await target.locator('button').hover();
        await expect(target).toHaveCSS('transform', 'none');
        expect(await target.evaluate(appearance)).toEqual(before);
      }
    });
  });
}
