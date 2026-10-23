import { test, expect } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount, settlePending } from './helpers';

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-loading');
});
for (const name of ['circle', 'circle-fold', 'cube-fold', 'dot-bar', 'triple-bounce']) {
  test(`${name} retains visible ink with reduced motion`, async ({ page }) => {
    await mount(page, `<r-loading name="${name}"></r-loading>`);
    await settlePending(page, 'r-loading');
    await page.waitForTimeout(80);
    const ink = await page.locator('r-loading').evaluate((host, variant) => {
      const root = (host as HTMLElement & { _shadowDom: ShadowRoot })._shadowDom;
      const target = root.querySelector(
        variant === 'circle'
          ? '.circle1'
          : variant === 'circle-fold'
            ? '.circle-fold-item'
            : variant === 'cube-fold'
              ? '.cube-fold-item'
              : variant === 'dot-bar'
                ? '.dot-bar-item'
                : '.triple-bounce1',
      )!;
      const style = getComputedStyle(target, variant === 'circle-fold' || variant === 'cube-fold' ? '::before' : null);
      const matrix = new DOMMatrixReadOnly(style.transform === 'none' ? undefined : style.transform);
      return { opacity: Number(style.opacity), scale: Math.hypot(matrix.a, matrix.b) };
    }, name);
    expect(ink.opacity).toBeGreaterThan(0.2);
    expect(ink.scale).toBeGreaterThan(0.2);
  });
}
test('text loading is readable and fits a narrow parent in both themes', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 600 });
  for (const theme of ['light', 'dark']) {
    await page.evaluate((t) => document.documentElement.setAttribute('data-ran-theme', t), theme);
    await mount(page, '<r-loading name="text"></r-loading>');
    await settlePending(page, 'r-loading');
    await page.waitForFunction(
      () =>
        !!(document.querySelector('r-loading') as HTMLElement & { _shadowDom: ShadowRoot })?._shadowDom.querySelector(
          '.text',
        ),
    );
    const result = await page.locator('r-loading').evaluate((host) => {
      const el = (host as HTMLElement & { _shadowDom: ShadowRoot })._shadowDom.querySelector('.text')!;
      const style = getComputedStyle(el);
      return {
        font: parseFloat(style.fontSize),
        color: style.color,
        overflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    expect(result.font).toBeLessThanOrEqual(16);
    expect(result.font).toBeGreaterThanOrEqual(14);
    expect(result.color).not.toBe('rgba(0, 0, 0, 0)');
    expect(result.overflow).toBe(false);
  }
});

test('scratch has native keyboard reveal without exposing covered content or losing focus', async ({
  page,
  browserName,
}) => {
  // macOS WebKit follows Safari's native links/buttons preference; Option+Tab traverses all controls.
  const tab = browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
  await mount(
    page,
    `<button id="before">Before</button><r-scratch reveal-label="Reveal reward" revealed-label="Reward revealed" style="width:240px;height:120px"><a href="#reward" id="reward">Open reward</a></r-scratch><button id="after">After</button>`,
  );
  await page.locator('#before').focus();
  await page.keyboard.press(tab);
  const state = () =>
    page.locator('r-scratch').evaluate((host) => {
      const root = (host as HTMLElement & { _shadowDom: ShadowRoot })._shadowDom;
      const button = root.querySelector('button')!;
      const canvas = root.querySelector('canvas')!;
      const pixels = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height).data;
      let alpha = 0;
      for (let i = 3; i < pixels.length; i += 4) alpha += pixels[i];
      return {
        focus: root.activeElement === button,
        button: button.textContent,
        outline: getComputedStyle(button).outlineStyle,
        alpha,
        inert: (root.querySelector('.ran-scratch-ticket-award') as HTMLElement).inert,
      };
    });
  expect(await state()).toMatchObject({ focus: true, button: 'Reveal reward', outline: 'solid', inert: true });
  await page.keyboard.press('Enter');
  expect(await state()).toMatchObject({ focus: true, button: 'Reward revealed', alpha: 0, inert: false });
  await page.keyboard.press(tab);
  await expect(page.locator('#reward')).toBeFocused();
});

test('scratch preserves erased pixels over disabled flips and a midgesture reconnect', async ({ page }) => {
  await mount(page, '<r-scratch style="width:240px;height:120px">Reward</r-scratch>');
  const scratch = page.locator('r-scratch');
  const box = await scratch.evaluate((host) => {
    const canvas = (host as HTMLElement & { _shadowDom: ShadowRoot })._shadowDom.querySelector('canvas')!;
    const rect = canvas.getBoundingClientRect();
    return { x: rect.x, y: rect.y };
  });
  await page.mouse.move(box.x + 25, box.y + 25);
  await page.mouse.down();
  await page.mouse.move(box.x + 70, box.y + 25, { steps: 6 });
  const probe = () =>
    scratch.evaluate((host) => {
      const el = host as HTMLElement & {
        _shadowDom: ShadowRoot;
        state: { isScratching: boolean; scratchedArea: number };
      };
      const canvas = el._shadowDom.querySelector('canvas')!;
      const pixels = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height).data;
      let alpha = 0;
      for (let i = 3; i < pixels.length; i += 4) alpha += pixels[i];
      return { alpha, area: el.state.scratchedArea, active: el.state.isScratching };
    });
  const before = await probe();
  expect(before.active).toBe(true);
  expect(before.area).toBeGreaterThan(0);
  await scratch.evaluate((host) => {
    host.setAttribute('disabled', '');
    host.removeAttribute('disabled');
  });
  expect(await probe()).toEqual({ ...before, active: false });
  await page.mouse.up();
  await page.mouse.move(box.x + 30, box.y + 45);
  await page.mouse.down();
  const partial = await probe();
  await scratch.evaluate((host) => {
    const parent = host.parentNode!;
    host.remove();
    parent.appendChild(host);
  });
  expect(await probe()).toEqual({ ...partial, active: false });
  await page.mouse.up();
  await page.mouse.move(box.x + 30, box.y + 65);
  await page.mouse.down();
  await page.mouse.move(box.x + 70, box.y + 65, { steps: 4 });
  await page.mouse.up();
  expect((await probe()).alpha).toBeLessThan(partial.alpha);
});

