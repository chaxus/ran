import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { insideShadow } from '../../testing';
import { isolatedSetup, mount } from './helpers';

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test.describe(`input primitives with ${reducedMotion} motion`, () => {
    test.use({ contextOptions: { reducedMotion } });

    test('disabled buttons reject actual pointer activation and recover when re-enabled', async ({ page, baseURL }) => {
      await isolatedSetup(page, baseURL ?? DEV_SERVER, 'r-button');
      await mount(page, '<r-button id="action" disabled><span>Save settings</span></r-button>');
      await page.locator('#action').evaluate((button) => {
        button.setAttribute('data-clicks', '0');
        button.addEventListener('click', () => {
          button.setAttribute('data-clicks', String(Number(button.getAttribute('data-clicks')) + 1));
        });
      });
      const action = page.locator('#action');
      const box = (await action.boundingBox())!;
      // Real pointer input bypasses the driver's aria-disabled actionability shortcut.
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      await expect(action).toHaveAttribute('data-clicks', '0');
      await action.evaluate((button) => (button as HTMLElement).click());
      await expect(action).toHaveAttribute('data-clicks', '0');
      await action.evaluate((button) => button.removeAttribute('disabled'));
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      await expect(action).toHaveAttribute('data-clicks', '1');
    });

    test('Tab exposes a visible focus indicator on the button keyboard surface', async ({
      page,
      baseURL,
      browserName,
    }) => {
      await isolatedSetup(page, baseURL ?? DEV_SERVER, 'r-button');
      await mount(page, '<button id="before">Previous action</button><r-button id="keyboard">Save settings</r-button>');
      await page.locator('#before').focus();
      await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
      const focused = await insideShadow(page, '#keyboard', (root) => {
        const surface = root.querySelector<HTMLElement>('[part="button"]')!;
        const style = getComputedStyle(surface);
        return {
          active: root.activeElement === surface,
          visible: surface.matches(':focus-visible'),
          outline: style.outlineStyle,
          width: parseFloat(style.outlineWidth),
          offset: parseFloat(style.outlineOffset),
        };
      });
      expect(focused.active).toBe(true);
      expect(focused.visible).toBe(true);
      expect(focused.outline).toBe('solid');
      expect(focused.width).toBeGreaterThanOrEqual(2);
      // The host clips ripple overflow; an inset ring stays inside the visible target.
      expect(focused.offset).toBeLessThanOrEqual(-focused.width);
    });

    test('popover dismissal restores the documented r-button trigger keyboard surface', async ({ page, baseURL }) => {
      await isolatedSetup(page, baseURL ?? DEV_SERVER, 'r-popover');
      await mount(
        page,
        '<r-popover id="options" trigger="click"><r-button id="trigger">Options</r-button><r-content><button id="panel-action">Panel action</button></r-content></r-popover>',
      );
      await page.locator('#trigger').click();
      await expect(page.locator('#options')).toHaveAttribute('open', '');
      await page.locator('#panel-action').focus();
      await page.keyboard.press('Escape');
      await expect(page.locator('#options')).not.toHaveAttribute('open');
      expect(
        await insideShadow(page, '#trigger', (root) => root.activeElement === root.querySelector('[part="button"]')),
      ).toBe(true);
      const ring = await insideShadow(page, '#trigger', (root) => {
        const surface = root.activeElement!;
        const style = getComputedStyle(surface);
        return {
          visible: surface.matches(':focus-visible'),
          outline: style.outlineStyle,
          width: parseFloat(style.outlineWidth),
        };
      });
      expect(ring.visible).toBe(true);
      expect(ring.outline).toBe('solid');
      expect(ring.width).toBeGreaterThanOrEqual(2);
      await page.keyboard.press('Enter');
      await expect(page.locator('#options')).toHaveAttribute('open', '');
    });

    test('a leading icon preserves the visible clickable native input label and form value', async ({
      page,
      baseURL,
    }) => {
      await isolatedSetup(page, baseURL ?? DEV_SERVER, 'r-input');
      await mount(
        page,
        '<form><r-input id="endpoint" label="Provider endpoint" icon="link" name="endpoint" value="https://api.example.test"></r-input></form>',
      );
      const field = page.locator('#endpoint');
      await expect(field).toHaveAttribute('label', 'Provider endpoint');
      const label = await insideShadow(page, '#endpoint', (root) => {
        const native = root.querySelector('input')!;
        const label = root.querySelector('label')!;
        const box = label.getBoundingClientRect();
        return {
          associated: [...native.labels!].includes(label),
          text: label.textContent,
          x: box.x,
          y: box.y,
          height: box.height,
        };
      });
      expect(label.associated).toBe(true);
      expect(label.text).toBe('Provider endpoint');
      expect(label.height).toBeGreaterThan(0);
      await page.mouse.click(label.x + 8, label.y + label.height / 2);
      expect(await insideShadow(page, '#endpoint', (root) => root.activeElement?.tagName)).toBe('INPUT');
      await field.evaluate((input) => input.setAttribute('icon', 'lock'));
      await expect(field).toHaveAttribute('label', 'Provider endpoint');
      expect(await page.locator('form').evaluate((form) => new FormData(form as HTMLFormElement).get('endpoint'))).toBe(
        'https://api.example.test',
      );
    });

    for (const fixed of [false, true]) {
      test(`labelled fields contain their control and helper with ${fixed ? 'fixed' : 'automatic'} height`, async ({
        page,
        baseURL,
      }) => {
        await isolatedSetup(page, baseURL ?? DEV_SERVER, 'r-input');
        await mount(
          page,
          `<div style="display:grid;gap:16px;width:280px">
          <r-input id="first" label="Provider endpoint" value="first" ${fixed ? 'style="height:96px;--ran-input-content-height:24px;--ran-input-content-min-height:24px"' : ''}></r-input>
          <r-input id="second" label="Access token" icon="lock" message="Keep this value private" value="second" ${fixed ? 'style="height:96px"' : ''}></r-input>
          <r-input id="plain" value="No caption" style="height:64px;--ran-input-content-height:24px;--ran-input-content-min-height:24px"></r-input>
        </div>`,
        );
        const first = await insideShadow(page, '#first', (root) => {
          const host = root.host.getBoundingClientRect();
          const control = root.querySelector('[part="input"]')!.getBoundingClientRect();
          const native = root.querySelector('input')!.getBoundingClientRect();
          return {
            hostBottom: host.bottom,
            hostHeight: host.height,
            controlBottom: control.bottom,
            centerOffset: Math.abs(native.y + native.height / 2 - control.y - control.height / 2),
          };
        });
        const second = await insideShadow(page, '#second', (root) => {
          const host = root.host.getBoundingClientRect();
          const label = root.querySelector('label')!.getBoundingClientRect();
          const control = root.querySelector('[part="input"]')!.getBoundingClientRect();
          const message = root.querySelector('[part="message"]')!.getBoundingClientRect();
          return {
            hostBottom: host.bottom,
            hostHeight: host.height,
            labelTop: label.top,
            controlBottom: control.bottom,
            messageTop: message.top,
            messageBottom: message.bottom,
          };
        });
        expect(Math.abs(first.controlBottom - first.hostBottom)).toBeLessThanOrEqual(0.5);
        expect(first.centerOffset).toBeLessThanOrEqual(0.5);
        expect(second.labelTop - first.controlBottom).toBeGreaterThanOrEqual(15.5);
        expect(second.controlBottom).toBeLessThanOrEqual(second.messageTop - 3.5);
        expect(Math.abs(second.messageBottom - second.hostBottom)).toBeLessThanOrEqual(0.5);
        if (fixed) {
          expect(first.hostHeight).toBe(96);
          expect(second.hostHeight).toBe(96);
        }
        const plain = await insideShadow(page, '#plain', (root) => {
          const host = root.host.getBoundingClientRect();
          const control = root.querySelector('[part="input"]')!.getBoundingClientRect();
          const input = root.querySelector('input')!.getBoundingClientRect();
          return {
            host: host.height,
            control: control.height,
            centerOffset: Math.abs(input.y + input.height / 2 - control.y - control.height / 2),
          };
        });
        expect(plain.host).toBe(64);
        expect(plain.control).toBe(64);
        expect(plain.centerOffset).toBeLessThanOrEqual(0.5);
      });
    }

    test('pending microphone permission offers a cancellable action without claiming to listen', async ({
      page,
      baseURL,
    }) => {
      // Only the native speech service is held; button, focus and Escape are real.
      await page.addInitScript(() => {
        const state = window as unknown as { SpeechRecognition: unknown; voiceStarts: number; voiceAborts: number };
        state.voiceStarts = 0;
        state.voiceAborts = 0;
        state.SpeechRecognition = class {
          onend?: () => void;
          start() {
            state.voiceStarts++;
          }
          stop() {
            this.onend?.();
          }
          abort() {
            state.voiceAborts++;
            this.onend?.();
          }
        };
      });
      await isolatedSetup(page, baseURL ?? DEV_SERVER, 'r-voice-button');
      await mount(page, '<r-voice-button id="voice" active-label="Cancel voice request"></r-voice-button>');
      const button = await insideShadow(page, '#voice', (root) => {
        const box = root.querySelector('button')!.getBoundingClientRect();
        return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
      });
      await page.mouse.click(button.x, button.y);
      await expect(page.locator('#voice')).not.toHaveAttribute('listening');
      expect(
        await insideShadow(page, '#voice', (root) => {
          const button = root.querySelector('button')!;
          return [
            button.getAttribute('aria-label'),
            button.getAttribute('aria-busy'),
            button.getAttribute('aria-pressed'),
          ];
        }),
      ).toEqual(['Cancel voice request', 'true', 'true']);
      await test.info().attach('pointer-activation-focus', {
        body: JSON.stringify(
          await page.evaluate(() => ({
            activeElement: document.activeElement?.tagName,
            activeId: document.activeElement?.id,
          })),
        ),
        contentType: 'application/json',
      });
      await page.keyboard.press('Escape');
      expect(
        await page.evaluate(() => {
          const state = window as unknown as { voiceStarts: number; voiceAborts: number };
          return [state.voiceStarts, state.voiceAborts];
        }),
      ).toEqual([1, 1]);
      expect(
        await insideShadow(page, '#voice', (root) => {
          const button = root.querySelector('button')!;
          return [
            button.getAttribute('aria-label'),
            button.getAttribute('aria-busy'),
            button.getAttribute('aria-pressed'),
          ];
        }),
      ).toEqual(['Start voice input', 'false', 'false']);
    });
  });
}
