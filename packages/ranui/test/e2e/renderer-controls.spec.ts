import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { insideShadow, isolatedSetup, mount } from './helpers';

for (const owner of ['math', 'mermaid'] as const) {
  test(`${owner} keeps focus and target geometry while copy fails and retries`, async ({ page }) => {
    await isolatedSetup(page, DEV_SERVER, `r-${owner}`);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await mount(page, `<r-${owner} id="renderer" copy></r-${owner}>`);
    await page.evaluate((owner) => {
      const host = document.getElementById('renderer') as HTMLElement & { latex: string; code: string };
      if (owner === 'math') host.latex = 'x^2';
      else host.code = 'graph LR; A-->B;';
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async () => {
            throw new Error('Permission denied');
          },
        },
      });
    }, owner);
    await expect.poll(() => insideShadow(page, '#renderer', (root) => !!root.querySelector('button'))).toBe(true);
    const before = await insideShadow(page, '#renderer', (root) => {
      const button = root.querySelector('button')!;
      button.focus();
      const { width, height } = button.getBoundingClientRect();
      return { width, height };
    });
    await page.keyboard.press('Enter');
    await expect
      .poll(() => insideShadow(page, '#renderer', (root) => root.querySelector('[part="copy-status"]')?.textContent))
      .toBe('Could not copy. Try again.');
    expect(
      await insideShadow(page, '#renderer', (root) => {
        const button = root.querySelector('button')!;
        const { width, height } = button.getBoundingClientRect();
        return { focused: root.activeElement === button, width, height, disabled: button.disabled };
      }),
    ).toEqual({ focused: true, ...before, disabled: false });
    await page.evaluate(() =>
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: { writeText: async () => undefined },
      }),
    );
    await page.keyboard.press('Enter');
    await expect
      .poll(() => insideShadow(page, '#renderer', (root) => root.querySelector('button r-icon')?.getAttribute('name')))
      .toBe('check');
    expect(errors).toEqual([]);
  });
}

for (const owner of ['math', 'mermaid'] as const) {
  test(`${owner} preserves the focused copy button across a source update with overlapping writes`, async ({
    page,
  }) => {
    await isolatedSetup(page, DEV_SERVER, `r-${owner}`);
    await mount(page, `<r-${owner} id="renderer" copy></r-${owner}>`);
    await page.evaluate((owner) => {
      const host = document.getElementById('renderer') as HTMLElement & { latex: string; code: string };
      const state = { writes: [] as string[], finish: [] as Array<() => void>, copied: 0, rendered: 0 };
      Object.assign(window, { copyRecovery: state });
      host.addEventListener('copied', () => state.copied++);
      host.addEventListener('render', () => state.rendered++);
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: (text: string) =>
            new Promise<void>((resolve) => {
              state.writes.push(text);
              state.finish.push(resolve);
            }),
        },
      });
      if (owner === 'math') host.latex = 'x^2';
      else host.code = 'graph TD; A-->B;';
    }, owner);
    await expect.poll(() => page.evaluate(() => (window as any).copyRecovery.rendered)).toBeGreaterThan(0);
    await insideShadow(page, '#renderer', (root) => {
      const button = root.querySelector('button')!;
      Object.assign(window, { originalCopyButton: button });
      button.focus();
    });
    await page.keyboard.press('Enter');
    await page.evaluate((owner) => {
      const host = document.getElementById('renderer') as HTMLElement & { latex: string; code: string };
      (window as any).copyRecovery.rendered = 0;
      if (owner === 'math') host.latex = 'x^3';
      else host.code = 'graph TD; B-->C;';
    }, owner);
    await expect.poll(() => page.evaluate(() => (window as any).copyRecovery.rendered)).toBeGreaterThan(0);
    expect(
      await insideShadow(page, '#renderer', (root) => root.activeElement === (window as any).originalCopyButton),
    ).toBe(true);
    await page.keyboard.press('Enter');
    expect(await page.evaluate(() => (window as any).copyRecovery.writes)).toEqual(
      owner === 'math' ? ['x^2', 'x^3'] : ['graph TD; A-->B;', 'graph TD; B-->C;'],
    );
    await page.evaluate(() => (window as any).copyRecovery.finish[0]());
    expect(
      await insideShadow(page, '#renderer', (root) => root.querySelector('button')?.getAttribute('aria-busy')),
    ).toBe('true');
    await page.keyboard.press('Enter');
    expect(await page.evaluate(() => (window as any).copyRecovery.writes.length)).toBe(2);
    await page.evaluate(() => (window as any).copyRecovery.finish[1]());
    await expect.poll(() => page.evaluate(() => (window as any).copyRecovery.copied)).toBe(1);
    expect(
      await insideShadow(
        page,
        '#renderer',
        (root) =>
          root.activeElement === (window as any).originalCopyButton &&
          !root.querySelector('button')?.hasAttribute('aria-busy'),
      ),
    ).toBe(true);
  });
}

