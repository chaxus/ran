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

  test.describe('exit motion', () => {
    test.use({ contextOptions: { reducedMotion: 'no-preference' } });
    test('leave animation holds its faded end state after completion', async ({ page }) => {
      await page.goto(DEV_SERVER, { waitUntil: 'load' });
      await page.waitForFunction(() => !!customElements.get('r-message'));
      // Retain registration while removing demo rendering and resource work from the fixture.
      await page.setContent('<html><body></body></html>');

      const result = await page.evaluate(async () => {
        const message = document.createElement('r-message');
        message.setAttribute('content', 'fade completion test');
        message.style.setProperty('--ran-message-leave-animation-duration', '0.1s');
        document.body.appendChild(message);
        message.classList.add('message-leave');

        // Force style resolution before capturing the actual CSS animations. Hold the
        // leave class after completion, so API removal timers cannot race the assertion.
        const animationName = getComputedStyle(message).animationName;
        const animations = message.getAnimations();
        await Promise.all(animations.map((animation) => animation.finished));
        const opacities: number[] = [];
        for (let frame = 0; frame < 3; frame++) {
          await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
          opacities.push(parseFloat(getComputedStyle(message).opacity));
        }
        return { animationName, animationCount: animations.length, opacities };
      });

      expect(result.animationName).toBe('MessageMoveOut');
      expect(result.animationCount).toBeGreaterThan(0);
      expect(result.opacities).toHaveLength(3);
      for (const opacity of result.opacities) {
        expect(opacity).toBeLessThan(0.5);
      }
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
