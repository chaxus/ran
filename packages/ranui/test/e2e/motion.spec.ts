import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

type Shadowed = HTMLElement & { _shadowDom: ShadowRoot };

test.use({ contextOptions: { reducedMotion: 'no-preference' } });

// A press shrinks the visible surface through `scale`, so a transform the page sets on the
// content survives the press, and it lands within the guide's 100ms feedback budget.
test('a button shrinks while pressed and lets go within feedback time', async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-button');
  await mount(page, '<r-button id="b">Save</r-button>');
  const content = () =>
    page.locator('#b').evaluate((host) => {
      const style = getComputedStyle((host as Shadowed)._shadowDom.querySelector('.ran-btn-content')!);
      return { scale: style.scale, duration: style.transitionDuration, property: style.transitionProperty };
    });
  expect(await content()).toEqual({ scale: 'none', duration: '0.1s', property: 'scale' });
  const box = (await page.locator('#b').boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect.poll(async () => (await content()).scale).toBe('0.96');
  await page.mouse.up();
  await expect.poll(async () => (await content()).scale).toBe('none');
});

// The readout always holds the real value; only the characters that changed move.
test('a token count rolls in only its changed digits', async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-token-meter');
  await mount(page, '<r-token-meter id="m" limit="128000" used="4120"></r-token-meter>');
  // Set and read in one task: the roll lasts 300ms, and a slow runner can outlast it.
  const update = (used: string | null) =>
    page.locator('#m').evaluate((host, value) => {
      if (value) host.setAttribute('used', value);
      const text = (host as Shadowed)._shadowDom.querySelector('.ran-token-meter-text')!;
      const moving = text
        .getAnimations({ subtree: true })
        .map((animation) => ((animation.effect as KeyframeEffect).target as HTMLElement).textContent);
      return { text: text.textContent, moving };
    }, used);
  expect(await update(null)).toEqual({ text: 'Context 4.1k / 128k', moving: [] });
  expect(await update('4180')).toEqual({ text: 'Context 4.2k / 128k', moving: ['2'] });
});

// A stacked container piles toasts newest in front, the older ones peeking out below and
// drawn smaller; pointing at the pile fans them out so none overlaps another.
test('stacked toasts pile up and fan out under the pointer', async ({ page }) => {
  await page.goto(DEV_SERVER, { waitUntil: 'load' });
  await page.waitForFunction(() => !!(window as any).message);
  await page.setContent('<html><body></body></html>');
  await page.evaluate(() => {
    const api = (window as any).message;
    // The same text in each, so a narrower card can only mean a smaller one.
    for (let i = 0; i < 3; i++) api.info({ content: 'Saved', duration: 10000, stacked: true });
  });
  // Bounds of each toast's visible card, front (newest) first.
  const cards = () =>
    page.evaluate(() =>
      [...document.querySelectorAll('r-message')].reverse().map((toast) => {
        const card = (toast as Shadowed)._shadowDom.querySelector('.ran-message-notice-content')!;
        const { top, bottom, width } = card.getBoundingClientRect();
        return { top: Math.round(top), bottom: Math.round(bottom), width: Math.round(width) };
      }),
    );
  // Each check waits for the motion to land rather than for a fixed time: headless WebKit
  // can hold timers for a second or more after a page is replaced.
  type Card = { top: number; bottom: number; width: number };
  const piled = (list: Card[]) =>
    list.length === 3 &&
    list.slice(1).every((card, i) => {
      const before = list[i]!;
      // Behind the one in front, peeking out below it, and narrower.
      return card.bottom - before.bottom >= 8 && card.top < before.bottom && card.width < before.width;
    });
  const fannedOut = (list: Card[]) => list.slice(1).every((card, i) => card.top >= list[i]!.bottom);
  await expect.poll(async () => piled(await cards())).toBe(true);
  const front = (await cards())[0]!;
  await page.mouse.move(640, (front.top + front.bottom) / 2);
  await expect.poll(async () => fannedOut(await cards())).toBe(true);
  // Walking down to the oldest card crosses the gaps between cards; the pile never closes.
  await page.evaluate(() => {
    const list = document.querySelector('.ranui-message')!;
    (window as unknown as { closed: boolean }).closed = false;
    new MutationObserver(() => {
      if (!list.hasAttribute('data-expanded')) (window as unknown as { closed: boolean }).closed = true;
    }).observe(list, { attributeFilter: ['data-expanded'] });
  });
  const last = (await cards())[2]!;
  await page.mouse.move(640, (last.top + last.bottom) / 2, { steps: 8 });
  await expect.poll(async () => fannedOut(await cards())).toBe(true);
  expect(await page.evaluate(() => (window as unknown as { closed: boolean }).closed)).toBe(false);
  await page.mouse.move(640, 700);
  await expect.poll(async () => piled(await cards())).toBe(true);
});