test('MathML copy waits for the replaced formula instead of copying the previous frame', async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-math');
  await mount(page, '<r-math id="renderer" copy="mathml"></r-math>');
  await page.evaluate(() => {
    (document.getElementById('renderer') as any).latex = 'x^2';
  });
  await expect
    .poll(() => insideShadow(page, '#renderer', (root) => root.querySelector('math')?.textContent))
    .toContain('x^2');
  await page.evaluate(() => {
    Object.assign(window, { mathmlWrites: [] });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          (window as any).mathmlWrites.push(text);
        },
      },
    });
    const host = document.getElementById('renderer') as any;
    const button = host._shadowDom.querySelector('button') as HTMLButtonElement;
    Object.assign(window, { originalMathmlButton: button });
    button.focus();
    host.latex = 'x^3';
    button.click();
  });
  await expect.poll(() => page.evaluate(() => (window as any).mathmlWrites.length)).toBe(1);
  expect(await page.evaluate(() => (window as any).mathmlWrites[0])).toContain('x^3');
  expect(await page.evaluate(() => (window as any).mathmlWrites[0])).not.toContain('x^2');
  expect(
    await insideShadow(page, '#renderer', (root) => root.activeElement === (window as any).originalMathmlButton),
  ).toBe(true);
});

test('wide matrices scroll inside their body without widening a narrow page or moving controls', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await isolatedSetup(page, DEV_SERVER, 'r-math');
  await mount(page, '<r-math id="renderer" copy></r-math>');
  await page.evaluate(() => {
    (document.getElementById('renderer') as HTMLElement & { latex: string }).latex =
      String.raw`\begin{pmatrix} 123456789 & 123456789 & 123456789 & 123456789 & 123456789 & 123456789 & 123456789 & 123456789 \end{pmatrix}`;
  });
  await expect.poll(() => insideShadow(page, '#renderer', (root) => !!root.querySelector('math'))).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(360);
  expect(
    await insideShadow(page, '#renderer', (root) => {
      const body = root.querySelector('[part="render"]') as HTMLElement;
      const button = root.querySelector('button')!;
      const before = button.getBoundingClientRect().x;
      body.scrollLeft = 200;
      return {
        scrollable: body.scrollWidth > body.clientWidth,
        scrolled: body.scrollLeft > 0,
        controlMoved: button.getBoundingClientRect().x !== before,
      };
    }),
  ).toEqual({ scrollable: true, scrolled: true, controlMoved: false });
});

test.describe('touch renderer controls', () => {
  test.use({ hasTouch: true, viewport: { width: 360, height: 800 } });
  for (const owner of ['math', 'mermaid'] as const) {
    test(`${owner} exposes controls without hover and gives them touch targets`, async ({ page }) => {
      await isolatedSetup(page, DEV_SERVER, `r-${owner}`);
      await mount(page, `<r-${owner} id="renderer" copy download></r-${owner}>`);
      await page.evaluate((owner) => {
        const host = document.getElementById('renderer') as HTMLElement & { latex: string; code: string };
        if (owner === 'math') host.latex = 'x^2';
        else host.code = 'graph LR; A-->B;';
      }, owner);
      await expect.poll(() => insideShadow(page, '#renderer', (root) => !!root.querySelector('button'))).toBe(true);
      expect(
        await insideShadow(page, '#renderer', (root) => {
          const toolbar = root.querySelector('[part="toolbar"]')!;
          return {
            opacity: getComputedStyle(toolbar).opacity,
            hit: getComputedStyle(toolbar).pointerEvents,
            targets: [...toolbar.querySelectorAll('button')].every((button) => {
              const rect = button.getBoundingClientRect();
              return rect.width >= 44 && rect.height >= 44;
            }),
          };
        }),
      ).toEqual({ opacity: '1', hit: 'auto', targets: true });
    });
  }
});

