import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

test.describe('message', () => {
  test('supports top, zIndex and getContainer', async ({ page }) => {
    await page.goto(DEV_SERVER, { waitUntil: 'load' });
    await page.waitForFunction(() => typeof (window as any).message?.info === 'function');

    await page.evaluate(() => {
      const existed = document.getElementById('custom-message-root');
      if (existed) {
        existed.remove();
      }
      const root = document.createElement('div');
      root.id = 'custom-message-root';
      document.body.appendChild(root);

      (window as any).message?.info({
        content: 'custom container message',
        duration: 5000,
        top: 40,
        zIndex: 2222,
        getContainer: () => root,
      });
    });

    const host = page.locator('#custom-message-root [data-ranui-message-host="true"]');
    await expect(host).toBeVisible();
    await expect(host).toHaveCSS('top', '40px');
    await expect(host).toHaveCSS('z-index', '2222');
    await expect(page.locator('#custom-message-root r-message')).toHaveCount(1);
  });

  test('reuses one host in same container and updates host style per call', async ({ page }) => {
    await page.goto(DEV_SERVER, { waitUntil: 'load' });
    await page.waitForFunction(() => typeof (window as any).message?.success === 'function');

    await page.evaluate(() => {
      const messageApi = (window as any).message;
      if (!messageApi || typeof messageApi.success !== 'function') {
        console.error('window.message is not initialized correctly:', messageApi);
        throw new Error('window.message.success is not a function');
      }

      const existed = document.getElementById('custom-message-root-2');
      if (existed) {
        existed.remove();
      }
      const root = document.createElement('div');
      root.id = 'custom-message-root-2';
      document.body.appendChild(root);

      messageApi.success({
        content: 'first',
        duration: 5000,
        top: 12,
        zIndex: 1300,
        getContainer: () => root,
      });

      messageApi.warning({
        content: 'second',
        duration: 5000,
        top: 28,
        zIndex: 1400,
        getContainer: () => root,
      });
    });

    const host = page.locator('#custom-message-root-2 [data-ranui-message-host="true"]');
    await expect(host).toHaveCount(1);
    await expect(host).toHaveCSS('top', '28px');
    await expect(host).toHaveCSS('z-index', '1400');
    await expect(page.locator('#custom-message-root-2 r-message')).toHaveCount(2);
  });

  test.describe('motion', () => {
    test.use({ contextOptions: { reducedMotion: 'no-preference' } });
    // What a reader sees, frame by frame: a toast slides into place without overshooting or
    // swelling, leaves completely, and the one below it glides up rather than jumping.
    test('enters without overshoot, leaves completely, and the stack glides', async ({ page, browserName }) => {
      // Headless WebKit delays the first timer after these two toasts mount by about 1.3s, so the
      // trace starts after the entrance is over. Whether Safari shows that delay is still open;
      // the motion itself is traced in Chromium and Firefox.
      test.skip(browserName === 'webkit', 'headless WebKit stalls the trace for ~1.3s after mount');
      await page.goto(DEV_SERVER, { waitUntil: 'load' });
      await page.waitForFunction(() => !!(window as any).message);
      await page.setContent('<html><body></body></html>');

      const trace = await page.evaluate(async () => {
        const api = (window as any).message;
        api.info({ content: 'first', duration: 900 });
        api.success({ content: 'second', duration: 3000 });
        const [first, second] = [...document.querySelectorAll('r-message')] as HTMLElement[];
        const frames: Array<{
          t: number;
          top: number;
          height: number;
          opacity: number;
          secondTop: number;
          inDom: boolean;
        }> = [];
        const t0 = performance.now();
        while (performance.now() - t0 < 1500) {
          // A timer, not requestAnimationFrame: WebKit runs no frames while nothing animates.
          await new Promise<void>((resolve) => setTimeout(resolve, 16));
          frames.push({
            t: performance.now() - t0,
            top: first.getBoundingClientRect().top,
            height: first.getBoundingClientRect().height,
            opacity: parseFloat(getComputedStyle(first).opacity),
            secondTop: second.getBoundingClientRect().top,
            inDom: first.isConnected,
          });
        }
        return frames;
      });

      // A slow runner samples sparsely, so read windows, not single samples: the toast has
      // settled after its 400ms entrance and stays put until its 200ms exit starts at 700ms.
      const entering = trace.filter((frame) => frame.t < 400);
      const rest = trace.filter((frame) => frame.t > 420 && frame.t < 680).at(-1)!.top;
      for (let i = 1; i < entering.length; i++)
        expect(entering[i]!.top).toBeGreaterThanOrEqual(entering[i - 1]!.top - 0.5);
      expect(Math.max(...entering.map((frame) => frame.top))).toBeLessThanOrEqual(rest + 0.5);
      expect(new Set(trace.filter((frame) => frame.inDom).map((frame) => Math.round(frame.height))).size).toBe(1);

      const gone = trace.findIndex((frame) => !frame.inDom);
      expect(gone).toBeGreaterThan(0);
      // The last sample before removal is at most one interval from the end of a 200ms fade.
      expect(trace[gone - 1]!.opacity).toBeLessThan(0.5);
      const leaving = trace.slice(0, gone).filter((frame) => frame.t > 700);
      for (let i = 1; i < leaving.length; i++)
        expect(leaving[i]!.opacity).toBeLessThanOrEqual(leaving[i - 1]!.opacity + 0.01);
      // The second toast's steps once the first is gone: many small ones, none a jump.
      const steps = trace.slice(gone).map((frame, i, all) => (i ? all[i - 1]!.secondTop - frame.secondTop : 0));
      expect(Math.max(...steps)).toBeLessThan(30);
      expect(trace.at(-1)!.secondTop).toBeCloseTo(rest, 0);
    });
  });
});

test('message respects hidden and safely expires after caller removal', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await isolatedSetup(page, DEV_SERVER, 'r-message');
  await mount(page, '<r-message hidden type="success" content="Saved"></r-message>');
  await expect(page.locator('r-message')).toBeHidden();
  await page.evaluate(() => {
    (window as any).message.success({ content: 'Temporary', duration: 400 });
    document.querySelector('[data-ranui-message-host="true"] r-message')!.remove();
  });
  await page.waitForTimeout(500);
  expect(errors).toEqual([]);
});

test('message wraps ordinary words between words and contains long unbroken text', async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-message');
  await mount(
    page,
    '<r-message style="width:312px" type="error" content="Export failed. Your file is unchanged. Retry the export."></r-message>',
  );
  const message = page.locator('r-message');
  const fragments = await message.evaluate((node) => {
    const span = (node as HTMLElement & { _span: HTMLSpanElement })._span;
    const text = span.firstChild!;
    const start = text.textContent!.indexOf('unchanged');
    const range = document.createRange();
    range.setStart(text, start);
    range.setEnd(text, start + 'unchanged'.length);
    return range.getClientRects().length;
  });
  expect(fragments).toBe(1);
  await message.evaluate((node) => node.setAttribute('content', 'x'.repeat(180)));
  const bounds = await message.evaluate((node) => {
    const span = (node as HTMLElement & { _span: HTMLSpanElement })._span;
    return { width: span.clientWidth, scrollWidth: span.scrollWidth };
  });
  expect(bounds.scrollWidth).toBeLessThanOrEqual(bounds.width + 1);
});