test('large geometric loading frames fit their narrow parent during normal motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const name of ['cube-dim', 'dot-line']) {
    await mount(page, `<section style="width:240px"><r-loading name="${name}"></r-loading></section>`);
    await settlePending(page, 'r-loading');
    for (let sample = 0; sample < 12; sample++) {
      const bounds = await page.locator('r-loading').evaluate((host) => {
        const el = host as HTMLElement & { _shadowDom: ShadowRoot };
        const parent = host.parentElement!.getBoundingClientRect();
        const frame = el._shadowDom.querySelector('.ran-loading')!.firstElementChild!.getBoundingClientRect();
        return { parent: { left: parent.left, right: parent.right }, frame: { left: frame.left, right: frame.right } };
      });
      expect(bounds.frame.left).toBeGreaterThanOrEqual(bounds.parent.left - 1);
      expect(bounds.frame.right).toBeLessThanOrEqual(bounds.parent.right + 1);
      await page.waitForTimeout(50);
    }
  }
});

for (const dpr of [1, 2]) {
  test.describe(`scratch cover at DPR ${dpr}`, () => {
    test.use({ deviceScaleFactor: dpr });
    test('paints an opaque cover before any gesture', async ({ page }) => {
      // 300×150 CSS pixels; the backing buffer must scale with the display density.
      const height = await page.evaluate(() => (matchMedia('(pointer: coarse)').matches ? 202 : 190));
      await mount(page, `<r-scratch style="width:300px;height:${height}px">Hidden reward</r-scratch>`);
      const cover = await page.locator('r-scratch').evaluate((host) => {
        const canvas = (host as HTMLElement & { _shadowDom: ShadowRoot })._shadowDom.querySelector('canvas')!;
        const rect = canvas.getBoundingClientRect();
        return {
          cssWidth: rect.width,
          cssHeight: rect.height,
          width: canvas.width,
          height: canvas.height,
          alpha: canvas.getContext('2d')!.getImageData(0, 0, 1, 1).data[3],
        };
      });
      expect(cover).toEqual({ cssWidth: 300, cssHeight: 150, width: 300 * dpr, height: 150 * dpr, alpha: 255 });
    });
  });
}

test('revealed scratch keeps a bottom-corner reward action unobstructed', async ({ page }) => {
  await mount(
    page,
    `<r-scratch style="width:300px;height:180px"><div style="position:relative;width:100%;height:100%"><button id="claim" style="position:absolute;right:8px;bottom:8px;width:100px;height:32px" onclick="this.textContent='Claimed'">Claim reward</button></div></r-scratch>`,
  );
  await page.locator('r-scratch').evaluate((host) => {
    (host as HTMLElement & { _shadowDom: ShadowRoot })._shadowDom.querySelector('button')!.focus();
  });
  await page.keyboard.press('Enter');
  const corner = await page.locator('#claim').boundingBox();
  expect(corner).not.toBeNull();
  await page.mouse.click(corner!.x + corner!.width / 2, corner!.y + corner!.height / 2);
  await expect(page.locator('#claim')).toHaveText('Claimed');
});

test('scratch reset returns owned reward focus to reveal while retaining external focus', async ({
  page,
  browserName,
}) => {
  const tab = browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
  await page.setViewportSize({ width: 360, height: 700 });
  await mount(
    page,
    '<r-scratch style="width:100%;height:180px"><a id="reward" href="#reward">Open reward</a></r-scratch><button id="outside">Outside</button>',
  );
  const revealFocused = () =>
    page.locator('r-scratch').evaluate((host) => {
      const root = (host as HTMLElement & { _shadowDom: ShadowRoot })._shadowDom;
      return root.activeElement === root.querySelector('button');
    });
  await page.locator('r-scratch').evaluate((host) => {
    (host as HTMLElement & { _shadowDom: ShadowRoot })._shadowDom.querySelector('button')!.focus();
  });
  await page.keyboard.press('Enter');
  await page.keyboard.press(tab);
  await expect(page.locator('#reward')).toBeFocused();
  await page.setViewportSize({ width: 400, height: 700 });
  await expect.poll(revealFocused).toBe(true);
  await page.keyboard.press('Space');
  await page.keyboard.press(tab);
  await expect(page.locator('#reward')).toBeFocused();
  await page.locator('#outside').focus();
  await page.setViewportSize({ width: 420, height: 700 });
  await expect(page.locator('#outside')).toBeFocused();
});