for (const touch of [false, true]) {
  test.describe(`compact renderer action rows (${touch ? 'touch' : 'fine pointer'})`, () => {
    test.use({ hasTouch: touch, viewport: { width: 360, height: 900 } });
    for (const owner of ['math', 'mermaid'] as const) {
      test(`${owner} shows a compact row, wraps errors without overlap and reserves nothing without controls`, async ({
        page,
      }) => {
        await isolatedSetup(page, DEV_SERVER, `r-${owner}`);
        await mount(page, `<r-${owner} id="renderer" copy></r-${owner}>`);
        await page.evaluate((owner) => {
          const host = document.getElementById('renderer') as any;
          if (owner === 'math') host.latex = 'x^2';
          else host.code = 'graph LR; A-->B;';
          host.setAttribute(
            'label-copy-error',
            'The clipboard permission was denied. Allow clipboard access in your browser and try copying this content again.',
          );
          Object.defineProperty(navigator, 'clipboard', {
            configurable: true,
            value: {
              writeText: async () => {
                throw new Error('denied');
              },
            },
          });
        }, owner);
        await expect
          .poll(() => insideShadow(page, '#renderer', (root) => !!root.querySelector('math, svg')))
          .toBe(true);
        await page.mouse.move(0, 0);
        const row = await insideShadow(page, '#renderer', (root) => {
          const toolbar = root.querySelector('[part="toolbar"]') as HTMLElement;
          const body = root.querySelector('[part="render"], [part="diagram"]') as HTMLElement;
          const tr = toolbar.getBoundingClientRect();
          return {
            height: tr.height,
            gap: body.getBoundingClientRect().top - tr.bottom,
            opacity: getComputedStyle(toolbar).opacity,
            first: toolbar.parentElement?.firstElementChild === toolbar,
            shadow: getComputedStyle(toolbar).boxShadow,
          };
        });
        expect(row).toEqual({ height: touch ? 44 : 32, gap: 8, opacity: '1', first: true, shadow: 'none' });
        await insideShadow(page, '#renderer', (root) => (root.querySelector('button') as HTMLButtonElement).click());
        await expect
          .poll(() => insideShadow(page, '#renderer', (root) => !!root.querySelector('[part="copy-status"]')))
          .toBe(true);
        expect(
          await insideShadow(page, '#renderer', (root) => {
            const toolbar = root.querySelector('[part="toolbar"]')!.getBoundingClientRect();
            const body = root.querySelector('[part="render"], [part="diagram"]')!.getBoundingClientRect();
            const status = root.querySelector('[part="copy-status"]')!.getBoundingClientRect();
            const button = root.querySelector('button')!.getBoundingClientRect();
            return status.right <= button.left && body.top >= toolbar.bottom + 7.5 && status.bottom <= toolbar.bottom;
          }),
        ).toBe(true);
        await page.evaluate(() => document.getElementById('renderer')!.removeAttribute('copy'));
        expect(
          await insideShadow(page, '#renderer', (root) => {
            const toolbar = root.querySelector('[part="toolbar"]')!.getBoundingClientRect();
            const body = root.querySelector('[part="render"], [part="diagram"]')!;
            return {
              toolbarHeight: toolbar.height,
              extraTop: body.getBoundingClientRect().top - body.parentElement!.getBoundingClientRect().top,
            };
          }),
        ).toEqual({ toolbarHeight: 0, extraTop: 0 });
      });
    }
  });
}

test('mermaid hides its temporary document measurement tree without suppressing final SVG geometry', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 900 });
  await isolatedSetup(page, DEV_SERVER, 'r-mermaid');
  await mount(page, '<r-mermaid id="renderer"></r-mermaid>');
  const result = await page.evaluate(async () => {
    const host = document.getElementById('renderer') as any;
    const visibility: string[] = [];
    const sample = () => {
      for (const node of document.querySelectorAll<HTMLElement>('[id^="dran-mermaid-"]')) {
        visibility.push(getComputedStyle(node).visibility);
        const svg = node.querySelector('svg');
        if (svg) visibility.push(getComputedStyle(svg).visibility);
      }
    };
    const observer = new MutationObserver(sample);
    observer.observe(document.body, { childList: true, subtree: true });
    const rendered = new Promise<void>((resolve) => host.addEventListener('render', () => resolve(), { once: true }));
    host.code = 'graph LR; A[Review]-->B[Complete];';
    await rendered;
    observer.disconnect();
    const svg = host._shadowDom.querySelector('svg') as SVGSVGElement;
    const scene = svg.querySelector('.root') as SVGGraphicsElement;
    return {
      visibility,
      finalVisibility: getComputedStyle(svg).visibility,
      viewportWidth: svg.viewBox.baseVal.width,
      contentWidth: scene.getBBox().width,
    };
  });
  expect(result.visibility.length).toBeGreaterThan(0);
  expect(result.visibility.every((value) => value === 'hidden')).toBe(true);
  expect(result.finalVisibility).toBe('visible');
  expect(result.contentWidth).toBeGreaterThan(0);
  expect(result.viewportWidth - result.contentWidth).toBeLessThanOrEqual(32);
});

test('mermaid fits its graph after host reduced-motion CSS affects the temporary render container', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await isolatedSetup(page, DEV_SERVER, 'r-mermaid');
  // Reproduce the host demo's actual reduced-motion rule rather than the
  // harness's faster global transition freeze. The SVG measurement is in body.
  await page.addStyleTag({
    content:
      '@media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition-duration: .01ms !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; } }',
  });
  await mount(page, '<r-mermaid id="renderer"></r-mermaid>');
  await page.evaluate(() => {
    (document.getElementById('renderer') as HTMLElement & { code: string }).code =
      'flowchart TD\n A[Draft proposal] --> B{Review complete?}\n B -->|Yes| C[Publish release]\n B -->|No| D[Resolve findings]\n D --> B';
  });
  await expect.poll(() => insideShadow(page, '#renderer', (root) => !!root.querySelector('svg .root'))).toBe(true);
  const geometry = await insideShadow(page, '#renderer', (root) => {
    const svg = root.querySelector('svg')!;
    const scene = svg.querySelector<SVGGraphicsElement>('.root')!;
    const bounds = scene.getBBox();
    return { viewportWidth: svg.viewBox.baseVal.width, contentWidth: bounds.width };
  });
  // Mermaid's default diagram padding is 8 px per edge. Allow the surrounding
  // stroke/rounding space, but never an offscreen measurement canvas in the viewBox.
  expect(geometry.viewportWidth - geometry.contentWidth).toBeLessThanOrEqual(32);
});

for (const touch of [false, true]) {
  test.describe(`download menu after wrapped copy failure (${touch ? 'touch' : 'fine pointer'})`, () => {
    test.use({ hasTouch: touch, viewport: { width: 360, height: 900 } });
    for (const owner of ['math', 'mermaid'] as const) {
      test(`${owner} anchors its download menu below the expanded action row`, async ({ page }, testInfo) => {
        await isolatedSetup(page, DEV_SERVER, `r-${owner}`);
        await mount(page, `<r-${owner} id="renderer" copy download style="width: 320px"></r-${owner}>`);
        await page.evaluate((owner) => {
          const host = document.getElementById('renderer') as any;
          if (owner === 'math') host.latex = 'x^2';
          else host.code = 'graph LR; A[Draft]-->B[Review];';
          host.setAttribute(
            'label-copy-error',
            'The clipboard permission was denied. Allow clipboard access in your browser settings and try copying this content again. Your content has not changed.',
          );
          Object.defineProperty(navigator, 'clipboard', {
            configurable: true,
            value: {
              writeText: async () => {
                throw new Error('denied');
              },
            },
          });
        }, owner);
        await expect
          .poll(() => insideShadow(page, '#renderer', (root) => !!root.querySelector('math, svg')))
          .toBe(true);
        await insideShadow(page, '#renderer', (root) => (root.querySelector('button') as HTMLButtonElement).click());
        await expect
          .poll(() => insideShadow(page, '#renderer', (root) => !!root.querySelector('[part="copy-status"]')))
          .toBe(true);
        await insideShadow(page, '#renderer', (root) =>
          (root.querySelectorAll('button')[1] as HTMLButtonElement).focus(),
        );
        await page.keyboard.press('Enter');
        await expect
          .poll(() => insideShadow(page, '#renderer', (root) => !!root.querySelector('[part="menu"]')))
          .toBe(true);
        await page.screenshot({ path: testInfo.outputPath('wrapped-error-download.png'), fullPage: true });
        const geometry = await insideShadow(page, '#renderer', (root) => {
          const toolbar = root.querySelector('[part="toolbar"]')!.getBoundingClientRect();
          const menu = root.querySelector('[part="menu"]')!.getBoundingClientRect();
          return { toolbarHeight: toolbar.height, gap: menu.top - toolbar.bottom };
        });
        expect(geometry.toolbarHeight).toBeGreaterThan(touch ? 44 : 32);
        expect(geometry.gap).toBeGreaterThanOrEqual(7.5);
        await page.keyboard.press('Tab');
        expect(
          await insideShadow(
            page,
            '#renderer',
            (root) => root.activeElement === root.querySelector('[part="menu"] button'),
          ),
        ).toBe(true);
      });
    }
  });
}
